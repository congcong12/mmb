$(function () {
    var pagePrevent = getQueryString('pagePrevent');
    var manmanbuy = new Manmanbuy(pagePrevent);
    manmanbuy.showProduct();
    manmanbuy.circleTC();
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
    },
    preventThorough: function () {
        //阻止a标签的默认跳转--再给其添加tap事件
        $('.product-list').on('click', 'li a', function (e) {
            e.preventDefault();
        });

        //解决点透问题
        mui(document).on('tap', 'a', function () {
            var a = document.createElement('a');
            a = this.cloneNode(true);
            a.click();
        });
    },
    circleTC: function () {
        var that = this;
        $(".circle").on("tap", function (e) {
            // e.stopPropagation();
            var num = $(this).data("id");
            console.log(num);

            if (num == 0) {
                num=1
                $(".ring").addClass("open");
                console.log($(this).css("left").match(/\d/g)[0])
                if ($(this).css("left").match(/\d/g)[0]<45){
                console.log(111)
                    $(this).css({
                        left:45,
                        "transition": "all 0.4s ease-in-out 0s"
                    });
                } else {
                    $(this).css({
                        "transition": "all 0.4s ease-in-out 0s"
                    });
                }
               
             
            } else if(num ==1){
                num = 0;
                $(this).css({
                    "left":0,
                    "transition": "all 0.4s ease-out"
                });
                $(".ring").removeClass("open");
            }
            $(this).data("id", num);
            //阻止点透事件
            that.preventThorough();
        });

        var startY = moveY = distanceY = currentY = 0;
        var startX = moveX = distanceX = currentX = 0;

        $(".circle").on("touchstart", function (e) {
            // console.log(e);
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            // console.log(startY);
            // console.log(startX);
            // console.log($('.circle').css('left'))
            // console.log($('.circle').css('top'))

        });
        $(".circle").on("touchmove", function (e) {
            moveY = e.touches[0].clientY;
            // 滑动的距离 使用 滑动中的Y - 滑动开始的Y
            distanceY = moveY - startY;

            moveX = e.touches[0].clientX;
            var y = currentY + distanceY;
            // 滑动的距离 使用 滑动中的x - 滑动开始的x
            distanceX = moveX - startX;
            that.circleLeft = currentX + distanceX;
            var screenWidth = window.innerWidth;
            var screenHeight = window.innerHeight;;
            // console.log(screenWidth, that.circleLeft);
            that.circleLeft = that.circleLeft < 60 ? 60 : that.circleLeft;
            that.circleLeft = that.circleLeft > screenWidth-105 ? screenWidth-105 : that.circleLeft;
            y = y < 60 ? 60 : y;
            y = y+30 > screenHeight-60?screenHeight-60 : y;
            $(this).css({
                transform:"translate("+that.circleLeft+"px,"+y+"px)",
            });
        });
        $(".circle").on("touchend", function (e) {
            currentY += distanceY;
            currentX += distanceX;
        });

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