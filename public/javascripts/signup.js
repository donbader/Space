$('form').submit(false);

$("#submitbutton").click(function() {
    var send_data = {
        Account: $('#inputEmail').val(),
        Password: $("#inputPassword").val()
    }
    console.log(send_data.Account.length);
    if (checkCharacter(send_data.Account) == false || checkCharacter(send_data.Password) == false)
    {
        console.log("false");
        alert("請輸入正確的字元 (僅接受數字及大小寫英文字母!)");
        window.location = "/Signup";
    }else

    if ($('#inputEmail').val() != "" && $('#inputPassword').val() != "") {
        $.ajax({
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
