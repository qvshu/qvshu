var G_HIDE_CLS = 'hide';
$(document).ready(function(){    
    $(".js-input").focus(function(){
        $('.js-mask').removeClass(G_HIDE_CLS);
        $(".js-clear").removeClass(G_HIDE_CLS);
    });
    $(".js-input").blur(function(){
        $(".js-clear").addClass(G_HIDE_CLS);
    });
    $('.js-search').click(function(){
        $('.js-order').removeClass(G_HIDE_CLS);
        $('.js-mask').addClass(G_HIDE_CLS);
    })
});