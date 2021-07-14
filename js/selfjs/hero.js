var url = "http://localhost/api";
(function () {

//修改 添加用户模块
    (function () {
        $(function () {
            var imgArrs = [];
            $.get({
                url: url+'/imgselectpage'
            },function (data) {
                var totalPage = data['data']['totalPage'];
                if (totalPage == 1) {
                    var imgList = data['data']['entity']['userList'];
                    for (let i = 0; i < imgList.length; i++) {
                        imgArrs.push(imgList[i]);
                    }
                } else {
                    for (let i = 0; i < totalPage; i++) {
                        $.get({
                            url: url+'/imgselectpage',
                            data: {
                                pageNum: (i + 1)
                            }
                        }, function (dataPage) {
                            var imgList = dataPage['data']['entity']['userList'];
                            for (let i = 0; i < imgList.length; i++) {
                                imgArrs.push(imgList[i]);
                            }
                        })
                    }
                }
            })


            //option选项

            var select = $(".selfselect");
            $.get({
                url: url+'/herotypes'
            },function (data) {
                var arr = data['data']['entity']['list'];
                for (let i = 0; i < arr.length; i++) {
                    var option = $("<option value='"+arr[i]['pno']+"' name='"+arr[i]['pno']+"'>"+arr[i]['ptype']+"</option>").get(0);
                    select.get(0).appendChild(option);
                }
            });

            //保存按钮 唯一
            var butAdd = $(".modal-footer .btn-success");

            //点击小叉叉
            $(".modal-header .close").click(function () {
                $(".selfdialog").stop().slideToggle();
                // $(".dialog_email").get(0).removeAttribute("readonly");
                $(".modal-title").get(0).innerText = "添加英雄人物";
                butAdd.get(0).innerText = "创建";
            });

            //点击取消按钮
            $(".dia_cancel").click(function () {
                $(".selfdialog").stop().slideToggle();
                // $(".dialog_email").get(0).removeAttribute("readonly");
                $(".modal-title").get(0).innerText = "添加英雄人物";
                butAdd.get(0).innerText = "创建";

            });


            //点击删除旁边的创建按钮
            $(".pagecreate").click(function () {
                /*for (let i = 0; i < imgArrs.length-1; i++) {
                    setImgOption(imgArrs[i]);
                }*/

                //顶部标题
                $(".modal-title").get(0).innerText = "创建英雄人物";
                butAdd.get(0).innerText = "创建";
                $(".selfdialog").stop().slideToggle();
                $(".noneedimg").slideUp();
            });



            var top = $(".selfimgselect").get(0);
            function setImgOption(o) {
                if (o['img_name'] == undefined) {
                    return;
                }
                var option = $("<option value=\""+o['img_src']+"\">"+o['img_name']+"</option>").get(0);

                top.appendChild(option);
            }



            setTimeout(function () {
                for (let i = 0; i < imgArrs.length -1; i++) {
                    setImgOption(imgArrs[i]);
                }
            },500)
            //点击每一行的编辑按钮
            $(document).delegate(".selfedit", 'click', function () {

                var trParent = $(this).parents()[2];

                //children中存放的是，点击的那列中的元素
                var children = trParent.children;

                //设置唯一标识
                $(".identify").get(0).innerText = children[9].innerText;

                /*for (let i = 0; i < imgArrs.length-1; i++) {
                    setImgOption(imgArrs[i]);
                }*/

                $.post({
                    url: url+"/findherobysql",
                    data:{
                        identify: children[9].innerText
                    }
                },function (data) {
                    var heroArr = data['data']['entity']['userList'];

                    var honors = "";
                    for (let i = 0; i < 7; i++) {
                        honors = honors + heroArr[0]["honor"+(i+1)]+",";
                    }

                    var imgSrc = heroArr[0]['photosrc'];

                    var typeNo = heroArr[0]['ptype'];

                    var selected = $(".selfselect option");

                    //设置英雄类别
                    for (let i = 0; i < selected.length; i++) {
                        if (selected[i].getAttribute("name")== typeNo) {
                            selected[i].selected = "selected";
                        }
                    }

                    $(".noneedimg").slideDown();

                    $(".modal-title").get(0).innerText = "修改";

                    butAdd.get(0).innerText = "修改";


                    //旧的用户信息
                    var three = children[2].innerText;
                    var four = children[3].innerText;
                    var five = children[4].innerText;
                    var six = children[5].innerText;
                    var seven = children[6].innerText;

                    var inputs = $(".modal-body input");

                    inputs.get(0).value = three;
                    // inputs.get(1).value = imgSrc;
                    inputs.get(1).value = honors;

                    $(".selfdialog").stop().slideToggle();
                })


            });


            //点击弹窗保存
            butAdd.click(function () {
                var inputs = $(".modal-body input");

                var imgSrc = "";

                var option = $(".selfimgselect option");
                for (let i = 0; i < option.length; i++) {
                    if (option[i].selected == true) {
                        imgSrc = option[i].getAttribute("value");
                    }
                }

                //children中存放的是，点击的那列中的元素
                //是否展示
                var isShow = 0;
                var isShowOption = $(".isshow").get(0).children;
                if (isShowOption[0].selected == true) {
                    //展示
                    isShow = 1;
                }

                if (isShowOption[1].selected == true) {
                    //展示
                    isShow = 0;
                }

                var typeNo = 0;
                var typeOption = $(".selfselect").get(0).children;
                for (let i = 0; i < typeOption.length; i++) {
                    if (typeOption[i].selected == true) {
                        typeNo = typeOption[i].value;
                    }
                }

                var imgSrcNeed = "";
                for (let i = 0; i < imgArrs.length; i++) {

                }

                if (butAdd.get(0).innerText == "创建") {

                    $.post({
                        // url: 'http://api.vipblogs.cn/iu',
                        url: url+'/heroinsert',
                        data: {
                            heroName: inputs[0].value,
                            photoSrc: imgSrc,
                            isShow: isShow,
                            honors: inputs[1].value,
                            pType: typeNo
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
                        url: url+'/heroupdate',
                        data: {
                            heroName: inputs[0].value,
                            identify: $(".identify").get(0).innerText,
                            photoSrc: imgSrc,
                            isShow: isShow,
                            honors: inputs[1].value,
                            pType: typeNo
                        }
                    },function (data) {
                        alert(data['data']['message']);
                        if (data['data']['entity']['update'] == 1) {
                            window.location.reload();
                        }
                    });
                }
            });


            //单选框
            var radisAll = $(".checkall");

            var checkedFlag = false;

            $(document).delegate(".checkall", 'click', function () {
                var radiss = document.getElementsByClassName("checkboxone");

                if (checkedFlag) {
                    //已经选中
                    checkedFlag = false;
                    for (let i = 0; i < radiss.length; i++) {
                        radiss[i].checked = false;
                    }
                    checkedFlag = false;

                }else {

                    //没有选中
                    for (let i = 0; i < radiss.length; i++) {
                        radiss[i].checked = "checked";
                    }
                    checkedFlag = true;
                }
            })

            //单选
            $(document).delegate(".checkboxone", 'click', function () {
                if (checkedFlag) {
                    radisAll.click();
                }

                this.checked = "checked";
            })

            //点击删除
            var deleteAll = $(".barboxs .btn-danger");
            deleteAll.click(function () {
                var radiss = document.getElementsByClassName("checkboxone");

                //存放删除的编号
                var deleteArr = [];
                for (let i = 0; i < radiss.length; i++) {
                    var identify = $(radiss[i].parentElement).siblings()[8].innerText;
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
                    url: url+'/herodelete',
                    data: {
                        identify: identify
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
                        url: url+'/herodelete',
                        data: {
                            identify: children[9].innerText
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

    //用户列表

    $(function () {
        //父盒子
        var tbody = $("tbody").get(0);

        //obj是一个对象 index为下标
        function setUserDate(obj,index,pageObj) {

            var tr = $("<tr></tr>").get(0);
            //方框下标
            var one = $("<td class=\"text-center\"><input class='checkboxone' type=\"checkbox\" id=\"check5-td1\" name=\"check5-td1\"></td>").get(0);
            var two = $("<td class=\"cell-small text-center\">"+
                (Number(pageObj['data']['pageNo']-1)*Number(pageObj['data']['pageSize']) + index)
                +"</td>").get(0);


            var three = $("<td id=\"td_username\"><div>"+obj['name']+"</div></td>").get(0);

            var isShow = "";

            if (obj['isshow'] == "1") {
                isShow = "是";
            }else {
                isShow = "否";
            }
            var four = $("<td>"+isShow+"</td>").get(0);

            var five = $("<td>"+obj['h_like']+"</td>").get(0);
            var six = $("<td>"+obj['ptype']+"</td>").get(0);
            //file:///D:/Code/yqshowhoutai/houtai/hero.html
            //<a target='_blank' href='../.././decrshow.html?identift='+obj['identify']+ 'a>
            var seven = $("<td><a style='color: red;' href=\"./decrshow.html?identift="+obj['identify']+" \">查看人物描述</a></td>").get(0);

            var honor = "";
            for (let i = 0; i < 7; i++) {
                if (obj["honor"+(i+1)] != "") {
                    honor = honor + obj["honor"+(i+1)]+",";
                }
            }

            honor = honor.substr(0,honor.length-1);

            var eight = $("<td>"+honor+"</td>").get(0);
            var nine = $("<td><img class='img-circle' src='"+obj['photosrc']+"' alt=''></td>").get(0);
            var ten = $("<td style='display: none'>"+obj['identify']+"</td>").get(0);

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
            tr.appendChild(seven);
            tr.appendChild(eight);
            tr.appendChild(nine);
            tr.appendChild(ten);
            tr.appendChild(last);
            tbody.appendChild(tr);
        }


        var myPageIndex = "0";
        var myHeroName = "";
        $(document).mousemove(function () {
            myPageIndex = document.getElementsByClassName("selecting")[0].innerText;
            myHeroName = document.getElementsByClassName("selffind")[0].value;
        })

        //设置分页函数
        function setPageNo(pageNo) {
            $.get({
                // url: 'http://api.vipblogs.cn/userall'
                url: url+'/HeroAll',
                data: {
                    pageNum: Number(pageNo),
                    heroName: myHeroName
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
                // url: 'http://api.vipblogs.cn/userall'
                url: url+'/HeroAll',
                data: {
                    pageNum: 1,
                    heroName: myHeroName
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
            // url: 'http://api.vipblogs.cn/userall'
            url: url+'/HeroAll',
            data: {
                pageNum: 1,
                heroName: myHeroName
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
