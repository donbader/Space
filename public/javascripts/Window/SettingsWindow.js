var SettingsWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "SettingsWindow";
        this.Title = "Settings";

        this.JObj.addClass(this.WindowType);

        //to add the "X" button
        this.JObj.append(
            "<p class='ClickSoundEffect Close' id='" + this.Id + "Close'>X</p>"
        );

        this.JObj.append(
            "<p class='ClickSoundEffect ButtonList' id='" + this.Id + "Set'>Set</p>"
        );

        this.JObj.children('.Title').text(this.Title);

        this.SetJObj = $('#' + this.Id + "Set");
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
            'right': '20px',
            'font-size': '150%'
        });

        //to set event
        this.SetJObj.click(() => {
            this.JObj.css('background-color', 'yellow')
        });

        this.CloseJObj.click(() => {
            this.Close();
        });
    }
});
