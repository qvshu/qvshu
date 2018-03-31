$(document).ready(function(){
    var G_HIDE_CLS = 'hide',
        GO_TOP_SHOW = 'go-top-show',
        GO_TOP_SHOW_HEIGHT = 1100;

    $('.js-open-qrcode').click(function(){
        $('.js-qrcode').removeClass(G_HIDE_CLS);
    })
    $('.js-close-qrcode').click(function(){
        $('.js-qrcode').addClass(G_HIDE_CLS);
    })
    $('.js-qrcode').click(function(){
        $('.js-qrcode').addClass(G_HIDE_CLS);
    })

    // 返回顶部
    $(window).scroll(function(e){
        var current_top = $(window).scrollTop();

        if(current_top > GO_TOP_SHOW_HEIGHT){
            $('.js-go-top').removeClass(G_HIDE_CLS).addClass(GO_TOP_SHOW);
        }else{
            $('.js-go-top').addClass(G_HIDE_CLS);
        }
    });

    $('.js-go-top').on($.CLICK, function(e){
        e.preventDefault();

        var current_top = $(window).scrollTop();
        var interval = $(document).height() * 0.03;
        var handle = setInterval(function(){
            if(current_top <= 0){
                clearInterval(handle);
            }else{
                current_top -= interval;
                $(window).scrollTop(current_top);
            }
        }, 16);
    });
});