var ExitWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "ExitWindow";
        this.Title = "Exit";

        this.JObj.addClass(this.WindowType);

        //to add the "X" button
        this.JObj.append(
            "<p class='ClickSoundEffect Close' id='" + this.Id + "Close'>X</p>"
        );

        this.JObj.append(
            "<p class='ClickSoundEffect ButtonList' id='" + this.Id + "Yes'>Yes</p>" +
            "<p class='ClickSoundEffect ButtonList' id='" + this.Id + "No'>No</p>"
        );

        this.JObj.children('.Title').text(this.Title);

        this.YesJObj = $('#' + this.Id + "Yes");
        this.NoJObj = $('#' + this.Id + "No");
        this.CloseJObj = $('#' + this.Id + "Close");

        //to set the css
        //close state
        this.JObj.css({
            'top': this.CloseTop,
            'right': this.CloseRight
        });

        $('.' + this.WindowType + ">.ButtonList").css({
            'position': 'absolute',
            'margin': '0px 0px',
            'bottom': '20px',
            'font-size': '150%'
        });

        this.YesJObj.css('left', 100);
        this.NoJObj.css('right', 100);

        //to set event
        this.YesJObj.click(() => {
            this.JObj.css('background-color', 'green');
            window.location = '/';
        });

        this.NoJObj.click(() => {
            this.JObj.css('background-color', 'gray');
        });

        this.CloseJObj.click(() => {
            this.Close();
        });
    }
});
