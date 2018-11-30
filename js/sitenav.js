$(function(){

    var mmb=new Mmb();
    mmb.getStore();
    
});


var Mmb=function(){

}

Mmb.prototype={
    // 查询商场列表
    getStore:function(){
        $.ajax({
            url:'http://localhost:9090/api/getsitenav',
            success:function(data){
                var html=template('storenavTpl',data);
                // document.getElementById('main').innerHTML=html;
                $('#main').html(html);
                                            
            }
        });
    },
}

