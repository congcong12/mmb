$(function () {
	// 实例化一个对象
	var manmanBuy = new Manmanbuy();
	manmanBuy.RotationChart();
	manmanBuy.queryProduct();
	manmanBuy.judge();
	manmanBuy.Discount();
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
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 2000); //100毫秒滚动到顶
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
	}

}