$('.MenuIcon').click(() => {
    var functionList = $('.FunctionList'), container = $('.Container');

    if(functionList.css('display') == 'none')
    {
        functionList.css('display', 'block');
        container.css('background-color', '#0088FF');
    }
    else
    {
        functionList.css('display', 'none');
        container.css('background-color', 'transparent');
    }
});


//to use this????
/*
$('.FunctionList p').mouseenter(() => {
    console.log($(this));
    $(this).addClass('FunctionListMouseOver');
});

$('.FunctionList p').mouseleave(() => {
    console.log($(this));
    $(this).removeClass('FunctionListMouseOver');
});
*/

function FunctionListItemMouseEnter(obj) {
    $(obj).addClass('FunctionListMouseOver');
}

function FunctionListItemMouseLeave(obj) {
    $(obj).removeClass('FunctionListMouseOver');
}

function FunctionListItemClick(obj) {
    var name = $(obj).text();
    var totalWidth = $('body').width(), totalHeight = $('body').height();
    var containerWidth = $('.Container').width();
    var windowWidth = $('.Window').width();


    switch ($(obj).text()) {
        case "Friend Fields":
            //to do something
            $('.Window h1').text(name);
            $('.Window').css({
                'display': 'block',
                'left': (totalWidth - containerWidth - windowWidth) * 0.5
            });
            break;

        case "Settings":
            //to do something
            $('.Window h1').text(name);
            $('.Window').css('display', 'block');
            break;
    }
}

$('.Window > p').click( () => {
    $('.Window').css('display', 'none');
})
