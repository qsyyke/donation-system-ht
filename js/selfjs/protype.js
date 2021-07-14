var url = "http://localhost/api";
(function () {
    //用户列表

    $(function () {
        //父盒子
        var tbody = $("tbody").get(0);

        //obj是一个对象 index为下标
        function setUserDate(index,typeObj) {

            var typeNo = typeObj['pno'];

            var typeName = typeObj['ptype'];

            var heroNames = " ";
            var count = "";

            var tr = $("<tr class=\"ptype-td\"></tr>").get(0);
            //方框下标
            var one = $("<td class=\"text-center\"><input class='checkboxone' data-delete=\""+typeName+"\" type=\"checkbox\" id=\"check5-td1\" name=\"check5-td1\"></td>").get(0);
            var two = $("<td class=\"cell-small text-center\">"+index+"</td>").get(0);


            var three = $("<td id=\"td_username\"><div>"+typeName+"</div></td>").get(0);

            var four = $("<td>"+typeNo+"</td>").get(0);

            var five = $("<td>"+count+"</td>").get(0);
            var six = $("<td>"+heroNames+"</td>").get(0);

            var last = $("<td class=\"text-center\">\n" +
                "                            <div class=\"btn-group\">\n" +
                "                                <a href=\"javascript:void(0)\" class=\"btn btn-xs selfedit btn-success\"><i\n" +
                "                                        class=\"fa fa-pencil\"></i></a>\n" +
                "                                <a href=\"javascript:void(0)\" class=\"btn btn-xs selfdelete btn-danger\"><i\n" +
                "                                        class=\"fa fa-trash-o\"></i></a>\n" +
                "                            </div>\n" +
                "                        </td>").get(0);


            tr.appendChild(one);
            tr.appendChild(two);
            tr.appendChild(three);
            tr.appendChild(four);
            tr.appendChild(five);
            tr.appendChild(six);
            tr.appendChild(last);
            tbody.appendChild(tr);
        }


        $.get({
            // url: 'http://api.vipblogs.cn/userall'
            url: url+'/selectbysql',
        },function (data) {
            var arrCount = data['data']['entity']['countList'];
            var arrList = data['data']['entity']['queryForList'];
            var arrType = data['data']['entity']['typesList'];
            var needIndex = 1;

            for (let i = 0; i < arrType.length; i++) {

                needIndex = needIndex+1;
                setUserDate(needIndex,arrType[i]);
            }

            var trs = document.getElementsByClassName("ptype-td");
            for (let i = 0; i < trs.length; i++) {
                var children = trs[i].children;
                for (let j = 0; j < arrCount.length; j++) {
                    if (arrCount[j]['ptype'] == children[3].innerText) {
                        //编号相同
                        children[4].innerText = arrCount[j]['count'];
                    }
                }
                for (let j = 0; j < arrList.length; j++) {
                    var listNo = arrList[j][arrList[j].length -1]['typeNo'];
                    if (listNo == children[3].innerText) {
                        //编号相同
                        var honors = " ";
                        for (let k = 0; k < arrList[j].length-1; k++) {
                            honors = honors + arrList[j][k]['heroname']+" ,";
                        }
                        honors = honors.substr(0,honors.length -1);
                        children[5].innerText = honors;
                    }
                }
            }
        });

    });
})();

