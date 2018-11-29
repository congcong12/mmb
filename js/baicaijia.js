$(function() {
    mui('#nav .mui-scroll-wrapper').scroll({
        scrollY: false,
        scrollX: true, //是否横向滚动
        startX: 0, //初始化时滚动至x
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false,
    });
    mui('#main>.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    var mmb = new MMB();
    // console.log(mmb);
    mmb.getbaicaijiatitle();
    mmb.getbaicaijiaproduct(0);
    mmb.backtop();
    mmb.topback();
});

var MMB = function() {}

MMB.prototype = {
    url: 'http://localhost:9090',
    // 获取导航数据
    getbaicaijiatitle: function() {
        var that = this;
        $.ajax({
            url: this.url + '/api/getbaicaijiatitle',
            success: function(data) {
                // console.log(data);
                var html = template('getbaicaijiatitleTpl', data);
                $('#nav ul').html(html);
                var sum = 0;
                for (i = 0; i < $('#nav ul li').length; i++) {
                    var width = $('#nav ul li')[i].offsetWidth;
                    sum += width;
                }
                $('#nav .mui-scroll').css('width', sum);
                $('#nav ul li a').on('tap', function() {
                    $(this).parent().addClass('active').siblings().removeClass('active');
                    var id = $(this).data('id');
                    // console.log(id);
                    that.getbaicaijiaproduct(id);

                })
            }
        })
    },
    // 根据id查询数据
    getbaicaijiaproduct: function(id) {
        $.ajax({
            url: this.url + '/api/getbaicaijiaproduct',
            data: {
                titleid: id
            },
            success: function(data) {
                // console.log(data);
                var html = template('getbaicaijiaproduct', data);
                $('#main-list ul').html(html);
                mui('#main>.mui-scroll-wrapper').scroll().scrollTo(0, 0, 1000);
            }
        })
    },
    backtop: function() {
        $('.footer-back').on('tap', function() {
            mui('#main>.mui-scroll-wrapper').scroll().scrollTo(0, 0, 1000);
        })
    },
    topback: function() {
        $('.top-back').on('tap', function() {
            mui('#main>.mui-scroll-wrapper').scroll().scrollTo(0, 0, 1000);
        })
    }
}