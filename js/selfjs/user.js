var url = "http://localhost/api";
(function () {
    //用户列表

    $(function () {
        //父盒子
        var tbody = $("tbody").get(0);

        //obj是一个对象 index为下标
        function setUserDate(obj,index,pageObj) {

            var tr = $("<tr></tr>").get(0);
            //方框下标
            var inputIndex = $("<td  class=\" text-center\"><input class='checkboxone' data-delete=\""+obj['email']+"\" type=\"checkbox\" id=\"check5-td1\" name=\"check5-td1\"></td>").get(0);
            // var index = $("<td class=\"cell-small text-center\">"+index+"</td>").get(0);
            var index = $("<td class=\"cell-small text-center\">"+
                (Number(pageObj['data']['pageNo']-1)*Number(pageObj['data']['pageSize']) + index)
            +"</td>").get(0);

            //用户名
            var username = $("<td></td>").get(0);
            username.innerText = obj['username'];

            //密码
            // var pwd = $("<td>"+obj['password']+"</td>").get(0);

            //邮箱
            var email = $("<td>"+obj['email']+"</td>").get(0);
            //地址
            var address = $("<td>"+obj['address']+"</td>").get(0);

            var last = $("<td class=\"text-center\">\n" +
                "                            <div class=\"btn-group\">\n" +
                "                                <a href=\"javascript:void(0)\" class=\"btn btn-xs btn-info\"><i class=\"fa fa-globe\"></i></a>\n" +
                "                                <a href=\"javascript:void(0)\" class=\"btn btn-xs btn-success userEdit\"><i\n" +
                "                                        class=\"fa fa-pencil\"></i></a>\n" +
                "                                <a href=\"javascript:void(0)\" class=\"btn btn-xs btn-danger delete-user\"><i\n" +
                "                                        class=\"fa fa-trash-o\"></i></a>\n" +
                "                            </div>\n" +
                "                        </td>").get(0);


            tr.appendChild(inputIndex);
            tr.appendChild(index);
            tr.appendChild(username);
            // tr.appendChild(pwd);
            tr.appendChild(email);
            tr.appendChild(address);
            tr.appendChild(last);
            tbody.appendChild(tr);
        }

        //点击进行模糊查询
        var province = $(".userprovince option");
        var inputUser = $(".inputuser");
        var search = $(".input-group-btn");

        var selectText = "";
        var inputUserText = "";
        var myPageIndex = "0";
        $(document).mousemove(function () {
            inputUserText = inputUser.get(0).value;
            for (let i = 0; i < province.length; i++) {
                if (province[i].selected == true) {
                    selectText = province[i].innerText;
                }
            }
            myPageIndex = document.getElementsByClassName("selecting")[0].innerText;
        })

        //设置分页函数
        function setPageNo(pageNo) {
            /*$.get({
                // url: 'http://api.vipblogs.cn/userall'
                url: 'http://api.vipblogs.cn/page',
                data: {
                    pageNum: pageNo,

                }*/
            $.get({
                // url: 'http://api.vipblogs.cn/userall'
                url: url+'/page',
                data: {
                    pageNum: Number(pageNo),
                    province: selectText,
                    username: inputUserText,
                    isadmin: 0
                }
            },function (data) {
                var arrs = data['data']['entity']['userList'];
                var needIndex = 1;
                for (let i = 0; i < arrs.length; i++) {
                    if (arrs[i]['isadmin'] == 0) {
                        setUserDate(arrs[i],needIndex,data);
                        needIndex = needIndex +1;
                    }
                }
            });
        }


        //点击分页
        $(document).delegate(".pageNo", 'click', function () {
            $(".pageNo").removeClass("selecting");
            $(this).addClass("selecting");
            $("tbody").get(0).innerHTML = "<tbody></tbody>";
            setPageNo(this.innerText);
        });

        //点击上一页或者是下一页
        //点击前一页
        $(document).delegate(".pageprior", 'click', function () {
            //获取当前的页数
            var nowPageNo = document.getElementsByClassName("selecting");
            var pageNoIndex = nowPageNo[0].innerText;

            //pagination是ul
            var childLis = $(".pagination").get(0).children;
            var asArr = [];
            for (let i = 0; i < childLis.length; i++) {
                var liAs =  childLis[i].getElementsByTagName("a");
                if (liAs[0].className != "") {
                    asArr.push(liAs);
                }
            }

            $(".pageNo").removeClass("selecting");

            //为这个的上一个 添加一个selecting类名
            for (let i = 0; i < asArr.length; i++) {
                if(asArr[i][0].innerText == Number(pageNoIndex)-1) {
                    $(asArr[i][0]).addClass("selecting");
                }else {
                    if (Number(pageNoIndex)-1 == 0) {
                        $(asArr[asArr.length-1][0]).addClass("selecting");
                        break;
                    }
                }
            }

            $("tbody").get(0).innerHTML = "<tbody></tbody>";
            if (Number(pageNoIndex)-1 == 0) {

                pageNoIndex = (Number(asArr.length+1));
            }
            setPageNo(Number(pageNoIndex)-1);
        })

        //下一页
        $(document).delegate(".pagenext", 'click', function () {
            //获取当前的页数
            var nowPageNo = document.getElementsByClassName("selecting");
            var pageNoIndex = nowPageNo[0].innerText;
            var childLis = $(".pagination").get(0).children;
            var asArr = [];
            for (let i = 0; i < childLis.length; i++) {
                var liAs =  childLis[i].getElementsByTagName("a");
                if (liAs[0].className != "") {
                    asArr.push(liAs);
                }
            }

            $(".pageNo").removeClass("selecting");
            //为这个的上一个 添加一个selecting类名 5
            for (let i = 0; i < asArr.length; i++) {
                if(asArr[i][0].innerText == (Number(pageNoIndex)+1)) {
                    $(asArr[i][0]).addClass("selecting");
                }else {
                    if (Number(pageNoIndex)+1 == asArr.length+1) {
                        $(asArr[0][0]).addClass("selecting");
                        pageNoIndex = "0";
                        break;
                    }
                }
            }

            $("tbody").get(0).innerHTML = "<tbody></tbody>";
            setPageNo(Number(pageNoIndex)+1);
        });

        //点击进行模糊查询
        /*var province = $(".userprovince option");
        var inputUser = $(".inputuser");
        var search = $(".input-group-btn");*/

        search.click(function () {
            var selectText = "";
            for (let i = 0; i < province.length; i++) {
                if (province[i].selected == true) {
                    selectText = province[i].innerText;
                }
            }

            var inputUserText = inputUser.get(0).value;

            $.get({
                // url: 'http://api.vipblogs.cn/userall'
                url: url+'/page',
                data: {
                    pageNum: 1,
                    province: selectText,
                    username: inputUserText,
                    isadmin: 0
                }
            },function (data) {
                //pagination

                $("tbody").get(0).innerHTML = "<tbody></tbody>";
                $(".pagination").get(0).innerHTML = "";

                var arrs = data['data']['entity']['userList'];
                var needIndex = 1;
                for (let i = 0; i < arrs.length; i++) {
                    if (arrs[i]['isadmin'] == 0) {
                        setUserDate(arrs[i],needIndex,data);
                        needIndex = needIndex +1;
                    }
                }

                var totalPage = data['data']['totalPage'];
                var parentLi = $(".pagination").get(0);
                var prior = $("<li class=\"pageprior\"><a href=\"javascript:void(0)\">上一页</a></li>").get(0);
                var next = $("<li class=\"pagenext\"><a href=\"javascript:void(0)\">下一页</a></li>").get(0);
                parentLi.appendChild(prior);
                for (let i = 0; i < totalPage; i++) {
                    //创建页码
                    var pageLi = $("<li><a class='pageNo' href=\"javascript:void(0)\">"+(i+1)+"</a></li>").get(0);
                    parentLi.appendChild(pageLi);

                    if (i+1 == totalPage) {
                        parentLi.appendChild(next);
                    }
                }
                $($(".pageNo")[0]).addClass("selecting");
                if (data['data']['totalPage'] == 1) {
                    //点击分页
                    var pr = document.getElementsByClassName("pageprior");
                    $(pr).addClass("disabled");
                    var next = document.getElementsByClassName("pagenext");
                    $(next).addClass("disabled");
                }
            });
        });

        $.get({
            // url: 'http://api.vipblogs.cn/userall'
            url: url+'/page',
            data: {
                pageNum: 1,
                province: selectText,
                username: inputUserText,
                isadmin: 0
            }
        },function (data) {
            var arrs = data['data']['entity']['userList'];
            var needIndex = 1;
            for (let i = 0; i < arrs.length-1; i++) {
                if (arrs[i]['isadmin'] == 0) {

                }
                setUserDate(arrs[i],needIndex,data);
                needIndex = needIndex +1;
            }

            var totalPage = data['data']['totalPage'];
            var parentLi = $(".pagination").get(0);
            var prior = $("<li class=\"pageprior\"><a href=\"javascript:void(0)\">上一页</a></li>").get(0);
            var next = $("<li class=\"pagenext\"><a href=\"javascript:void(0)\">下一页</a></li>").get(0);
            parentLi.appendChild(prior);
            for (let i = 0; i < totalPage; i++) {
                //创建页码
                var pageLi = $("<li><a class='pageNo' href=\"javascript:void(0)\">"+(i+1)+"</a></li>").get(0);
                parentLi.appendChild(pageLi);

                if (i+1 == totalPage) {
                    parentLi.appendChild(next);
                }
            }
            $($(".pageNo")[0]).addClass("selecting");
            if (data['data']['totalPage'] == 1) {
                //点击分页
                var pr = document.getElementsByClassName("pageprior");
                $(pr).addClass("disabled");
                var next = document.getElementsByClassName("pagenext");
                $(next).addClass("disabled");
            }
        });

    });
})();

