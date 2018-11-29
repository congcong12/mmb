$(function(){
var id = getQueryString('categoryid');
var mmb = new Mmb(id);
mmb.productTitle();
mmb.productList();
mmb.pageing();
mmb.previous();
mmb.next();
mmb.pages();
});
function Mmb (id){
    //头部导航的区域
    this.id=id;
   
}
Mmb.prototype={
    page:1,//默认显示第一页
    maxPage:0,//最大页码数
    productTitle:function(){//头部导航的获取
        var that = this;
        $.ajax({
            url:'http://localhost:9090/api/getcategorybyid',
            data:{categoryid:that.id},
            success:function (data) { 
                $('.classify').text(data.result[0].category);
            }
        })
    },
    productList:function () {  //商品列表的区域
        var that = this;
        that.productData(function(data){
            var html = template('productTPl',data);
            $('#main .content .mui-table-view').html(html);
            $('.mui-media a>img').addClass('mui-media-object mui-pull-left');
        })
    },
    pageing:function(){//分页区域
        //初始化分页
        mui.init({
            swipeBack: true //启用右滑关闭功能
        });
        //获取当前数据的页数
        var that=this;
        that.productData(function(data){
            //页码数=总条数/一页的大小
            that.maxPage=data.totalCount/data.pagesize;
            for (var i = 1; i <= that.maxPage; i++) {
                if (i==1) {
                    var html= $('<li class="pages mui-active"><a href="#">'+i+'</a></li>');
                }else {
                    var html= $('<li class="pages"><a href="#">'+i+'</a></li>');
                }
                $('.mui-next').before(html);
            }
        })
    },
    productData:function(callback){//获取商品列表的请求
        var that= this;
        $.ajax({
            url:'http://localhost:9090/api/getproductlist',
            data:{categoryid:that.id,pageid:that.page},
            success:function (data) { 
               callback(data);
            }
        })
    },
    //点击上一页
    previous:function(){
        var that = this;
        $('.mui-previous').on('tap',function(){
            $('.mui-next').removeClass('mui-disabled');
            if (that.page==1) {
                that.page--;
                if (that.page==1) {
                    $(this).addClass('mui-disabled');
                }
            }else {
                return;
            }
            $('.mui-pagination li').removeClass('mui-active').eq(that.page).addClass('mui-active');
            that.productList();
        })
    },
    //下一页
    next:function(){
        var that = this;
        $('.mui-next').on('tap',function(){
            $('.mui-previous').removeClass('mui-disabled');
           
                if (that.page!=that.maxPage) {
                    that.page++;
                    if (that.page==that.maxPage) {
                        $('.mui-next').addClass('mui-disabled');
                    }
                }else {
                    return;
                }
                $('.mui-pagination li').removeClass('mui-active').eq(that.page).addClass('mui-active');
                that.productList();
           
        })
    },
    //点击页码
    pages:function(){
        var that = this;
        $('.mui-pagination').on('tap','li.pages',function () {
                that.page=$(this).text();
                if (that.page==1) {
                    $('.mui-previous').addClass('mui-disabled');
                    $('.mui-next').removeClass('mui-disabled');
                }else if (that.page==that.maxPage) {
                    $('.mui-next').addClass('mui-disabled');
                    $('.mui-previous').removeClass('mui-disabled');
                }else {
                    $('.mui-next').removeClass('mui-disabled');
                    $('.mui-previous').removeClass('mui-disabled');
                }
                that.productList();
                $(this).addClass('mui-active').siblings().removeClass('mui-active');
        });
    },
}
