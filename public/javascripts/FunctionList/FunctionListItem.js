var FunctionListItem = function(Id, Content, WindowId) {
    this.Id = Id;
    this.Content = Content;
    this.WindowId = WindowId;

    this.JObj = $('#' + this.Id);
    //window exists at first
    //this.WindowObj = new ;

    this.Time = 500;

    this.JObj.mouseenter(() => {
        this.JObj.addClass('FunctionListMouseEnter');
    });

    this.JObj.mouseleave(() => {
        this.JObj.removeClass('FunctionListMouseEnter');
    });

    this.JObj.click(() => {
        this.WindowJObj.Open();
    });

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
        this.WindowJObj.Open();

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
};