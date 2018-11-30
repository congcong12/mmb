$(function () {
    // 区域滚动初始化
    mui('#main>div.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 设置一个全局变量pagesize
    var pagesize = 4;

    //获取主页传过来的brandTitleId 通过正则的方法获取页面url后面的id
    var brandTitleId = getQueryString("brandTitleId");

    // 调用品牌标题对应的十大品牌api
    $.ajax({
        url: 'http://localhost:9090/api/getbrand',
        data: {
            brandtitleid: brandTitleId
        },
        success: function (data) {
            var html = template('getbrandCategoryTpl', data)
            console.log(data);
            $('.getbrandCategory').html(html);
        }
    });

    // 调用品牌标题对应的十大品牌的销量排行商品列表api
    $.ajax({
        url: 'http://localhost:9090/api/getbrandproductlist',
        data: {
            brandtitleid: brandTitleId,
            pagesize: pagesize
        },
        success: function (data) {
            var html = template('getSellRankTpl', data);
            console.log(data);
            $('.getSellRank').html(html);
            $('.getSellRank  .pic img').addClass('mui-media-object mui-pull-left');
        }
    });

    // 调用销量排行商品的评论api
    $('.getSellRank').on('tap', 'li>a', function () {

        var productid = $(this).data('productid');
        // console.log($(this));
        console.log(productid);
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
    });
});


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