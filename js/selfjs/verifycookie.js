var url = "http://localhost/api";
$(function () {
    //发送请求，添加admincookie 这个是后台文件
    function addcookie() {
        $.get({
            // url: 'http://api.vipblogs.cn/addcookie',
            url: url+'/addcookie',
            data: {
                admin: 1
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            var taken = data['data']['entity']['rightTaken'];
            var isAdmin = data['data']['entity']['isRight'];
            //alert(data['data']['entity']['url'])
        })
    }
    addcookie();


    //验证taken
    function verify() {
        $.get({
            url: url+'/verifylogin',
            // url: 'http://api.vipblogs.cn/verifylogin',
            data: {
                admin: 1
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            var taken = data['data']['entity']['isTaken'];
            var isAdmin = data['data']['entity']['isAdmin'];
            var url = data['data']['entity']['url'];

            if (taken == 0 && isAdmin ==0) {
                window.location.href = "./login.html";
            }


            if (taken == 1 && isAdmin == 1) {
                //验证失败
                // window.location.href = data['data']['entity']['url'];
            }
            if (taken == 0 && isAdmin == 1) {
                //验证失败
                alert("请登录!!")
                window.location.href = "./login.html";
            }
        })
    }
    verify();
    setInterval(function () {
        verify();
    },2000)
})