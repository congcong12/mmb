$(function () {
    let mmb = new MMB();
    mmb.key = mmb.getQueryString('key');
    mmb.init();
    mmb.renderSearch();
    mmb.selectPage();
    mmb.nextPage();
    mmb.prevPage();
    mmb.circleTC();
})

let MMB = function () {

}

MMB.prototype = {
    pageid: 1,
    key: '',
    categoryid: '',
    // 组件初始化
    init() {
        // 区域滚动
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });

    }

    // 渲染页面
    , renderSearch() {
        let _this = this;
        // 搜索关键字
        $('.key').html(this.key);
        // 把本地储存里的数据转成数组
        let cateList = JSON.parse(localStorage.getItem('cateList'));
        // 获取关键字下标
        let index = cateList.findIndex(value => value.match(this.key));
        this.categoryid = index;
        if (index === -1) {
            $('#product-list').html(`对不起，没有您搜索的商品！<br>请换一个关键字再试试(●'◡'●)`).css({textAlign: 'center', margin: '.3rem '});
            $('.pagination').hide();
        } else {
            this.doRequest('/api/getproductlist', data => {
                // 计算总页数
                let pageCount = Math.ceil(data.totalCount / data.pagesize);
                let pageArr = [];
                for (let i = 1; i <= pageCount; i++) {
                    pageArr.push(i);
                }
                // 页面渲染
                let html = template('productListTpl', data);
                $('#product-list ul').html(html);
                // select 页码渲染
                // for (let i = 1; i <= pageCount; i++) {
                //     $('#pagePicker').append($(`<option>${i}</option>`));
                // }
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
        }
        // 返回顶部
        $('.top').on('tap', ()=>{
            mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);//100毫秒滚动到顶
        })
    }

    // 页码选取
    , selectPage() {
        let _this = this;
        $('#pagePicker').on('change', function () {
            _this.pageid = $('#pagePicker').val();
            console.log(_this.pageid);
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
    , doRequest(url, success, data, error) {
        let commonPath = 'http://localhost:9090';
        $.ajax({
            url: `${commonPath}${url}`,
            data: data,
            beforeSend: () => {
                // this.loading();
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
    , loading() {
        let mask = `<div id="mask" style="width: 100%; height: 100%; background-color: #fff; z-index: 999; position: absolute; top: 0; left: 0; display: flex; justify-content: center; align-items: center;"><img src="/mmb/manmanbuy/images/loading.gif" alt=""></div>`;
        $('.layout').append(mask);
    }

    // 清除 loading 动画
    , clearLoading() {
        $('#mask').remove()
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