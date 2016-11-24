var FunctionList = function (Width) {
    this.Id = 'FunctionList';
    this.Width = Width;

    //FunctionList exists at first
    this.JObj = $('#' + this.Id);

    this.Time = 500;
    this.Items = [];

    this.Open = function() {
        this.JObj.animate({ 'right': 0 }, this.Time);
    }

    this.Close = function() {
        this.JObj.animate({ 'right': -this.Width }, this.Time);
    }

    this.AppendItem = function(ItemId, ItemContent, ItemWindowId) {
        this.JObj.append("<p class='ClickSoundEffect' id='" + ItemId + "'>" + ItemContent + "</p>");
        this.Items.push(new FunctionListItem(ItemId, ItemContent, ItemWindowId));
    }
};