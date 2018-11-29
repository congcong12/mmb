setHtmlFontSize();

function setHtmlFontSize() {
    // 1. 获取当前页面的宽度
    var windowWidth = window.innerWidth;
    // 2. 计算当前屏幕宽度需要设置的字体大小
    var htmlFontSize = windowWidth / 3.75;
    // 3. 把计算结果设置给html
    document.querySelector('html').style.fontSize = htmlFontSize + 'px';
}
window.addEventListener('resize', setHtmlFontSize);