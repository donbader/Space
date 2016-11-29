var ExitWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "ExitWindow";
        this.Title = "Exit";

        //to create the window
        windowListJObj.append(
            "<div class='Window " + this.WindowType + "'+  id='" + this.Id + "'>" +
            "<h1 class='title'>" + this.Title + "</h1>" +
            "<p class='ClickSoundEffect' id='" + this.Id + "Yes'>Yes</p>" +
            "<p class='ClickSoundEffect' id='" + this.Id + "No'>No</p>" +
            "</div>"
        );

        this.JObj = $('#' + this.Id);
        this.YesJObj = $('#' + this.Id + "Yes");
        this.NoJObj = $('#' + this.Id + "No");

        //to set the css
        this.YesJObj.css('left', 100);
        this.NoJObj.css('right', 100);

        //to set event
        this.YesJObj.click(() => {
            this.JObj.css('background-color', 'green');
        });

        this.NoJObj.click(() => {
            this.JObj.css('background-color', 'gray');
            this.Close();
        });
    }
});
