$('form').submit(false);

$("#enter").click(function() {
    var send_data = {
        Account: $('#inputEmail').val(),
        old_Password: $("#old_inputPassword").val(),
        new_Password: $("#new_inputPassword").val()
    }
    if ($('#inputEmail').val() != "" && $('#old_inputPassword').val() != "" && $('#new_inputPassword').val() != "") {
        console.log(send_data);
        $.ajax({
            type: 'post',
            url: "Modify/edit",
            dataTpye: "json",
            data: send_data,
            success: function(JSONData) {
                console.log(JSONData);
                if (JSONData.msg == "success") {
                    alert("Change successfully!");
                    window.location = "/";
                } else {
                    alert("Username or Password is wrong!")
                    window.location = "/Modify";
                }
            }
        });
    }
});
