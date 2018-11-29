$(function(){
	var getMoney=new mmbGetMoney;
	getMoney.queryProduct();
	getMoney.getProduct();
	getMoney.nextPageProduct();
	getMoney.upPageProduct();
	getMoney.checkPageProduct();
	getMoney.pickOptionPage();
})

var mmbGetMoney = function(){

}

mmbGetMoney.prototype={
	baseURL:'http://localhost:9090',
	pageSize : 10,
	pageid:1,
	page:1,
	//渲染
	queryProduct:function(){
		var that =this ;
		
		that.pageAjax(function(data){
			var html=template('productTpl',data)
			$('#main .content ul').html(html);
		})
	},
	getProduct:function(){
		var that = this;
		that.pageAjax(function(data){
			var html=template('productTpl',data)
			$('#main .content ul').html(html);
			
		})
	},
	//下一页
	nextPageProduct:function(){
		var that=this;
		
		$('.btn2').on('tap',function(){
			that.pageid++;
			if(that.pageid>that.page){
				that.pageid=1;
			} 
			console.log(that.pageid);
			that.pageAjax(function(data){
				var html=template('productTpl',data)
				$('#main .content ul').html(html);
				$('#select').val(that.pageid);
				document.documentElement.scrollTop = 0;
			})
			
		})
	},	
	//上一页
	upPageProduct:function(){
		var that=this;
		$('.btn1').on('tap',function(){
			that.pageid--;
			console.log(that.pageid);
			if(that.pageid==0){
				that.pageid=that.page;
			}
			that.pageAjax(function(data){
				var html=template('productTpl',data)
				$('#main .content ul').html(html);
				$('#select').val(that.pageid);
				document.documentElement.scrollTop = 0;
			})
		})
	},
	//select值
	checkPageProduct:function(){
		var that = this ;
		$.ajax({
			url:this.baseURL+'/api/getmoneyctrl',
			success:function(data){
				console.log(data);
				that.page=Math.ceil(data.totalCount/data.pagesize);
				console.log(that.page);
				data.page=that.page;
				for(var i=0;i<data.page;i++){
					var opt=document.createElement('option');
					opt.innerHTML=i+1;
					opt.value=i+1;
					$('#select').append(opt);
				}

			}	
		})
	},
	//页码ajax封装
	pageAjax:function(callback){
		var that = this;
		$.ajax({
			url:this.baseURL+'/api/getmoneyctrl',
			data:{pageid:that.pageid-1},
			success:function(data){
				callback(data);
			}
		})
	},
	//点击相应的页码跳转到相应页面
	pickOptionPage:function(){
		var that = this ;
		$('#select').on('change',function(){
			var selectval=$('#select').val()
			console.log(selectval)
			that.pageid=selectval;
			$.ajax({
				url:that.baseURL+'/api/getmoneyctrl',
				data:{pageid:selectval-1},
				success:function(data){
					var html=template('productTpl',data)
					$('#main .content ul').html(html);
					document.documentElement.scrollTop = 0;
				}
			})
		})
			
	}
}


