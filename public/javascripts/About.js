$(window).load(function() {
    $('.blueberry').blueberry();
});

function IntroductionOnMouseEnter(obj) {
    var profilePicture = $(obj).children('.profilePicture');

    if (profilePicture.css('text-align') == 'center') {
        //this???

        //just a flag
        profilePicture.css('text-align', 'left');

        width = $(obj).width();

        //to move the div to left by animation
        profilePicture.stop().animate({
            'right': width * 0.3
        }, 800, () => {
            $(obj).children('.introductionContent').css({
                'display': 'inline-block',
                'left': width * 0.2 + 200
            });
        });
    }
}

function IntroductionOnMouseLeave(obj) {
    var profilePicture = $(obj).children('.profilePicture');

    if (profilePicture.css('text-align') == 'left') {
        //this???

        //just a flag
        profilePicture.css('text-align', 'center');
        $(obj).children('.introductionContent').css('display', 'none');
        width = $(obj).width();

        //to move the div to left by animation
        profilePicture.stop().animate({
            'right': 0
        }, 800
        );
    }
}