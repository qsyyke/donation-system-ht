var url = "http://localhost/api";
$(function () {
    var butLocation = $(".location");

    butLocation.click(function () {
        //点击获取地理位置
        $.get({
            url: 'https://restapi.amap.com/v3/ip?output=json&key=e96cc3c79090373d47f28e19c49edc9d'
        },function (data) {
            $(".setaddress").get(0).value = data['province']+data['city'];
        });
    });

    $(".pub").click(function () {
        var inputs = $(".bodyli input");

        var username = inputs[0].value;
        var province = inputs[1].value;
        var msg = $(".msg").get(0).value;

        $.post({
            url: url+'/insertmessage',
            data: {
                username: username,
                province: province,
                message: msg
            }
        },function (data) {
            alert(data['data']['message']);
            if (data['data']['entity']['updateNumber'] ==1) {
                window.location.reload();
            }
        })
    });
})