
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        // 用了另一种转码方式 我们是默认转码方式 使用decodeURI
        // return unescape(r[2]);
        return decodeURI(r[2]);
    }
    return null;
}
//区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
//返回顶部
$('.backTop').on('tap',function (e) {
    mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,100);
});
//rem屏幕适配
 //默认调用一次设置
 setHtmlFontSize();

 function setHtmlFontSize() {
     // 1. 获取当前屏幕的宽度
     var windowWidth = document.documentElement.offsetWidth;
     // console.log(windowWidth);
     // 2. 定义标准屏幕宽度 假设375
     var standardWidth = 375;
     // 3. 定义标准屏幕的根元素字体大小 假设100px  1rem=100px  10px = 0.1rem  1px 0.01rem
     var standardFontSize = 100;
     // 4. 计算当前屏幕对应的根元素字体大小
     var nowFontSize = windowWidth / standardWidth * standardFontSize + 'px';
     // console.log(nowFontSize);
     // 5. 把当前计算的根元素的字体大小设置到html上
     document.querySelector('html').style.fontSize = nowFontSize;
 }
 // 6. 添加一个屏幕宽度变化的事件  屏幕变化就触发变化根元素字体大小计算的js 
 window.addEventListener('resize', setHtmlFontSize);

