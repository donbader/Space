var BagWindow = Window.extend({
    init: function(Width, Height) {
        'use strict';
        this._super(Width, Height);

        this.WindowType = "BagWindow";
        this.Title = "Bag";
        this.PageCount = 1;
        this.ItemCount = [];
        this.Items = [];

        //the Item count in each page is the same
        for (i = 0; i < this.PageCount; ++i)
            this.ItemCount.push(20);


        //to create the window
        windowListJObj.append(
            "<ul class='" + this.WindowType + "' id='" + this.Id + "'>"
        );

        this.JObj = $('#' + this.Id);

        for (i = 0; i < this.PageCount; ++i) {
        	this.Items.push([]);
        	for(j = 0; j < this.ItemCount[i]; ++j){
        		this.Items[i].push(new BagItem(this.JObj, i, j));
        	}
        }
    }
});
