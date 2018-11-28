$(function(){
	var getMoney=new mmbGetMoney;
	getMoney.queryProduct();
	getMoney.getProduct();
	getMoney.nextPageProduct();
	getMoney.upPageProduct();
	getMoney.checkPageProduct();
})

var mmbGetMoney = function(){

}

mmbGetMoney.prototype={
	baseURL:'http://localhost:9090',
	pageSize : 10,
	pageid:1,
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
	nextPageProduct:function(){
		var that=this;
		$('.btn2').on('tap',function(){
			
			that.pageid++;
			that.pageAjax(function(data){
				var html=template('productTpl',data)
				$('#main .content ul').html(html);
				$('#select').val(that.pageid);
			})
			
		})
	},	
	upPageProduct:function(){
		var that=this
		$('.btn1').on('tap',function(){
			that.pageid--;
			that.pageAjax(function(data){
				var html=template('productTpl',data)
				$('#main .content ul').html(html);
				$('#select').val(that.pageid);
			})
		})
	},
	checkPageProduct:function(){
		var that = this ;
		$.ajax({
			url:this.baseURL+'/api/getmoneyctrl',
			success:function(data){
				console.log(data);
				var page=Math.ceil(data.totalCount/data.pagesize);
				console.log(page);
				data.page=page;
				for(var i=0;i<data.page;i++){
					var opt=document.createElement('option');
					opt.innerHTML=i+1;
					opt.value=i+1;
					$('#select').append(opt);
				}
			}	
		})
	},
	pageAjax:function(callback){
		var that = this;
		$.ajax({
			url:this.baseURL+'/api/getmoneyctrl',
			data:{pageid:that.pageid-1},
			success:function(data){
				callback(data);
			}
		})
	}
}
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

