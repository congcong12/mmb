$(function(){
    //获取商品ID
    var productId = getQueryString('productId');
    console.log(productId);
    
    //获取商品分类ID
    var categoryId = getQueryString('categoryId');
    console.log(categoryId);
    var mmb = new MMB(productId,categoryId);
    mmb.calssifyTitle();
    mmb.details();
    mmb.comment();
    
});
function MMB(productId,categoryId){
    this.productId = productId;
    this.categoryId = categoryId;
}
MMB.prototype = {
    //头部分类
    calssifyTitle:function(){
        var that = this;
        $.ajax({
            url:'http://localhost:9090/api/getcategorybyid',
            data:{categoryid:that.categoryId},
            success:function (data) { 
                // console.log();
                $('.classify').text(data.result[0].category);
            }
        })
    },
    // 商品详情
    details:function(){
        var that = this;
        $.ajax({
            url:'http://localhost:9090/api/getproduct',
            data:{productid:that.productId },
            success:function(data){
                var html = template('detailsTpl',data);
                $('.details').html(html);
                
            }
        })
    },
    //评论区域
    comment:function(){
        var that = this;
        $.ajax({
            url:'http://localhost:9090/api/getproductcom',
            data : {
                productid :that.productId 
            },
            success:function(data){
                console.log(data);
                
              var html = template('commentTpl',data);
              $('#comment').html(html);
                
            }
        })
    }
}

