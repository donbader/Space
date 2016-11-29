var BagItem = function(BagJObj, Page, Th) {
	this.Type = "BagItem";
	this.Image = null;
	this.ItemObj = null;

	//to create the BagItem in html
	BagJObj.append(
		"<li class='" + this.Type + "' id='" + this.Type + '_' + Page + '_' + Th + "'>" + 
		"<img src='" + this.Image + "'>" + 
		"</li>"
	);

	//to set css
}