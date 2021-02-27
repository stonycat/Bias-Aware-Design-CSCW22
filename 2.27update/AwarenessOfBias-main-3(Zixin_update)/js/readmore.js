$(function() {
    var widHeight = $(window).height();
    var artHeight = $('.contents').height();
    if (artHeight > (widHeight)) {
        $('.contents').height(widHeight - 285).css({ 'overflow': 'hidden' });
        var article_show = true;
        $('.read_more_btn').on('click', bindRead_more);
    } else {
        article_show = true;
        $('.readall_box').hide().addClass('readall_box_nobg');
    }

    function bindRead_more() {
        if (!article_show) {
            $('.contents').height(widHeight).css({ 'overflow': 'hidden' });
            $('.readall_box').show().removeClass('readall_box_nobg');
            article_show = true;
        } else {
            $('.contents').height("").css({ 'overflow': 'hidden' });
            $('.readall_box').show().addClass('readall_box_nobg');
            $('.readall_box').hide().addClass('readall_box_nobg');
            article_show = false;
        }
    }
})