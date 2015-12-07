(function ($) {
    $(document).ready(function () {
        console.log('ready');
        var $buyBookEls =  $('[data-popup="buy-book"]');
        //console.log($buyBookEls);
        $buyBookEls.fancybox({
            type: 'iframe',
            href: '/buy-book.html'
        });


    })
})(jQuery);