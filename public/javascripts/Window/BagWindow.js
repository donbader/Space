var BagWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "BagWindow";
        this.Title = "Bag";
        this.PageCount = 1;
        this.ItemCount = [];
        this.Items = [];
        this.rowMax = 5;

        //the Item count in each page is the same
        for (var i = 0; i < this.PageCount; ++i)
            this.ItemCount.push(15);


        //to create the window
        this.JObj.addClass(this.WindowType);

        this.JObj.append(
            "<table class='BagItems'>"
        );

this.JObj.children('.Title').text(this.Title);

        /*
        windowListJObj.append(
            "<div class='Window " + this.WindowType + "'id='"+ this.Id + "'>" + 
            "<h1 class='"
            "<table class='BagItems'>"
        );
        */

        //this.JObj = $('#' + this.Id);
        this.BagItems = $('.BagItems');

        var tr;
        for (var i = 0; i < this.PageCount; ++i) {
        	this.Items.push([]);

        	for(var j = 0; j < this.ItemCount[i]; ++j){
        		if(j % 5 == 0 ) {
                    tr = $("<tr class='BagItemRow'></tr>");
                    this.BagItems.append(tr);
                }

                this.Items[i].push(new BagItem(tr, i, j));
        	}
        }

        this.JObj.append(
            "</table>" + 
            "</div>"
        )
        //to set the css
        
        $('.' + this.WindowType).css({
            'text-align': 'left'
        });

        $('.BagItems').css({
            'display': 'inline-block',
            'position': 'relative',
            'top': 100,
            'left': 100,
            'width': 50 * 5,
            'height': 50 * 3,
            'text-align': 'center',
            'list-style-type': 'none',
            'background-color': 'black'
        });

        $('.BagItemRow').css({
            'display': 'inline-block',
            'width': 50 * 5,
            'text-align': 'center'
        });
        
    }
});
