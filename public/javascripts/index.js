$('form').submit(false);

if (navigator.cookieEnabled) {
    console.log("Cookie 功能已經啟動！")
        // 在此加入使用 Cookie 的程式碼


    console.log(Cookies.get("ID"));
    if (Cookies.get("ID") != null && Cookies.get("PW") != null)　　　 {　
        console.log(Cookies.get("ID") + "welcome");
        //COOKIE傳送回去的帳密確認

        var send_data = {
            Account: Cookies.get("ID"),
            Password: Cookies.get("PW").hashCode()
        }
        $.ajax({
            type: 'post',
            url: "login",
            dataTpye: "json",
            data: send_data,
            success: function(JSONData) {
                

                if (JSONData.msg == "success") {

                    var socket = io.connect();
                    socket.emit('join', {
                        roomID: JSONData.id
                    });

                    // console.log("ID=",id);
                    //document.getElementById("Black").style.display = "inline";
                    $("#Black").css({
                        'display': 'inline'
                    });
                    $("#Black").animate({
                        'opacity': '1'
                    }, 2000, function() {
                        $("#SignInPage").css({
                            'display': 'none'
                        });
                        console.log("1234");
                        $("#GameAll").css({
                            'display': 'inline'
                        });
                        console.log("Entered");

                        

                        AfterLogIn(Cookies.get("ID"));
                  



                        $("#Black").animate({
                            'opacity': "0"
                        }, 3000, function() {
                            $("#Black").css({
                                'display': 'none'
                            });
                        });
                    });
                } else {
                    sweetAlert("Wrong In Username Or Password");
                    window.location = "/";
                    //加一個清除cookie?
                }
            }

        });　　　
    }
} else {
    document.write("Cookie 功能尚未啟動！");
    alert("你的瀏覽器設定不支援 Cookie，請先開啟瀏覽器的 Cookie 功能後，才能得到瀏覽本網頁的最佳效果！");
    // 在此加入不使用 Cookie 的程式碼
}






$("#GameAll").css({
    'display': 'none'
});
$("#enter").click(function() {
    //if ($('#inputEmail').val() != "" && $('#inputPassword').val() != "") {
    var send_data = {
        Account: $('#inputEmail').val(),
        Password: $("#inputPassword").val().hashCode()
    }
    console.log(send_data.Account.length);
    if (checkCharacter(send_data.Account) == false || checkCharacter(send_data.Password) == false) {
        console.log("false");
        alert("請輸入正確的字元 (僅接受數字及大小寫英文字母!)");
        window.location = "/";
    } else {
        $.ajax({
            type: 'post',
            url: "login",
            dataTpye: "json",
            data: send_data,
            success: function(JSONData) {
            

                if (JSONData.msg == "success") {
                    //cookie儲存
                    Cookies.set("ID", $('#inputEmail').val(), {
                        expires: 1 / 1440
                    });
                    Cookies.set("PW", $('#inputPassword').val(), {
                        expires: 1 / 1440
                    });
                    console.log(Cookies.get(""));

                    //var socket = io.connect();

                    // console.log("ID=",id);
                    //document.getElementById("Black").style.display = "inline";
                    $("#Black").css({
                        'display': 'inline'
                    });
                    $("#Black").animate({
                        'opacity': '1'
                    }, 2000, function() {
                        $("#SignInPage").css({
                            'display': 'none'
                        });
                        console.log("1234");
                        $("#GameAll").css({
                            'display': 'inline'
                        });
                        console.log("Entered");

                        AfterLogIn($('#inputEmail').val());


                        $("#Black").animate({
                            'opacity': "0"
                        }, 3000, function() {
                            $("#Black").css({
                                'display': 'none'
                            });
                            console.log("123456");
                        });
                    });
                } else {
                    

                    swal({
  title: "Are you sure?",
  text: "You will not be able to recover this imaginary file!",
  type: "warning",
  showCancelButton: true,
  confirmButtonColor: "#DD6B55",
  confirmButtonText: "Yes, delete it!",
  closeOnConfirm: false
},
function(){
  window.location = "/";
});
                    // function(){
                        // window.location = "/";
                    //  swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    // };
                }
            }

        });
    }
});
