var FunctionListItem = function(Id, Content, WindowObj) {
    this.Id = Id;
    this.Content = Content;

    this.JObj = $('#' + this.Id);
    //window exists at first
    //this.WindowObj = new ;
    this.WindowObj = WindowObj;
    /*
    switch (this.WindowId) {
        case "SettingsWindow":
            this.WindowObj = new SettingsWindow(500, 400);
            break;
        case "ExitWindow":
            this.WindowObj = new ExitWindow(500, 400);
            break;
        default:
            this.WindowObj = null;
            break;
    }
    */

    //console.log(this.WindowObj);

    this.Time = 500;

    this.JObj.mouseenter(() => {
        this.JObj.addClass('FunctionListMouseEnter');
    });

    this.JObj.mouseleave(() => {
        this.JObj.removeClass('FunctionListMouseEnter');
    });

    this.JObj.click(() => {
        this.WindowObj.Open();
    });
/*
    this.WindowObj.CloseJObj.click(() => {
        this.WindowObj.Close();
    })
    */
};
