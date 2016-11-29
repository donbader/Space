var SettingsWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "SettingsWindow";
        this.Title = "Settings";

        //to create the window
        windowListJObj.append(
            "<div class='Window " + this.WindowType + "' id='" + this.Id + "'>" +
            "<h1 class='title'>" + this.Title + "</h1>" +
            "<p class='ClickSoundEffect' id='" + this.Id + "Close'>Close</p>" +
            "</div>"
        );

        this.JObj = $('#' + this.Id);
        this.CloseJObj = $('#' + this.Id + "Close");

        //to set event
        this.CloseJObj.click(() => {
            this.Close();
        })
    }
});
