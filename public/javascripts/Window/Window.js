var Window = Class.extend({
    init: function(Width, Height) {
    this.Id = "Window" + new Date().getTime();
    this.Width = Width;
    this.Height = Height;
    this.Time = 500;

            windowListJObj.append(
            "<div class='Window' id='" + this.Id + "'>" +
            "<h1 class='Title'>" + this.Title + "</h1>" +
            "<p class='ClickSoundEffect Close' id='" + this.Id + "Close'>X</p>" +
            "</div>"
        );

            this.JObj = $('#' + this.Id);
this.CloseJObj = $('#' + this.Id + "Close");

        //to set event
        this.CloseJObj.click(() => {
            this.Close();
        });
    },
    Open: function() {
        this.JObj.css({
            'display': 'block',
            'left': (totalWidth - functionListWidth) * 0.5,
            'top': totalHeight * 0.2 + this.Height * 0.5
        });

        //transform????
        this.JObj.animate({
            'width': this.Width,
            'height': this.Height,
            'left': (totalWidth - functionListWidth - this.Width) * 0.5,
            'top': totalHeight * 0.2
        }, this.Time);

        //to write the title of window
        
    },

    Close: function() {
        //console.log(this.JObj);
        this.JObj.animate({
            'width': 0,
            'height': 0,
            'left': (totalWidth - functionListWidth) * 0.5,
            'top': totalHeight * 0.2 + this.Height * 0.5
        }, this.Time, () => {
            this.JObj.css('display', 'none')
        });
    }
});