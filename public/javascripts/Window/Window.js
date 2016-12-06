var Window = Class.extend({
    init: function(Width, Height) {
        this.Id = "Window" + new Date().getTime();
        this.Width = Width;
        this.Height = Height;
        this.Time = 500;
        this.OpenTop = totalHeight * 0.2;
        this.CloseTop = this.OpenTop + this.Height * 0.5;
        this.OpenRight = (totalWidth - functionListWidth - this.Width) * 0.5 + functionListWidth;
        this.CloseRight = this.OpenRight + this.Width * 0.5;
        this.CloseWidth = 0;
        this.CloseHeight = 0;

        windowListJObj.append(
            "<div class='Window' id='" + this.Id + "'>" +
            "<h1 class='Title'>" + this.Title + "</h1>" +
            "</div>"
        );

        this.JObj = $('#' + this.Id);
    },
    Open: function() {
        this.JObj.css({
            'display': 'block',
            '-webkit-border-radius': 25
        });

        //transform????
        this.JObj.animate({
            'width': this.Width,
            'height': this.Height,
            'top': this.OpenTop,
            'right': this.OpenRight,
        }, this.Time);

        //to write the title of window

    },

    Close: function() {
        //console.log(this.JObj);
        this.JObj.animate({
            'width': this.CloseWidth,
            'height': this.CloseHeight,
            'top': this.CloseTop,
            'right': this.CloseRight
        }, this.Time, () => {
            this.JObj.css('display', 'none');
        });
    }
});
