var url = "http://localhost/api";
$(function () {
    var button = $("button");
    $("input").get(0).value = "qsyyke";
    $("input").get(1).value = "111111";


    button.click(function () {
        var username = $("input").get(0).value;
        var pwd = $("input").get(1).value;
        $.get({
            url: url+"/login",
            data: {
                username: username,
                password: pwd
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            if (data['data']['entity']['isExists'] == 1) {
                window.location.href = "./index.html";
            }else {
                alert(data['data']['message'])
            }
        })

        setTimeout(function (params) {
            $.get({
                url: url+'/controlindex',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
            },function (data) {
                // $(".head span").get(0).innerText = data['data']['entity']['admin'];
            });
        },5000)
    });
});