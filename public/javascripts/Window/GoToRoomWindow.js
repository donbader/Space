var GoToRoomWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "GoToRoomWindow";
        this.Title = "GoToRoom";

        this.JObj.addClass(this.WindowType);

        //to add the "X" button
        this.JObj.append(
            "<p class='ClickSoundEffect Close' id='" + this.Id + "Close'>X</p>"
        );

        this.JObj.append(
            "<input type='text' placeholder='Please input the room name' id='" + this.Id + "Input'></p>" + 　
            "<p class='ClickSoundEffect' id='" + this.Id + "Confirm'>Confirm</p>"
        );

        this.JObj.children('.Title').text(this.Title);

        this.InputJObj = $('#' + this.Id + 'Input');
        this.ConfirmJObj = $('#' + this.Id + 'Confirm');
        this.CloseJObj = $('#' + this.Id + "Close");

        //to set the css
        //close state
        this.JObj.css({
            'top': this.CloseTop,
            'right': this.CloseRight
        });

        this.InputJObj.css({
            'top': this.Height * 0.3,
            'text-align': 'center'
        });

        this.ConfirmJObj.css('left', this.Height * 0.5);

        //to set event
        this.ConfirmJObj.click(() => {
            this.JObj.css('background-color', 'green');
            console.log(this.InputJObj.val());
        });

        this.CloseJObj.click(() => {
            this.Close();
        });
    }
});
