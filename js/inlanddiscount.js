$(function(){
    var href='http://localhost:9090/';
    $.ajax({
        url: href +"api/getinlanddiscount",
        success: function(data){
            var html=template('productTpl',data);
            $('.product-list .mui-row').html(html);
        }
    });
})