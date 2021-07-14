var url = "http://localhost/api";
$(function () {

    $.fn.notebook.defaults = {
        autoFocus: false,
        placeholder: 'Your text here...',
        mode: 'multiline', //多行或内嵌
        modifiers: ['bold', 'italic', 'underline', 'h1', 'h2', 'ol', 'ul', 'anchor']
    };

    $(document).ready(function(){
        $('.my-editor').notebook();
    });

    var href = window.location.href;

    var arr = href.split("?");
    var identify = arr[1].split("=")[1];

    $.get({
        url: url+"/selectdescribe",
        data: {
            identify: identify
        }
    },function (data) {
        var list = data['data']['entity']['list'];
        if (list.lenth == 0) {
            return;
        }

        var edit = $(".my-editor");


        var findp = $("<p class='insert'></p>").get(0);

        findp.innerHTML = list[0]['h_describe'];
        edit.get(0).appendChild(findp);
    })
    
    
    var save = $(".selfsave");
    
    save.click(function () {
        var edit = $(".my-editor");

        var child = edit.get(0).children;

        for (let i = 0; i < child.length; i++) {
            var className = child[i].className;
            if (className == "placeholder") {
                child[i].innerHTML = "<p></p>";
            }
        }
        var editHtml = $(".my-editor").get(0).innerHTML;

        $.post({
            url: url+'/describeupdate',
            data: {
                describe: editHtml,
                identify: identify
            }
        },function (data) {
            alert(data['data']['message'])
        })
    });
})