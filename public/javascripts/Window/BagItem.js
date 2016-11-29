var BagItem = function(Tr, Page, Th) {
	this.Type = "BagItem";
	this.Id = this.Type + '_' + Page + '_' + Th;
	this.Image = null;
	this.ItemObj = null;
	this.Width = 40;
	this.Height = 40;
	this.Tr = Tr;
	//this.BagWindow = BagWindow;


	//to create the BagItem in html
	this.Tr.append(
		"<td class='" + this.Type + "' id='" + this.Id + "'>" + 
		"<img src='" + this.Image + "'>" + 
		"</td>"
	);

	this.JObj = $('#' + this.Id);

	//to set css
	//5item => row
	this.JObj.css({
		'display': 'inline-block',
		'position': 'relative',
		'margin': '5px',
		'width': this.Width,
		'height': this.Height,
		'background-color': 'green',
		'text-align': 'center'
	});
}