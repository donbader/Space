var BagItem = function(BagJObj, Page, Th) {
	this.Type = "BagItem";
	this.Id = this.Type + '_' + Page + '_' + Th;
	this.Image = null;
	this.ItemObj = null;

	//to create the BagItem in html
	BagJObj.append(
		"<li class='" + this.Type + "' id='" + this.Id + "'>" + 
		"<img src='" + this.Image + "'>" + 
		"</li>"
	);

	this.JObj = $('#' + this.Id);

	//to set css
	this.JObj.css({
		'background-color': 'green'
	});
}