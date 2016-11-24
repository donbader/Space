var SettingsWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);
        //ctor
    this.Id = "SettingsWindow";
    this.JObj = $('#' + this.Id);

        //this.JObj = $('#' + this.Id);

        this.JObj.children('.title').text(this.Id);
    },

    /*
    Close: function() {
        this.JObj.animate({
            'width': 0,
            'height': 0,
            'left': (totalWidth - containerWidth) * 0.5,
            'top': totalHeight * 0.2 + this.Height * 0.5
        }, this.Time, () => {
            this.JObj.css('display', 'none')
        });
    }
    */
});