//修改 添加用户模块
(function () {
    $(function () {
        //button
        var butAdd = $(".modal-footer .btn-success");
        var butLocation = $(".location");

        //点击修改用户数据
        var userEdit = document.getElementsByClassName("userEdit");

        butLocation.click(function () {
            //点击获取地理位置
            $.get({
                url: 'https://restapi.amap.com/v3/ip?output=json&key=e96cc3c79090373d47f28e19c49edc9d'
            },function (data) {
                $(".dialog_address").get(0).value = data['province']+data['city'];
            });
        });

        //点击修改
        $(document).delegate(".userEdit", 'click', function () {
            var trParent = $(this).parents()[2];
            var children = trParent.children;

            $(".modal-title").get(0).innerText = "用户修改";

            butAdd.get(0).innerText = "修改";

            //旧的用户信息
            var edit_username = children[2].innerText;
            var edit_pwd = children[3].innerText;
            var edit_email = children[4].innerText;
            var edit_address = children[5].innerText;

            $(".dialog_username").get(0).value = edit_username;
            $(".dialog_address").get(0).value = edit_email;
            $(".dialog_email").get(0).value = edit_pwd;

            $(".noneed").get(0).innerText = edit_username;

            // $(".dialog_email").get(0).disabled = "disabled";
            $(".dialog_email").get(0).setAttribute("readonly", "readonly");


            $(".edit").get(0).style.display = "block";
            $(".edit").get(0).style.paddingLeft = "17px";
            $(".edit").addClass("in");
            $("body").addClass("modal-open");
        });

        $(".modal-header .close").click(function () {
            $(".edit").removeClass("in");
            $("body").removeClass("modal-open");
            $(".edit").get(0).style.display = "none";
            $(".edit").get(0).style.paddingLeft = "0px";
            $(".dialog_email").get(0).removeAttribute("readonly");
            $(".modal-title").get(0).innerText = "添加用户";
            butAdd.get(0).innerText = "创建";
        });

        $(".dia_cancel").click(function () {
            $(".edit").removeClass("in");
            $("body").removeClass("modal-open");
            $(".edit").get(0).style.display = "none";
            $(".edit").get(0).style.paddingLeft = "0px";
            $(".dialog_email").get(0).removeAttribute("readonly");
            $(".modal-title").get(0).innerText = "添加用户";
            butAdd.get(0).innerText = "创建";
            $(".modal-header .close").click();
        });


        butAdd.click(function () {
            var username = $(".dialog_username");
            var email = $(".dialog_email");
            var address = $(".dialog_address");
            //创建
            if (butAdd.get(0).innerText == "创建") {
                $.post({
                    // url: 'http://api.vipblogs.cn/iu',
                    url: url+'/iu',
                    data: {
                        username: username.get(0).value,
                        email: email.get(0).value,
                        address: address.get(0).value,
                        isAdmin: 0
                    }
                },function (data) {
                    alert(data['data']['message']);
                });
            }else {
                //修改
                //localhost/upuser?oldUsername=初尘初&newUsername=初尘初123&newEmail=229134877834@qq.com
                $.post({
                    // url: 'http://api.vipblogs.cn/upuser',
                    url: url+'/upuser',
                    data: {
                        oldUsername: $(".noneed").get(0).innerText,
                        newUsername: $(".dialog_username").get(0).value,
                        newEmail: $(".dialog_email").get(0).value
                    }
                },function (data) {
                    alert(data['data']['message']);
                    if (data['data']['entity']['update'] == 1) {
                        //修改成功
                        window.location.reload();
                    }
                });
            }
        });

        //删除数据
        $(document).delegate(".delete-user", 'click', function () {
            var trParent = $(this).parents()[2];
            var children = trParent.children;
            if (confirm("确定删除 "+children[2].innerText+" 信息?")) {
                $.get({
                    // url: 'http://api.vipblogs.cn/deluser',
                    url: url+'/deluser',
                    data: {
                        email: children[4].innerText
                    }
                },function (data) {
                    alert(data['data']['message']);

                    if (data['data']['message'] == 'success') {
                        //修改成功
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
                url: url+'/deluser',
                data: {
                    email: identify
                }
            },function (data) {
                if (index == deleteArr.length -1) {
                    window.location.reload();
                }

            });
        }

    });
})();