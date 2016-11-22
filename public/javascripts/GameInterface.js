//to define the class
var Window = function(Id, Type, Width, Height) {
    this.Id = Id;
    this.Obj = $('#' + this.Id);
    this.Type = Type;
    this.Width = Width;
    this.Height = Height;
    this.Time = 500;

    this.Open = function() {
                this.Obj.css({
            'display': 'block',
            'left': (totalWidth - containerWidth) * 0.5,
            'top': totalHeight * 0.2 + this.Height * 0.5
        });

        //transform????
        this.Obj.animate({
            'width': this.Width,
            'height': this.Height,
            'left': (totalWidth - containerWidth - this.Width) * 0.5,
            'top': totalHeight * 0.2
        }, this.Time);

        //to write the title of window
        this.Obj.children('.title').text(this.Name);
    }

    this.Close = function() {
        this.Obj.animate({
        'width': 0,
        'height': 0,
        'left': (totalWidth - containerWidth) * 0.5,
        'top': totalHeight * 0.2 + this.Height * 0.5
    }, this.Time, () => {
        this.Obj.css('display', 'none')
    });
    }

    this.Click = function() {
        if(this.Type = "YesNo")
        this.Obj.css('background-color', 'green');
    }

    //for close
    this.Close = function() {
    this.Obj.animate({
        'width': 0,
        'height': 0,
        'left': (totalWidth - containerWidth) * 0.5,
        'top': totalHeight * 0.2 + this.Height * 0.5
    }, this.Time, () => {
        this.Obj.css('display', 'none')
    });
}

    //for yesno
    this.ClickYes = function() {
        this.Obj.css('background-color', 'green');
    }

    this.ClickNo = function() {
        this.Obj.css('background-color', 'gray');

        this.Obj.animate({
 'width': 0,
        'height': 0,
        'left': (totalWidth - containerWidth) * 0.5,
        'top': totalHeight * 0.2 + this.Height * 0.5
    }, 500, () => {
        this.Obj.css('display', 'none')
    });
    }
}

var FunctionListItem = function (Id, ItemName, WindowType) {
    this.Id = Id;
    this.Obj = $('#' + this.Id);
    this.Name = ItemName;
    this.WindowType = WindowType;
    this.WindowObj = new Window();
    //win = $('#FieldsWindow');
    //this.Window = $('#' + WindowType);
    this.Time = 500;

    this.MouseEnter = function() {
        this.Obj.addClass('FunctionListMouseEnter');
    }

    this.MouseLeave = function() {
        this.Obj.removeClass('FunctionListMouseEnter');
    }

    this.Click = function() {
        //to open the window

        /*
        //to do something special
        switch(this.Name) {
        case "Friend Fields":
            //to do something
            this.Height = 400;
            break;
        case "Settings":
            //to do something
            this.Height = 400;
            break;
        case "Exit":
            //to do something
            this.Height = 200;
        }
        */
        this.WindowObj.Open();

        /*
        //to set initail value for animation
        this.Window.css({
            'display': 'block',
            'left': (totalWidth - containerWidth) * 0.5,
            'top': totalHeight * 0.2 + this.Height * 0.5
        });

        //transform????
        this.Window.animate({
            'width': this.Width,
            'height': this.Height,
            'left': (totalWidth - containerWidth - this.Width) * 0.5,
            'top': totalHeight * 0.2
        }, this.Time);

        //to write the title of window
        this.Window.children('.title').text(this.Name);
        */
    }
}

$(document).ready(() => {

});

$('.MenuIcon').click(() => {
    var container = $('.Container');

    playSound(0);

    if (container.css('right') == '0px')
        container.animate({ 'right': '-200px' }, 500);
    else
        container.animate({ 'right': 0 }, 500);
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

/*Window
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


var music = new Array("public/playsounds/playsound3.mp3");

function playSound(i) {
    //指定bgSound其src = 某音效位置
    document.getElementById("sounds").innerHTML = "<embed width=0 height=0 src=" + music[i] + " autostart='true'></embed>";
}

$('.ClickSoundEffect ').click(() => {
    playSound(0);
});
