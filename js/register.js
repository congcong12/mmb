$(function(){
    var mmb = new MMB();
    mmb.register();
})
var MMB =function(){

}

MMB.prototype={
    register:function(){
        var that = this ;
        $('.btn').on('tap',function(){
            var check = true;
            mui(".userPass input").each(function() {
                //若当前input为空，则alert提醒 
                if(!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.alert(label.innerText + "不允许为空");
                    check = false;
                    return false;
                }
                }); //校验通过，继续执行业务逻辑 
                if(check){
                    var password = $('.password').val();
                    var mobile = $('.mobile').val();
                    var putCodeNum=$('.putCodeNum').val();
                    // 3. 验证手机号是否合法
                    if (!(/^1[345789]\d{9}$/.test(mobile))) {
                        mui.alert('您输入的手机号不合法！');
                        return false;
                    }
                    if(password.length>20){
                        mui.alert('您输入的密码过长');
                        return false;
                    }
                    if(password.length<6){
                        mui.alert('您输入的密码过短');
                        return false;
                    }

                }
        })
    }
}