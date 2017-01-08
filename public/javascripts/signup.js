$('form').submit(false);

$("#submitbutton").click(function() {
    var send_data = {
        Account: $('#inputEmail').val(),
        Password: $("#inputPassword").val().hashCode()
    }
    console.log(send_data.Account.length);
    if (checkCharacter(send_data.Account) == false || checkCharacter(send_data.Password) == false)
    {
        console.log("false");
        swal({
                            title: "Oops!",
                            text: "請輸入正確的字元 (僅接受數字及大小寫英文字母!)",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonColor: " #2C3E50",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        },
                        function() {
                            window.location = "/Signup";
                        });
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
                    swal({
                            title: "Bravo!",
                            text: "Sign up successfully!",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: " #2C3E50",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        },
                        function() {
                            window.location = "/";
                        });
                } else {
                    swal({
                            title: "Oops!",
                            text: "This Username is existed, or something is wrong!",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonColor: " #2C3E50",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        },
                        function() {
                            window.location = "/Signup";
                        });
                }
            }
        });
    }
});
