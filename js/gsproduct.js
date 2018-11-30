//封装版
$(function () {
    var manmanBuy = new Manmanbuy();
    manmanBuy.queryProduct();
    manmanBuy.scrollWrapper();
    manmanBuy.directionProduct();
    manmanBuy.addInvoices();
    manmanBuy.preventThorough();
    manmanBuy.circleTC();

});


var Manmanbuy = function () {

}
Manmanbuy.prototype = {
    circleLeft: 45,
    num: 0,
    //京东商店的id
    shopId: 0,
    //华北地区的id;
    areaid: 0,
    //商店的li单击的id
    shopCid: 0,
    areaCid: 0,


    //请求渲染商品页面的函数
    queryProduct: function () {
        var that = this;
        //调用函数
        that.getgsproduct(function (data) {
            var html = template("productListTpl", data);
            $(".coudan_product .product-list").html(html);
        })
    },

    //区域滚动的函数
    scrollWrapper: function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    },

    //发送请求商品数据的的函数
    getgsproduct: function (callback, shopid, areaid) {
        var that = this;
        $.ajax({
            url: 'http://localhost:9090/api/getgsproduct',
            data: {
                shopid: that.shopId || 0,
                areaid: that.areaid || 1
            },
            dataType: "json",
            success: function (data) {
                callback(data);
            }
        });
    },

    //商品点击按方向排序
    directionProduct: function () {
        var that = this;
        $(".coudan_filter-left a").on("tap", function () {
            //获取a的点击次数
            that.num = $(this).data("id");
            if (that.num == 0) {
                $(".mask").show();
                that.num = 1;
                $(this).data("id", "1");
            } else if (that.num == 1) {
                $(".mask").hide();
                that.num = 0;
                $(this).data("id", "0");
            }
            // $(this).data("id", that.num);
            var sortType = $(this).data("sort-type");
            // console.log(sortType);
            // 获取三角形的方向
            var direction = $(this).find(".caret").data("direction");
            if (direction == 1) {
                direction = 2;
                $(this).find(".caret").css({
                    borderTop: 0,
                    borderBottom: ".08rem solid #ccc"
                });

            } else if (direction == 2) {
                //否则三角形的方向是向上的,隐藏遮罩层
                direction = 1;
                $(this).find(".caret").css({
                    borderTop: ".08rem solid #ccc",
                    borderBottom: 0
                });

            }
            //把改变方向的值存起来
            $(this).find(".caret").data("direction", direction);

            //判断当前选中的是哪种a的文件  商店/地区/价格
            if (sortType == "shop") {
                $.ajax({
                    url: "http://localhost:9090/api/getgsshop",
                    dataType: "json",
                    success: function (data) {
                        // $(".mask").show();
                        // if (that.num % 2 == 0) {
                        //     $(".mask").hide();

                        // } else {
                        //     $(".mask").show();
                        // }
                        // console.log(data);
                        //渲染下拉列表
                        var html = template("shopTpl", data);
                        // $(".mask .shop").html(html);
                        $(".mask").html(html);
                        //赋值id给前面点击的那个 渲染√
                        $(".mask li").eq(that.shopCid).find(".gou").addClass("fa fa-check");
                        $(".mask li").eq(that.shopCid).siblings().find(".gou").removeClass("fa fa-check");


                        // 下拉列表的点击事件
                        $(".mask li").on("tap", function () {
                            //记录单击的是哪个li
                            that.shopCid = $(this).index();

                            // 当点击的时候显示√;
                            $(this).find(".gou").addClass("fa fa-check");
                            $(this).siblings().find(".gou").removeClass("fa fa-check");

                            //
                            //改变文字
                            var text = $(this).find(".productName").html();
                            // console.log(text);
                            $(".filter-shop").find(".shop-list").html(text);

                            //改变三角形的样式
                            $(".filter-shop .caret").css({
                                borderTop: ".08rem solid #ccc",
                                borderBottom: 0
                            });

                            //获取商品id;
                            that.shopId = $(this).attr("data-shopId");
                            $(".mask").hide();

                            console.log(that.num);
                            that.num++;
                            $(this).data("id", that.num);
                            // console.log(shopId);
                            // console.log(that);

                            //调用函数渲染商品页面
                            that.getgsproduct(function (data) {
                                var html = template("productListTpl", data);
                                $(".coudan_product .product-list").html(html);

                            }, that.shopId, that.areaid);

                        });
                    }
                })
            } else if (sortType == "area") {
                // 发送请求
                $.ajax({
                    url: "http://localhost:9090/api/getgsshoparea",
                    dataType: "json",
                    success: function (data) {

                        //渲染下拉列表
                        var html = template("areaTpl", data);
                        $(".mask").html(html);
                        //赋值id给前面点击的那个 渲染√
                        $(".mask li").eq(that.areaCid).find(".gou").addClass("fa fa-check");
                        $(".mask li").eq(that.areaCid).siblings().find(".gou").removeClass("fa fa-check");

                        $(".mask  li").on("tap", function () {
                            that.areaCid = $(this).index();
                            // console.log(that.areaCid);

                            // 当点击的时候显示√;
                            $(this).find(".gou").addClass("fa fa-check");
                            $(this).siblings().find(".gou").removeClass("fa fa-check");
                            //改变下拉列表选项的文件
                            // var h = $(".filter-area").find(".shop-list").html();
                            var text = $(this).find(".productName").html().split("（")[0];
                            // console.log(text);
                            $(".filter-area").find(".shop-list").html(text);
                            that.areaid = $(this).attr("data-areaId");
                            // console.log(areaid);
                            $(".mask").hide();
                            direction = 1;
                            $(".filter-area .caret").css({
                                borderTop: ".08rem solid #ccc",
                                borderBottom: 0
                            });
                            //调用函数渲染商品页面
                            that.getgsproduct(function (data) {
                                var html = template("productListTpl", data);
                                $(".coudan_product .product-list").html(html);

                            }, that.shopId, that.areaid);
                        });
                    }
                })
            } else if (sortType == "price") {
                var ul = document.createElement("ul");
                ul.innerHTML = '<li><a href="#" data-id="0"><span>' + '1元' + '</span><span class="gou fa fa-check"></span></a></li>';
                $(".mask").html(ul);
                $(".mask  li").on("tap", function () {
                    direction = 1;
                    $(".filter-price .caret").css({
                        borderTop: ".08rem solid #ccc",
                        borderBottom: 0
                    });
                    //调用函数渲染商品页面
                    that.getgsproduct(function (data) {
                        var html = template("productListTpl", data);
                        $(".coudan_product .product-list").html(html);

                    }, that.shopId, that.areaid);
                    $(".mask").hide();
                });
            }

        });
    },
    //点击去凑单的函数
    addInvoices: function () {
        $(".coudan_product").on("tap", ".btn-coudan", function () {
            var id = $(this).data("id");
            location = "https://item.m.jd.com/ware/view.action?wareId=1274360";
            // console.log(id);
        })
    },
    // 阻止a的点透事件
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
    //circle的点击事件
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