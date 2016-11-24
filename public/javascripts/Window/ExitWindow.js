var ExitWindow = Window.extend({
    init: function(Id, Type, Width, Height) {
        'use strict';

        //ctor
    },

    //for yesno
    ClickYes: function() {
        this.Obj.css('background-color', 'green');
    },

    ClickNo: function() {
        this.Obj.css('background-color', 'gray');

        this.Obj.animate({
            'width': 0,
            'height': 0,
            'left': (totalWidth - containerWidth) * 0.5,
            'top': totalHeight * 0.2 + this.Height * 0.5
        }, this.Time, () => {
            this.Obj.css('display', 'none')
        });
    }
});