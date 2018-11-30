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
    mmb.circleTC();
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
                $('#nav .mui-scroll').css('width', sum + $('#nav ul li')[0].offsetWidth);
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