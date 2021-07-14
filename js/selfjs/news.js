var url = "http://localhost/api";
(function () {
    //用户列表

    $(function () {
        //父盒子
        var tbody = $("tbody").get(0);

        //obj是一个对象 index为下标
        function setUserDate(obj,index,pageObj) {

            var tr = $("<tr class=\"message\"></tr>").get(0);
            //方框下标
            var one = $("<td class=\"text-center\"><input class='checkboxone' data-delete=\""+obj['title']+"\" type=\"checkbox\" id=\"check5-td1\" name=\"check5-td1\"></td>").get(0);
            var two = $("<td class=\"cell-small text-center\">"+
                (Number(pageObj['data']['pageNo']-1)*Number(pageObj['data']['pageSize']) + index)
                +"</td>").get(0);


            var three = $("<td>"+obj['title']+"</td>").get(0);


            var four = $("<td><a target='_blank' href='"+obj['href']+"'>"+obj['href']+"</a></td>").get(0);

            var five = $("<td>"+obj['date']+"</td>").get(0);

            var last = $("<td class=\"text-center\">\n" +
                "                            <div class=\"btn-group\">\n" +
                "                                <a href=\"javascript:void(0)\" class=\"btn btn-xs selfdelete btn-danger\"><i\n" +
                "                                        class=\"fa fa-trash-o\"></i></a>\n" +
                "                            </div>\n" +
                "                        </td>").get(0);


            tr.appendChild(one);
            tr.appendChild(two);
            tr.appendChild(three);
            tr.appendChild(four);
            tr.appendChild(five);
            tr.appendChild(last);
            tbody.appendChild(tr);
        }


        var myPageIndex = "";
        var myUsername = "";

        $(document).mousemove(function () {
            myPageIndex = document.getElementsByClassName("selecting")[0].innerText;
            myUsername = document.getElementsByClassName("selffind")[0].value;
        })

        //设置分页函数
        function setPageNo(pageNo) {
            $.get({
                url: url+'/newspage',
                data: {
                    pageNum: Number(pageNo),
                    title: myUsername
                }
            },function (data) {
                var arrs = data['data']['entity']['userList'];
                var needIndex = 1;
                for (let i = 0; i < arrs.length-1; i++) {
                    setUserDate(arrs[i],needIndex,data);
                    needIndex = needIndex +1;
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

        //点击进行搜索
        $(".input-group-btn button").click(function () {
            $.get({
                url: url+'/newspage',
                data: {
                    pageNum: 1,
                    title: myUsername
                }
            },function (data) {
                $("tbody").get(0).innerHTML = "<tbody></tbody>";
                var arrs = data['data']['entity']['userList'];
                var needIndex = 1;
                for (let i = 0; i < arrs.length-1; i++) {
                    setUserDate(arrs[i],needIndex,data);
                    needIndex = needIndex +1;
                }

                var totalPage = data['data']['totalPage'];
                var parentLi = $(".pagination").get(0);
                parentLi.innerHTML = $("<ul class=\"pagination\"></ul>");
                parentLi.innerText = "";
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
            url: url+'/newspage',
            data: {
                pageNum: 1,
                title: ''
            }
        },function (data) {
            var arrs = data['data']['entity']['userList'];
            var needIndex = 1;
            for (let i = 0; i < arrs.length-1; i++) {
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
                url: url+'/deletenews',
                data: {
                    title: identify
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

            //设置唯一标识

            var title = children[2].innerText;
            if (confirm("确定删除 "+children[2].innerText+" 信息?")) {
                $.get({
                    url: url+'/deletenews',
                    data: {
                        title: title
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
    });
})();