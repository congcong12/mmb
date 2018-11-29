$(function () {
    let mmb = new MMB();
    mmb.init();
    mmb.renderCategory();
    mmb.doSearch();
    // mmb.loading();
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
    }

    //
}