var ExitWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "GoToRoomWindow";
        this.Title = "GoToRoom";

        this.JObj.addClass(this.WindowType);

        this.JObj.append(
            "<input type='text' placeholder='Please input the room name' id='" + this.Id + "Input'></p>" +　
            "<p class='ClickSoundEffect' id='" + this.Id + "Confirm'>Confirm</p>"
        );

        this.JObj.children('.Title').text(this.Title);

        this.InputJObj = $('#' + this.Id + 'Input');
        this.ConfirmJObj = $('#' + this.Id + 'Confirm');

        //to set the css
        //close state
        this.JObj.css({
            'top': this.CloseTop,
            'right': this.CloseRight
        });

        /*
        $('.' + this.WindowType + ">.ButtonList").css({
            'position': 'absolute',
            'margin': '0px 0px',
            'bottom': '20px',
            'font-size': '150%'
        });

        this.YesJObj.css('left', 100);
        this.NoJObj.css('right', 100);
        */

        this.InputJObj.css({
            'top': this.Height * 0.3,
            'text-align': 'center'
        });

        this.ConfirmJObj.css('left', this.Height * 0.5);

        //to set event
        this.ConfirmJObj.click(() => {
            this.JObj.css('background-color', 'green');
        });
});
