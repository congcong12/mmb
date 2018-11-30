$(function () {
    var pagePrevent = getQueryString('pagePrevent');
    var manmanbuy = new Manmanbuy(pagePrevent);
    manmanbuy.showProduct();
})

var Manmanbuy = function (pageStart) {
    this.pageStart = pageStart || 1;
};
Manmanbuy.prototype = {
    href: 'http://localhost:9090/',
    page: 0,
    pageNum: 0,
    pagesize: 10,
    // 一开始渲染页面
    showProduct: function () {
        var that = this;
        that.sendAjax(function (data) {
            pageNum = Math.ceil(data.totalCount / that.pagesize);
            data.page = that.pageStart;
            var html = template('productShowTpl', data);
            $('.productList').html(html);
            that.setPage(pageNum);
        }, that.pageStart);
    },

    // ajax请求
    sendAjax: function (callback, page) {
        var that = this;
        $.ajax({
            url: that.href + 'api/getmoneyctrl',
            data: {
                pageid: page
            },
            success: function (data) {
                callback(data);
            }
        });
    },

    // 分页功能
    setPage: function (pageNum) {
        var that = this;
        // 当前版本调用方法 如下
        var initpage = new Initpage({
            pageStart: that.pageStart, //默认显示页码
            pageCount: pageNum, // 总页数
            prefun: function (page) { //上一页回掉函数
                that.sendAjax(function (data) {
                    data.page = page;
                    var html = template('productShowTpl', data);
                    $('.productList').html(html);
                    document.documentElement.scrollTop = 0;
                }, page);
            },
            nextfun: function (page) { //下一页回掉函数
                that.sendAjax(function (data) {
                    data.page = page;
                    var html = template('productShowTpl', data);
                    $('.productList').html(html);
                    document.documentElement.scrollTop = 0;
                }, page);
            },
            callback: function (page) { // 输入框失去焦点后回调函数,参数为页码,可以不传
                that.sendAjax(function (data) {
                    data.page = page;
                    var html = template('productShowTpl', data);
                    $('.productList').html(html);
                }, page);
            }
        });
        initpage.init();
    }
}
//使用正则写的获取url地址栏参数的方法
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}