$(document).ready(function(){
    var G_HIDE_CLS = 'hide',
        G_SHOW_CLS = 'show',
        G_NO_SCROLL = 'no-scroll';
    // 水平/垂直居中弹窗
    $(".js-center-box").click(function(){
        $(".js-center-mask").removeClass(G_HIDE_CLS).removeClass("mask-hide").addClass("mask-show");
        $(".js-center-list").removeClass("select-hide").addClass("select-show");
        $('html').addClass(G_NO_SCROLL);
        $('body').addClass(G_NO_SCROLL);
    });
    $(".js-center-close").click(function(){
        $(".js-center-list").removeClass("select-show").addClass("select-hide");;
        $(".js-center-mask").removeClass("mask-show").addClass("mask-hide");
        setTimeout(function(){
            $(".js-center-mask").addClass(G_HIDE_CLS);
        }, 1000);
        $('html').removeClass(G_NO_SCROLL);
        $('body').removeClass(G_NO_SCROLL);
    });

    // 地区级联选择弹窗
    $(".js-area-box").click(function(){
        $(".js-area-mask").removeClass(G_HIDE_CLS).removeClass("mask-hide").addClass("mask-show");
        $(".js-area-list").removeClass("select-hide").addClass("select-show");
        $('html').addClass(G_NO_SCROLL);
        $('body').addClass(G_NO_SCROLL);
    });
    $(".js-area-close").click(function(){
        $(".js-area-list").removeClass("select-show").addClass("select-hide");;
        $(".js-area-mask").removeClass("mask-show").addClass("mask-hide");
        setTimeout(function(){
            $(".js-area-mask").addClass(G_HIDE_CLS);
        }, 1000);
        $('html').removeClass(G_NO_SCROLL);
        $('body').removeClass(G_NO_SCROLL);
    });

    // 状态/时间选择弹窗
    $(".js-time-box").click(function(){
        $(".js-time-mask").removeClass(G_HIDE_CLS).removeClass("mask-hide").addClass("mask-show");
        $(".js-time-list").removeClass("select-hide").addClass("select-show");
        $('html').addClass(G_NO_SCROLL);
        $('body').addClass(G_NO_SCROLL);
    });
    $(".js-time-close").click(function(){
        $(".js-time-list").removeClass("select-show").addClass("select-hide");;
        $(".js-time-mask").removeClass("mask-show").addClass("mask-hide");
        setTimeout(function(){
            $(".js-time-mask").addClass(G_HIDE_CLS);
        }, 1000);
        $('html').removeClass(G_NO_SCROLL);
        $('body').removeClass(G_NO_SCROLL);
    });

    // 状态扭转弹窗
    $(".js-status-box").click(function(){
        $(".js-status-mask").removeClass(G_HIDE_CLS).removeClass("mask-hide").addClass("mask-show");
        $(".js-status-list").removeClass("select-hide").addClass("select-show");
        $('html').addClass(G_NO_SCROLL);
        $('body').addClass(G_NO_SCROLL);
    });
    $(".js-status-close").click(function(){
        $(".js-status-list").removeClass("select-show").addClass("select-hide");;
        $(".js-status-mask").removeClass("mask-show").addClass("mask-hide");
        setTimeout(function(){
            $(".js-status-mask").addClass(G_HIDE_CLS);
        }, 1000);
        $('html').removeClass(G_NO_SCROLL);
        $('body').removeClass(G_NO_SCROLL);
    });

    // 日历选择弹窗
    $(".js-calendar-box").click(function(){
        $(".js-calendar-mask").removeClass(G_HIDE_CLS).removeClass("mask-hide").addClass("mask-show");
        $(".js-calendar-list").removeClass("select-hide").addClass("select-show");
        $('html').addClass(G_NO_SCROLL);
        $('body').addClass(G_NO_SCROLL);
    });
    $(".js-calendar-close").click(function(){
        $(".js-calendar-list").removeClass("select-show").addClass("select-hide");;
        $(".js-calendar-mask").removeClass("mask-show").addClass("mask-hide");
        setTimeout(function(){
            $(".js-calendar-mask").addClass(G_HIDE_CLS);
        }, 1000);
        $('html').removeClass(G_NO_SCROLL);
        $('body').removeClass(G_NO_SCROLL);
    });

    // 提示小弹窗
    $(".js-small-box").click(function(){
        $(".js-mode").removeClass(G_HIDE_CLS).addClass(G_SHOW_CLS);
        setTimeout(function(){
            $(".js-mode").removeClass(G_SHOW_CLS).addClass(G_HIDE_CLS);
        }, 2000);
    });
    // 支付弹窗
    $(".js-payment-box").click(function(){
        $(".js-payment-mask").removeClass(G_HIDE_CLS).addClass(G_SHOW_CLS);
        setTimeout(function(){
            $(".js-payment-mask").removeClass(G_SHOW_CLS).addClass(G_HIDE_CLS);
        }, 10000);
    });
});