// 分页插件
var Initpage = function (page) {
    this.pageid = page.pageStart || 1;
    this.pageCount = page.pageCount || 1;
    this.prefun = page.prefun;
    this.nextfun = page.nextfun;
    this.callback = page.callback;
}
Initpage.prototype = {
    init: function () { // 分页
        var that = this;
        var html =
            "<button type='button' id='pagepre'>上一页</button><span><input id='setPage' type='text' value='" +
            this.pageid + "'/> / " + this.pageCount +
            "</span><button type='button' id='pagenext'>下一页</button>";

        $('#page').html(html).css({
            width: '100%',
            height: '30px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            fontSize: '14px'
        });
        $('#page button').css({
            height: '30px',
            width: '60px'
        });
        $('#setPage').css({
            width: '30px',
            height: '25px',
            margin: 0,
            padding: 0,
            textAlign: 'center',
            border: '1px solid #ccc'
        });
        
        

        $('#pagepre').on('tap', function () {            
            that.pageid--;
            if (that.pageid < 1) {
                that.pageid = 1;
                $('#pagepre').attr('disabled', 'disabled')
            }
            that.init();
            that.prefun(that.pageid);
        });
        $('#pagenext').on('tap', function () {
            that.pageid++;
            if (that.pageid >= that.pageCount) {
                that.pageid = that.pageCount;
                $('#pagenext').attr('disabled', 'disabled')
            }
            that.init();
            that.nextfun(that.pageid);
        });
        $('#setPage').on('blur', function () {
            that.pageid = $(this).val();
            that.init();
            that.callback(that.pageid);
        });
    }
}