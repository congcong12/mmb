$(function () {
    let mmb = new MMB();
    mmb.categoryid = mmb.getQueryString('categoryid');
    console.log(mmb.getQueryString('categoryid'));
    mmb.catename = mmb.getQueryString('cateName');
    mmb.init();
    mmb.renderProlist();
    mmb.nextPage();
    mmb.prevPage();
})

let MMB = function () {

}

MMB.prototype = {
    pageid : 1,
    categoryid : '',
    catename : '',
    // 组件初始化
    init(){
        // 区域滚动
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });

    }

    // 渲染页面
    ,renderProlist() {
        let _this = this;
        this.doRequest('/api/getproductlist', data => {
            console.log(data);
            // 计算总页数
            let pageCount = Math.ceil(data.totalCount / data.pagesize);
            let pageArr = [];
            for (let i = 1; i <= pageCount; i++) {
                pageArr.push(i);
            }
            // 页面渲染
            let html = template('productListTpl', data);
            $('#product-list ul').html(html);
            $('.cate-name').html(_this.catename);
            // 初始化页码选取
            let picker = new mui.PopPicker();
            picker.setData(pageArr);
            $('#pagePicker').on('tap', () => {
                picker.show(function (items) {
                    let pageid = JSON.stringify(items[0]);
                    // 重置 pageid
                    _this.pageid =pageid;
                    _this.doRequest('/api/getproductlist', data => {
                        // 页面渲染
                        let html = template('productListTpl', data);
                        $('#product-list ul').html(html);
                        // 滚回顶部
                        mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);//100毫秒滚动到顶

                    }, {categoryid: _this.categoryid, pageid: pageid})
                    // return false;    // 确定后，选择框不消失
                });
            })

        }, {categoryid: this.categoryid, pageid: this.pageid})
        // 回到顶部
        $('.top').on('tap', ()=>{
            mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);//100毫秒滚动到顶
        })
    }

    // 下一页
    , nextPage() {
        $('.next').on('tap', () => {
            this.pageid++;
            $.ajax({})
            this.doRequest('/api/getproductlist', (data) => {
                // 计算总页数
                let pageCount = Math.ceil(data.totalCount / data.pagesize);
                let pageArr = [];
                for (let i = 1; i <= pageCount; i++) {
                    pageArr.push(i);
                }
                if (this.pageid > pageCount) {
                    mui.toast('已经是最后一页了', {duration: 'short', type: 'div'})
                    this.pageid = pageCount;
                    return false;
                } else {
                    // 滚回顶部
                    mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);//100毫秒滚动到顶
                    // 页面渲染
                    let html = template('productListTpl', data);
                    $('#product-list ul').html(html);
                }
            }, {categoryid: this.categoryid, pageid: this.pageid})
        })
    }

    // 上一页
    , prevPage() {
        $('.prev').on('tap', () => {
            this.pageid--;
            this.doRequest('/api/getproductlist', (data) => {
                // 计算总页数
                let pageCount = Math.ceil(data.totalCount / data.pagesize);
                let pageArr = [];
                for (let i = 1; i < pageCount; i++) {
                    pageArr.push(i);
                }
                // 滚回顶部
                mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);//100毫秒滚动到顶
                // 页面渲染
                let html = template('productListTpl', data);
                $('#product-list ul').html(html);
            }, {categoryid: this.categoryid, pageid: this.pageid}, err => {
                mui.toast('已经是第一页了', {duration: 'short', type: 'div'});
                this.pageid = 1;
                return false;
            })

        })
    }

    // ajax 请求
    ,doRequest(url, success, data, error) {
        let commonPath = 'http://localhost:9090';
        $.ajax({
            url: `${commonPath}${url}`,
            data: data,
            beforeSend: () => {
                this.loading();
            },
            complete: () => {
                setTimeout(() => {
                    this.clearLoading();
                }, 500)
            },
            success: data => {
                success(data)
            },
            error: err => {
                error(err)
            }
        })
    }

    ,// 获取请求数据
    getQueryString(name) {
        // 获取地址栏中 ? 后面的字符串
        // eg: ?search=鞋&page=1&pagesize=4
        let queryStirng = location.search.substring(1);
        // ["search=%E9%9E%8B", "page=1"]
        let stringArr = queryStirng.split('&');

        for (let i = 0; i < stringArr.length; i++) {
            let stringArr2 = stringArr[i].split('=');
            if (stringArr2.indexOf(name) !== -1) {
                return decodeURI(stringArr2[1]);
            }
        }
    }

    // loading 动画
    ,loading(){
        let mask = `<div id="mask" style="width: 100%; height: 100%; background-color: #fff; z-index: 999; position: absolute; top: 0; left: 0; display: flex; justify-content: center; align-items: center;"><img src="/mmb/manmanbuy/images/loading.gif" alt=""></div>`;
        $('.layout').append(mask);
    }

    // 清除 loading 动画
    ,clearLoading(){
        $('#mask').remove()
    }

}