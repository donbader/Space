    $(window).load(function() {
        $('.blueberry').blueberry();
    });

    function profilePictureOnMouseOver(obj) {
        console.log("YO");
        if ($(obj).css('text-align') == 'center') {
            //this???

            //just a flag
            $(obj).css('text-align', 'left');

            width = $(obj).parent().width();

            //to move the div to left by animation
            $(obj).animate({
                'right': width * 0.3
            }, 1000, () => {
                console.log($(obj).parent().children('.introductionContent'));
                $(obj).parent().children('.introductionContent').css({
                    'display': 'inline-block',
                    'left': width * 0.2 + 200
                });
            });
        }
    }