//修改 添加用户模块
(function () {
    $(function () {

        //保存按钮 唯一
        var butAdd = $(".modal-footer .btn-success");

        //点击小叉叉
        $(".modal-header .close").click(function () {
            $(".selfdialog").stop().slideToggle();
            $(".modal-title").get(0).innerText = "添加英雄人物";
            butAdd.get(0).innerText = "创建";
        });

        //点击取消按钮
        $(".dia_cancel").click(function () {
            $(".selfdialog").stop().slideToggle();
            $(".dialog_email").get(0).removeAttribute("readonly");
            $(".modal-title").get(0).innerText = "添加英雄人物";
            butAdd.get(0).innerText = "创建";

        });


        //点击删除旁边的创建按钮
        $(".pagecreate").click(function () {

            //顶部标题
            $(".modal-title").get(0).innerText = "创建英雄人物";
            butAdd.get(0).innerText = "创建";
            $(".dialog_pno").get(0).readOnly = false;
            $(".selfdialog").stop().slideToggle();
            $(".noneedimg").slideUp();
        });

        //点击每一行的编辑按钮
        $(document).delegate(".selfedit", 'click', function () {
            var trParent = $(this).parents()[2];

            //children中存放的是，点击的那列中的元素
            var children = trParent.children;

            $(".modal-title").get(0).innerText = "修改";

            butAdd.get(0).innerText = "修改";

            //设置唯一标识
            $(".identify").get(0).innerText = children[3].innerText;

            //旧的用户信息
            var three = children[2].innerText;
            var four = children[3].innerText;
            var five = children[4].innerText;
            var six = children[5].innerText;
            var seven = children[6].innerText;

            var inputs = $(".modal-body input");
            inputs.get(0).value = three;
            inputs.get(1).value = four;
            inputs.get(1).readOnly = "readOnly";

            $(".selfdialog").stop().slideToggle();
        });


        //点击弹窗保存
        butAdd.click(function () {
            var inputs = $(".modal-body input");

            //children中存放的是，点击的那列中的元素
            if (butAdd.get(0).innerText == "创建") {

                $.post({
                    // url: 'http://api.vipblogs.cn/iu',
                    url: url+'/insertherotype',
                    data: {
                        pNo: inputs[1].value,
                        pType: inputs[0].value
                    }
                },function (data) {
                    alert(data['data']['message']);
                    if (data['data']['entity']['update'] == 1) {
                        window.location.reload();
                    }
                });
            }else {
                //修改
                $.post({
                    // url: 'http://api.vipblogs.cn/iu',
                    url: url+'/herotypeupdate',
                    data: {
                        pNo: inputs[1].value,
                        pType: inputs[0].value
                    }
                },function (data) {
                    alert(data['data']['message']);
                    if (data['data']['entity']['update'] == 1) {
                        window.location.reload();
                    }
                });
            }
        });

        //点击删除
        var deleteAll = $(".barboxs .btn-danger");
        deleteAll.click(function () {
            var radiss = document.getElementsByClassName("checkboxone");

            //存放删除的编号
            var deleteArr = [];
            for (let i = 0; i < radiss.length; i++) {
                var identify = radiss[i].getAttribute("data-delete");
                var isCheck = radiss[i].checked;

                if (isCheck == true) {
                    deleteArr.push(identify);
                }
            }

            if (deleteArr.length != 0) {
                if (confirm("确定删除 "+deleteArr.length +" 条数据?")) {
                    for (let i = 0; i < deleteArr.length; i++) {
                        deleteData(deleteArr[i],deleteArr,i);
                    }
                }
            }

        });

        //删除方法
        function deleteData(identify,deleteArr,index) {
            $.get({
                // url: 'http://api.vipblogs.cn/deluser',
                url: url+'/herotypedelete',
                data: {
                    pType: identify
                }
            },function (data) {
                if (index == deleteArr.length -1) {
                    window.location.reload();
                }

            });
        }

        //删除数据
        $(document).delegate(".selfdelete", 'click', function () {
            var trParent = $(this).parents()[2];
            var children = trParent.children;

            if (confirm("确定删除 "+children[2].innerText+" 信息?")) {
                $.get({
                    // url: 'http://api.vipblogs.cn/deluser',
                    url: url+'/herotypedelete',
                    data: {
                        pType: children[2].innerText
                    }
                },function (data) {
                    alert(data['data']['message']);

                    if (data['data']['entity']['delete'] == 1) {
                        //修改成功
                        window.location.reload();
                    }
                });
            }
        });
    });
})();