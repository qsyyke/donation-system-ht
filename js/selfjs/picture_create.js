var url = "http://localhost/api";
$(function () {
    var option = $("#example-select option");

    var inputs = $(".bodyli input");

    var srcflag = false;
    var uploadflag = false;

    $(document).mousemove(function () {
        if (option[0].selected == true) {
            srcflag = false;
            uploadflag = true;
            $(".img_src").slideUp();
            $(".img_upload").slideDown();

        }else {
            srcflag = true;
            uploadflag = false;
            $(".img_upload").slideUp();
            $(".img_src").slideDown();
        }
    });


    $(".selfcreate").click(function () {
        
        if (srcflag) {
            var imgName = inputs[0].value;
            var imgSrc = inputs[1].value;

            //发送请求
            $.post({
                url: url+'/imginsert',
                data: {
                    imgName: imgName,
                    imgSrc: imgSrc
                }
            },function (data) {
                alert(data['data']['message'])
            });
        }else {
            var img_name = inputs[0].value;
            var fm = new FormData();
            var file = inputs[2].files[0];

            fm.append("imgFile",file);
            fm.append("img_name",img_name);

            $.post({
                url: url+"/imgupload",
                data: fm,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
            },function (data) {
                alert(data['data']['message']);
            });
        }
    })
});
