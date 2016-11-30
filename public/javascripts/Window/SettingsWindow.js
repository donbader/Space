var SettingsWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "SettingsWindow";
        this.Title = "Settings";

        //to create the window
        /*
        windowListJObj.append(
            "<div class='Window " + this.WindowType + "' id='" + this.Id + "'>" +
            "<h1 class='title'>" + this.Title + "</h1>" +
            "<p class='ClickSoundEffect' id='" + this.Id + "Close'>Close</p>" +
            "</div>"
        );
        */

        this.JObj.addClass(this.WindowType);

        this.JObj.append(
            "<p class='ClickSoundEffect ButtonList' id='" + this.Id + "Set'>Set</p>"
        );

        this.JObj.children('.Title').text(this.Title);

        this.SetJObj = $('#' + this.Id + "Set");

        //to set the css
        $('.' + this.WindowType + ">.ButtonList").css({
                'position': 'absolute',
    'margin': '0px 0px',
    'bottom': '20px',
    'right': '20px',
    'font-size': '150%'
        });

        this.SetJObj.click(() => {
            this.JObj.css('background-color', 'yellow')
        });
    }
});
