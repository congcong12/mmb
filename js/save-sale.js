$(function(){
    var mmb=new MMB();
    mmb.queryProductDetail();
    mmb.queryProductComment();
})
var MMB = function(){

}

MMB.prototype={
    //渲染商品上半部分
    queryProductDetail:function(){
        var that = this ;

        that.productid=that.getQueryString('productid');
        console.log(that.productid);
        $.ajax({
            url:"http://localhost:9090/api/getmoneyctrlproduct?productid="+that.productid,
            data:{productId:that.productid},
            success:function(data){
                console.log(data);
                var html=template('mainTpl-sale',data);
                $('#main .sale').html(html);
            }
        })
    },
    //渲染评论
    queryProductComment:function(){
        var that = this ;

        that.productid=that.getQueryString('productid');
        console.log(that.productid);
        $.ajax({
            url:"http://localhost:9090/api/getmoneyctrlproduct?productid="+that.productid,
            data:{productId:that.productid},
            success:function(data){
                console.log(data);
                var html=template('mainTpl-talk',data);
                $('#main .talkbox').html(html);
            }
        })
    },
    //获取url地址的参数
    getQueryString:function(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
    } 
}
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});


