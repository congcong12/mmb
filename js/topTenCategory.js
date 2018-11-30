$(function () {
    // 区域滚动初始化
    mui('#main>div.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 设置一个全局变量pagesize
    var pagesize = 4;

    //获取主页传过来的brandTitleId 通过正则的方法获取页面url后面的id
    var brandTitleId = getQueryString("brandTitleId");
    preventThorough();
    circleTC();
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
function preventThorough() {
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
};
 function circleTC() {
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