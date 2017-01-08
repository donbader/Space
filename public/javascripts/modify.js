$('form').submit(false);

$("#enter").click(function() {
    var send_data = {
        Account: $('#inputEmail').val(),
        old_Password: $("#old_inputPassword").val().hashCode(),
        new_Password: $("#new_inputPassword").val().hashCode()
    }
    console.log(send_data.Account.length);
    if (checkCharacter(send_data.Account) == false || checkCharacter(send_data.old_Password) == false || checkCharacter(send_data.new_Password) == false)
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
                            window.location = "/Modify";
                        });
    }else

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
                    swal({
                            title: "Bravo!",
                            text: "Change successfully!",
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
                            text: "Username or Password is wrong!",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonColor: " #2C3E50",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        },
                        function() {
                            window.location = "/Modify";
                        });
                }
            }
        });
    }
});
