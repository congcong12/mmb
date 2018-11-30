$(function(){
    var mmb = new MMB();
    mmb.register();
    mmb.createCode();
})
var MMB =function(){

}

MMB.prototype={
    code:'',

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
                    var username = $('.username').val();
                    var password = $('.password').val();
                    var mobile = $('.mobile').val();
                    var yzinput=$('.yzinput').val();
                    var emailval=$('.emailval').val();
                    if(!(/^[a-zA-Z0-9_-]{4,16}$/.test(username))){
                        mui.alert('请输入4到16位（字母，数字，下划线，减号）')
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
                     // 3. 验证手机号是否合法
                     if (!(/^1[345789]\d{9}$/.test(mobile))) {
                        mui.alert('您输入的手机号不合法！');
                        return false;
                    }
                    if(yzinput!=that.code-0){
                        mui.alert('验证码有误');
                        return false;
                    }
                    if(!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(emailval))){
                        mui.alert('您输入的邮箱有误');
                        return false;
                    }
                    localStorage.setItem('username',username);
                    localStorage.setItem('password',password);
                    location = 'login.html?returnUrl=index.html';
                }
        })
    },
    createCode:function(){
        var that = this ;
        $('.yzbtn').on('tap',function(){
            that.code="";
            for(var i=0;i<6;i++){
                var num=Math.floor(Math.random()*10);
                that.code += num;
            }
            alert(that.code);
        })
    }
}
/**
 * Created by duanhailin on 2018/06/21.
 */