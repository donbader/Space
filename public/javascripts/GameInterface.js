$('.MenuIcon').click(() => {
    var container = $('.Container');
    
    playSound(0);

    if (container.css('right') == '0px')
        container.animate({ 'right': '-200px' }, 500);
    else
        container.animate({ 'right': 0 }, 500);
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

var totalWidth = $('body').width(),
    totalHeight = $('.Container').height();
var containerWidth = $('.Container').width();

function FunctionListItemClick(obj) {
    var name = $(obj).text(), win = $('#Fields');

    if (win.width() == 0) {
        //to open the window

        //to set initail value for animation
        win.css({
            'display': 'block',
            'left': (totalWidth - containerWidth) * 0.5,
            'top': totalHeight * 0.2 + 200
        });


        //transform????
        win.animate({
            'width': '500px',
            'height': '400px',
            'left': (totalWidth - containerWidth - 500) * 0.5,
            'top': totalHeight * 0.2
        }, 500);
    }



    //transform
    $('#Fields h1').text(name);

    switch ($(obj).text()) {
        case "Friend Fields":
            //to do something
            $('#Fields h1').text(name);
            break;
        case "Settings":
            //to do something
            $('#Fields h1').text(name);
            break;
    }
}

$('#Fields > p').click(() => {
    var win = $('#Fields');

    win.animate({
        'width': 0,
        'height': 0,
        'left': (totalWidth - containerWidth) * 0.5,
        'top': totalHeight * 0.2 + 200
    }, 500, () => {
        win.css('display', 'none')
    });
})

function FunctionListExitClick(obj) {
    var name = $(obj).text(), win = $('#YesNo');

    if (win.width() == 0) {
        //to open the window

        //to set initail value for animation
        win.css({
            'display': 'block',
            'left': (totalWidth - containerWidth) * 0.5,
            'top': totalHeight * 0.2 + 100
        });


        //transform????
        win.animate({
            'width': '500px',
            'height': '200px',
            'left': (totalWidth - containerWidth - 500) * 0.5,
            'top': totalHeight * 0.2
        }, 500);
    }


    //transform
    $('#YesNo h1').text(name);

}

$('#YesNo #Yes').click( () => {
    var win = $('#YesNo');

    win.css('background-color', 'green');
});

$('#YesNo #No').click( () => {
    var win = $('#YesNo');

    win.css('background-color', 'gray');

    win.animate({
        'width': 0,
        'height': 0,
        'left': (totalWidth - containerWidth) * 0.5,
        'top': totalHeight * 0.2 + 100
    }, 500, () => {
        win.css('display', 'none')
    });
});

var music = new Array("public/playsounds/playsound3.mp3");

    function playSound(i){
        //指定bgSound其src = 某音效位置
        document.getElementById("sounds").innerHTML = "<embed width=0 height=0 src="+music[i]+" autostart='true'></embed>";
    }
