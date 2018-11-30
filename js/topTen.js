$(function () {
	// 区域滚动初始化
	mui('#main>div.mui-scroll-wrapper').scroll({
		deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	});

	// 横向区域滚动初始化
	mui('#slider .mui-scroll-wrapper').scroll({
		scrollY: false, //是否竖向滚动
		scrollX: true, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: true, //是否显示滚动条
		deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
		bounce: false //是否启用回弹
	});

	// 调用模板渲染页面
	$.ajax({
		url: 'http://localhost:9090/api/getbrandtitle',
		success: function (data) {
			var html = template('getbrandtitleTpl', data);
			console.log(data);
			$('.brandTitle').html(html);
		}
	});

	// 获取每次点击的id值,在页面跳转时把id的值也一并传走
	$(".brandTitle").on('tap', '.btn-topTen', function () {
		// var id  = $(this).attr('data-brandTitleId');
		var id = $(this).data('brandtitleid');
		location = "topTenCategory.html?brandTitleId=" + id;
	});

	// 横向滚动给a添加类
	$('#slider li').on('tap', function () {
		$(this).find('a').addClass('active').parent().siblings().children('a').removeClass('active');
	})


})