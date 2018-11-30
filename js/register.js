$(function(){
    var mmb = new MMB();
    mmb.register();
    mmb.createCode();
    mmb.circleTC();
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
                    localStorage.getItem('username','password');
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
            mui.alert(that.code);
            var time = 60;
            timeoutId =setInterval(function(){
                time--;
                $('.yzbtn').text(time+'秒重新获取').attr('disabled',false);
                console.log(time)
                if(time==0){
                    clearInterval(timeoutId);
                    $('.yzbtn').text('获取验证码').removeAttr("disabled")
                }
            },1000)
           
        })
    },
    preventThorough: function () {
        //阻止a标签的默认跳转--再给其添加tap事件
        $('.product-list').on('click', 'li a', function (e) {
            e.preventDefault();
        });

        //解决点透问题
        mui(document).on('tap', 'a', function () {
            var a = document.createElement('a');
            a = this.cloneNode(true);
            a.click();
        });
    },
    circleTC: function () {
        var that = this;
        $(".circle").on("tap", function (e) {
            // e.stopPropagation();
            var num = $(this).data("id");
            console.log(num);

            if (num == 0) {
                num=1
                $(".ring").addClass("open");
                console.log($(this).css("left").match(/\d/g)[0])
                if ($(this).css("left").match(/\d/g)[0]<45){
                console.log(111)
                    $(this).css({
                        left:45,
                        "transition": "all 0.4s ease-in-out 0s"
                    });
                } else {
                    $(this).css({
                        "transition": "all 0.4s ease-in-out 0s"
                    });
                }
               
             
            } else if(num ==1){
                num = 0;
                $(this).css({
                    "left":0,
                    "transition": "all 0.4s ease-out"
                });
                $(".ring").removeClass("open");
            }
            $(this).data("id", num);
            //阻止点透事件
            that.preventThorough();
        });

        var startY = moveY = distanceY = currentY = 0;
        var startX = moveX = distanceX = currentX = 0;

        $(".circle").on("touchstart", function (e) {
            // console.log(e);
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            // console.log(startY);
            // console.log(startX);
            // console.log($('.circle').css('left'))
            // console.log($('.circle').css('top'))

        });
        $(".circle").on("touchmove", function (e) {
            moveY = e.touches[0].clientY;
            // 滑动的距离 使用 滑动中的Y - 滑动开始的Y
            distanceY = moveY - startY;

            moveX = e.touches[0].clientX;
            var y = currentY + distanceY;
            // 滑动的距离 使用 滑动中的x - 滑动开始的x
            distanceX = moveX - startX;
            that.circleLeft = currentX + distanceX;
            var screenWidth = window.innerWidth;
            var screenHeight = window.innerHeight;;
            // console.log(screenWidth, that.circleLeft);
            that.circleLeft = that.circleLeft < 60 ? 60 : that.circleLeft;
            that.circleLeft = that.circleLeft > screenWidth-105 ? screenWidth-105 : that.circleLeft;
            y = y < 60 ? 60 : y;
            y = y+30 > screenHeight-60?screenHeight-60 : y;
            $(this).css({
                transform:"translate("+that.circleLeft+"px,"+y+"px)",
            });
        });
        $(".circle").on("touchend", function (e) {
            currentY += distanceY;
            currentX += distanceX;
        });

    }
}
/**
 * Created by duanhailin on 2018/06/21.
 */