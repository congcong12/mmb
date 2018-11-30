$(function () {
    let mmb = new MMB();
    mmb.init();
    mmb.renderCategory();
    mmb.doSearch();
    // mmb.loading();
    mmb.circleTC();
})

let MMB = function () {

}

MMB.prototype = {
    cateLength: 8,
    // 组件初始化
    init(){
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }

    // 数据渲染
    ,renderCategory(){
        let _this = this;
        // 一级分类
        this.doRequest('/api/getcategorytitle', data =>{
            console.log(data);
            let html = template('categoryTpl', data);
            $('.main-menu').html(html);
        })

        // 二级分类
        $('.main-menu').on('tap', '.cate-one', function () {
            let titleid= $(this).data('titleid');
            // 二级分类请求
            _this.doRequest('/api/getcategory', data =>{
                // console.log(data);
                let html = template('subCategoryTpl',data);
                $('.menu'+titleid+'').html(html);

            },{titleid: titleid})
            // 隐藏和显示二级分类
            $(this).toggleClass('active');
            $('.cate-one i').removeClass('rotate');
            $('.active i').addClass('rotate');
        })

        // 二级分类跳转
        $('.main-menu').on('tap', '.sub-menu li', function () {
            let categoryId = $(this).data('categoryid')
            let cateName = $(this).html();
            location.href = `productList.html?categoryid=${categoryId}&cateName=${cateName}`;
            // location.href = 'productList.html?categoryid=' + categoryId;
        })
    }

    // 搜索
    ,doSearch(){
        // 把所有二级分类存入本地存储
        localStorage.removeItem('cateList');
        let cateList = [];
        for (let i = 0; i <= 8; i++) {
            this.doRequest('/api/getcategory', data =>{
                for (let i = 0; i < data.result.length; i++) {
                    cateList.push(data.result[i].category)
                }
                localStorage.setItem('cateList', JSON.stringify(cateList));
            },{titleid: i})
        }

        // 点击搜索
        $('#search-btn').on('tap', ()=>{
            let keyword = $('#search-txt').val();
            // 输入内容判断
            if (!keyword.trim()) {
                mui.toast('请输入要搜索的内容',{ duration:'long', type:'div' })
            } else if(keyword.length < 2) {     // 输入内容至少两个字
                mui.toast('请输入详细的商品名称',{ duration:'long', type:'div' })
            } else {
                location.href = 'search.html?key=' + keyword;
            }
        })
    }

    // ajax 请求
    ,doRequest(url, callback, data){
        let commonPath = 'http://localhost:9090';
        $.ajax({
            url: `${commonPath}${url}`,
            data: data,
            success: data => {
                callback(data)
            },
            error: err => {
                console.log(err);
            }
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

    //
}