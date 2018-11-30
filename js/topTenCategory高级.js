$(function () {
    // 区域滚动初始化
    mui('#main>div.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 横向滚动给a添加类
    $('#slider li').on('tap', function () {
        $(this).find('a').addClass('active').parent().siblings().children('a').removeClass('active');
    })
    // 实例化
    var mmBUy = new MmBuy();
    mmBUy.getbrandCategory();
    mmBUy.getbrandCategory();
    mmBUy.getUserComment();

});
// 创建MMB构造函数
var MmBuy = function () {

}

// 在慢慢买的构造函数的原型中添加功能方法
MmBuy.prototype = {
    // 设置一个全局变量pagesize
    pagesize: 4,

    //获取主页传过来的brandTitleId 通过正则的方法获取页面url后面的id
    brandTitleId: this.getQueryString("brandTitleId"),

    // 1. 品牌标题对应的十大品牌api
    getbrandCategory: function () {
        var that = this;
        $.ajax({
            url: 'http://localhost:9090/api/getbrand',
            data: {
                brandtitleid: that.brandTitleId
            },
            success: function (data) {
                var html = template('getbrandCategoryTpl', data)
                console.log(data);
                $('.getbrandCategory').html(html);
            }
        });
    },
    // 2.品牌标题对应的十大品牌的销量排行商品列表api
    getbrandCategory: function () {
        var that = this;
        // 调用品牌标题对应的十大品牌的销量排行商品列表api
        $.ajax({
            url: 'http://localhost:9090/api/getbrandproductlist',
            data: {
                brandtitleid: that.brandTitleId,
                pagesize: that.pagesize
            },
            success: function (data) {
                var html = template('getSellRankTpl', data);
                console.log(data);
                $('.getSellRank').html(html);
                $('.getSellRank  .pic img').addClass('mui-media-object mui-pull-left');
            }
        });
    },

    // 3.调用销量排行商品的评论api
    getUserCommentApi: function (productid) {
        $.ajax({
            url: 'http://localhost:9090/api/getproductcom',
            data: {
                productid: productid
            },
            success: function (data) {
                var html = template('getUserCommentTpl', data);
                $('#userComment ul').html(html);
                console.log(data);
            }
        });
    },

    // 3.调用销量排行商品的评论api
    getUserComment: function () {
        var that = this;
        that.getUserCommentApi(0);
        // 调用销量排行商品的评论api
        $('.getSellRank').on('tap', 'li>a', function () {
            var btn = this;
            var productid = $(btn).data('productid');
            // console.log($(this));
            console.log(productid);
            that.getUserCommentApi(productid);
        });
    }
}

//别人使用正则写的获取url地址栏参数的方法
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        // 用了另一种转码方式 我们是默认转码方式 使用decodeURI
        // return unescape(r[2]);
        return decodeURI(r[2]);
    }
    return null;
}