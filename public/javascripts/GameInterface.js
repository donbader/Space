//to be writed to class ?
var menuIconOriginalRight = $('.MenuIcon').css('right').split("p")[0];
//var functionListJObj = $('#FunctionList');
var windowListJObj = $('#WindowList');
var totalWidth = $('body').width(),
    totalHeight = $('.Height').height();
var functionListWidth = 200;

console.log(totalHeight);

$(document).ready(function() {
    //to init some settings
    //var functionListWidth = 200,
    //    functionList = new FunctionList(functionListWidth);

    var functionListWindow = new FunctionListWindow(functionListWidth);

    var bagWindow = new BagWindow(600, 400);
    var settingsWindow = new SettingsWindow(500, 400);
    var exitWindow = new ExitWindow(500, 200);

    functionListWindow.AppendItem("Bag", "Bag1", bagWindow);
    functionListWindow.AppendItem("Settings", "Settings1", settingsWindow);
    functionListWindow.AppendItem("Exit", "Exit1", exitWindow);

    //to set the event
    $('.MenuIcon').click(() => {
        var menuIcon = $('.MenuIcon'),
            time = 500;
            //65465464654
            functionListWindow.Click();
            /*
        if (functionListWindow.JObj.css('right') == '0px') {
            //to close
            functionListWindow.Close();
            //menuIcon.animate({ 'right': menuIconOriginalRight }, time);
            //functionListJObj.animate({ 'right': menuIconOriginalRight }, time, functionListJObj.children('*').css('display', 'block'));

        } else {
            //to turn out
            functionListWindow.Open();
            //menuIcon.animate({ 'right': parseInt(menuIconOriginalRight) + functionListWidth }, time);
            //functionListJObj.animate({ 'right': parseInt(menuIconOriginalRight) + functionListWidth }, time, functionListJObj.children('*').css('display', 'none'));
        }*/
    });

    //to set the settings event
    /*
    functionList[0].JObj.mouseenter(function() {

    });
    */
})

/*
        <p class="ClickSoundEffect">Friend Fields1</p>
        <p class="ClickSoundEffect" id="Settings"></p>
        <p class="ClickSoundEffect" id="Exit"></p>
*/


var music = new Array("playsounds/playsound3.mp3");

function playSound(i) {
    //指定bgSound其src = 某音效位置
    document.getElementById("sounds").innerHTML = "<embed width=0 height=0 src=" + music[i] + " autostart='true'></embed>";
}

$('.ClickSoundEffect ').click(() => {
    playSound(0);
});


/*
//FunctionList Item 
$('.FunctionList p').mouseenter(function() {
    $(this).addClass('FunctionListMouseEnter');
});

$('.FunctionList p').mouseleave(function() {
    $(this).removeClass('FunctionListMouseEnter');
});

var totalWidth = $('body').width(),
    totalHeight = $('.Container').height();
var containerWidth = $('.Container').width();

$('.FunctionList .Fields').click(function() {
    var name = $(this).text(),
        win = $('#FieldsWindow');

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

    win.children('h1').text(name);

    switch (name) {
        case "Friend Fields":
            //to do something
            break;
        case "Settings":
            //to do something
            break;
    }
});

$('.FunctionList .YesNo').click(function() {
    var name = $(this).text(),
        win = $('#YesNoWindow');

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
    win.children('h1').text(name);

    switch (name) {
        case "Friend Fields":
            //to do something
            break;
        case "Settings":
            //to do something
            break;
    }
});
*/

/*
//Window
$('.Close').click(function() {
    var win = $(this).parent('.Window');

    //can parameter be changed?
    win.animate({
        'width': 0,
        'height': 0,
        'left': (totalWidth - containerWidth) * 0.5,
        'top': totalHeight * 0.2 + 200
    }, 500, () => {
        win.css('display', 'none')
    });
})


$('#YesNoWindow #Yes').click(() => {
    var win = $('#YesNoWindow');

    win.css('background-color', 'green');
});

$('#YesNoWindow #No').click(() => {
    var win = $('#YesNoWindow');

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



*/
