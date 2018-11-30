$(function () {

    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false, //是否显示滚动条
    });


    var id = getQueryString('couponid');
    console.log(id);
    var couponTitle = getQueryString('couponTitle');
    console.log(couponTitle);

    $.ajax({
        url: 'http://localhost:9090/api/getcouponproduct',
        data: { couponid: id },
        success: function (data) {
            console.log(data);
            var html = template('getCoupelistTpl', data);
            $('.coupon-list').html(html);
            $('.title').html(couponTitle + "优惠券");
            $('.bottom-title').html(couponTitle + "优惠券");
        }
    });


    $('.backTop').on('tap', function () {
        mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 1500);
    });

    $('.coupon-list').on('tap', 'li a', function () {
        $('.mask').show()

        // 注意初始化代码执行顺序
        var mySwiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            slidesPerView: 3,
            centeredSlides: true,
            coverflowEffect: {
                rotate: 30,
                stretch: 10,
                depth: 10,
                modifier: 2,
                slideShadows: true
            },
        });

    })
    $('.close').on('tap', function () {
        $('.mask').hide()

    });


})
// 获取url参数的值
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



var scroll = mui('.mui-scroll-wrapper').scroll();
document.querySelector('.mui-scroll-wrapper').addEventListener('scroll', function (e) {
    var scrollHeight = scroll.y
    console.log(scrollHeight);

    if (scrollHeight <= -700) {
        $('.backbtn').show();
    } else {
        $('.backbtn').hide();
    }

})