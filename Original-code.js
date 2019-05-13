$(document).keyup(function(e) { 
    if (e.keyCode === 27) { 
        $(".a-modal-item__close").click();
    } 
});
$(window).bind('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
            event.preventDefault();
            $(".a-button--save").click();
            break;
        }
    }
});
$(".resource-items-container").css('flex-flow','row wrap-reverse');
