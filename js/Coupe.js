$(function(){
    $.ajax({
        url: 'http://localhost:9090/api/getcoupon',
        success: function(data){
            console.log(data);
            var html = template('getCoupeTpl',data);
            $('#coupon-list').html(html);
        } 
    });
    // $('#coupon-list').on('tap', 'li a',function(){
    //     alert('123'); 
        
    // })
})