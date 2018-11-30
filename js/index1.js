$(function () {
	// 实例化一个对象
	var manmanBuy = new Manmanbuy();
	manmanBuy.RotationChart();
	manmanBuy.queryProduct();
	manmanBuy.judge();
	manmanBuy.Discount();
	manmanBuy.circleTC();
})
// 创建一个构造函数
var Manmanbuy = function () {

}

Manmanbuy.prototype = {
	baseURL:'http://localhost:9090',
	// 轮播图函数
	RotationChart: function () {
		//获得slider插件对象 初始化轮播图
		var gallery = mui('.mui-slider');
		gallery.slider({
			interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
		});
		//获取区域滚动的父容器 调用初始化区域滚动插件的函数
		mui('.mui-scroll-wrapper').scroll({
			indicators: false, //是否显示滚动条
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
	},
	// 导航栏区域函数
	queryProduct: function () {
		// // 发送ajax请求   渲染页面
		$.ajax({
			url: this.baseURL+ '/api/getindexmenu',
			success: function (data) {
				//  console.log(data);
				var html = template('indexMenuTpl', data);
				$('#nav .mui-row').html(html);
			}
		})
	},
	// 判断函数
	judge: function () {
		// 判断点击更多   zz == 1 显示,zz=2;  否则隐藏 zz=2
		$('.mui-row').on('tap', '.btn', function () {
			var zz = $(this).data('index');
			if (zz == 1) {
				$('.more').show();
				zz = 2;
			} else {
				$('.more').hide();
				zz = 1;
			}
			$(this).data('index', zz);
		});
		$('.btn-top').on('tap', function () {
			mui('.asd').scroll().scrollTo(0, 0, 2000); //100毫秒滚动到顶
		})
	},
	Discount: function () {
		// 折扣区域
		// 发送ajax请求  渲染页面
		$.ajax({
			url: this.baseURL+'/api/getmoneyctrl',
			success: function (data) {
				console.log(data);
				var html = template('agioTpl', data);
				$('.content ul').html(html);
			}
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