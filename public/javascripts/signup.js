$('form').submit(false);

$("#submitbutton").click(function() {
    var send_data = {
        Account: $('#inputEmail').val(),
        Password: $("#inputPassword").val()
    }
    if ($('#inputEmail').val() != "" && $('#inputPassword').val() != "") {
        $.ajax({，
            type: 'post',
            url: "Signup/add",
            dataTpye: "json",
            data: send_data,
            success: function(JSONData) {
                console.log(JSONData.msg);
                if (JSONData.msg == "success") {
                    alert("Sign up successfully!");
                    window.location = "/";
                } else {
                    alert("This Username is existed, or something is wrong!")
                    window.location = "/Signup";
                }
            }
        });
    }
});
