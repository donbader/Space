var FunctionListWindow = Window.extend({
    init: function(Width) {
        'use strict';
        this.Top = 20;
        this._super(Width, totalHeight - this.Top * 2);

        this.OpenTop = this.Top;
        this.CloseTop = this.Top + this.Height * 0.5;
        this.OpenRight = 0;
        this.CloseRight = this.Width * 0.5;
        this.CloseWidth = 100;
        this.CloseHeight = 100;

        this.WindowType = "FunctionList";
        this.Title = "FunctionList";

        this.Items = [];
        this.IsOpen = false;

        this.JObj.removeClass("Window");
        this.JObj.addClass(this.WindowType);

        this.JObj.children('.Title').text(this.Title);
    },
    AppendItem: function(ItemId, ItemContent, ItemWindowId) {
        this.JObj.append(
            "<p class='ClickSoundEffect' id='" + ItemId + "'>" + ItemContent + "</p>"
        );
        this.Items.push(new FunctionListItem(ItemId, ItemContent, ItemWindowId));
    },
    Close: function() {
        this.JObj.animate({
            'width': this.CloseWidth,
            'height': this.CloseHeight,
            'top': 20,
            'right': 20
        }, this.Time, () => {

            this.JObj.css({
                '-webkit-clip-path': 'circle(49% at 50% 50%)',
                '-webkit-border-radius': 0
            });
        });
    },
    Click: function() {
        if (this.IsOpen) {
            this.IsOpen = false;
            this.Close();
        } else {
            this.IsOpen = true;
            this.Open();
            this.JObj.css({
                '-webkit-clip-path': 'none',
                '-webkit-border-radius': 25
            });
        }
    }
});
