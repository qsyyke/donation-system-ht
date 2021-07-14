var url = "http://localhost/api";
(function () {
    //用户列表

    $(function () {

        var nowTemp = new Date();
        var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

        var checkin = $('.starttime').datepicker({
            onRender: function(date) {
                return date.valueOf() < now.valueOf() ? 'disabled' : '';
            }
        }).on('changeDate', function(ev) {
            if (ev.date.valueOf() > checkout.date.valueOf()) {
                var newDate = new Date(ev.date)
                newDate.setDate(newDate.getDate() + 1);
                checkout.setValue(newDate);
            }
            checkin.hide();
            $('.endtime')[0].focus();
        }).data('datepicker');
        var checkout = $('.endtime').datepicker({
            onRender: function(date) {
                return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
            }
        }).on('changeDate', function(ev) {
            checkout.hide();
        }).data('datepicker');



        //父盒子
        var tbody = $("tbody").get(0);

        //obj是一个对象 index为下标
        function setUserDate(obj,index,pageObj) {

            var tr = $("<tr></tr>").get(0);
            //方框下标
            var one = $("<td class=\"text-center\"><input type=\"checkbox\" id=\"check5-td1\" name=\"check5-td1\"></td>").get(0);
            var two = $("<td class=\"cell-small selfindex text-center\">"+
                (Number(pageObj['data']['pageNo']-1)*Number(pageObj['data']['pageSize']) + index)
                +"</td>").get(0);

            var three_buyer = $("<td id=\"td_username\"><div>"+obj['buyer']+"</div></td>").get(0);
            var three = $("<td id=\"td_username\"><div>"+obj['email']+"</div></td>").get(0);

            var four = $("<td>"+obj['tradeNo']+"</td>").get(0);

            var five = $("<td class=\"address\"><div>"+obj['count']+"</div></td>").get(0);
            var six = $("<td>"+obj['money']+"</td>").get(0);

            var seven = $("<td>"+obj['zfbCount']+"</td>").get(0);



            // var eight = $("<td><span class=\"label label-danger\">"+reFund+"</span></td>").get(0);
            var nine = $("<td>"+obj['date']+"</td>").get(0);

            var last = $("<td class=\"text-center\">\n" +
                "                            <div class=\"btn-group\">\n" +
                "                                <a href=\"javascript:void(0)\" class=\"btn btn-xs refund btn-info\"><i\n" +
                "                                        class=\"fa fa-level-down\"></i></a>\n" +
                "                                <a href=\"javascript:void(0)\" class=\"btn btn-xs selfedit btn-success\"><i\n" +
                "                                        class=\"fa fa-pencil\"></i></a>\n" +
                "                            </div>\n" +
                "                        </td>").get(0);


            // tr.appendChild(one);
            tr.appendChild(two);
            tr.appendChild(three_buyer);
            tr.appendChild(three);
            tr.appendChild(four);
            tr.appendChild(five);
            tr.appendChild(seven);
            tr.appendChild(six);

            // tr.appendChild(eight);
            tr.appendChild(nine);
            tbody.appendChild(tr);
        }


        var myPageIndex = "";
        var myUsername = "";
        var startTime = "2021-01-01 00:00:00";
        var endTime = "2099-01-01 23:59:59";

        $(document).mousemove(function () {
            myPageIndex = document.getElementsByClassName("selecting")[0].innerText;
            myUsername = document.getElementsByClassName("selffind")[0].value;

            var startTimeFind = $(".starttime").get(0).value;
            var endTimeFind = $(".endtime").get(0).value;

            //05/12/2021 : 05/13/2021

            if (startTimeFind != "") {
                var startArr = startTimeFind.split("/");
                startTime = startArr[2]+"-"+startArr[0]+"-"+startArr[1]+" 00:00:00";
            }else {
                startTime = "2021-01-01 00:00:00";
            }
            if (endTimeFind != "") {
                var endArr = endTimeFind.split("/");
                endTime = endArr[2]+"-"+endArr[0]+"-"+endTime[1]+" 23:59:59";
            }else {
                endTime = "2099-01-01 23:59:59";
            }
        })

        //设置分页函数
        function setPageNo(pageNo) {
            $.get({
                // url: 'http://api.vipblogs.cn/userall'
                url: url+'/tall',
                data: {
                    isRefund: 1,
                    pageNum: Number(pageNo),
                    username: myUsername,
                    startTime: startTime,
                    endTime: endTime
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
            var serPageIndex = document.getElementsByClassName("selecting")[0].innerText;
            var sermyUsername = document.getElementsByClassName("selffind")[0].value;

            var startTimeFind = $(".starttime").get(0).value;
            var endTimeFind = $(".endtime").get(0).value;

            //05/12/2021 : 05/13/2021

            var findStart = "";
            var findEnd = "";

            if (startTimeFind != "") {
                var startArr = startTimeFind.split("/");
                findStart = startArr[2]+"-"+startArr[0]+"-"+startArr[1]+" 00:00:00";
            }else {
                findStart = "2021-01-01 00:00:00";
            }
            if (endTimeFind != "") {
                var endArr = endTimeFind.split("/");
                findEnd = endArr[2]+"-"+endArr[0]+"-"+endTime[1]+" 23:59:59";
            }else {
                findEnd = "2099-01-01 23:59:59";
            }

            $.get({
                // url: 'http://api.vipblogs.cn/userall'
                url: url+'/tall',
                data: {
                    isRefund: 1,
                    pageNum: Number(serPageIndex),
                    username: sermyUsername,
                    startTime: findStart,
                    endTime: findEnd
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
            url: url+'/tall',
            data: {
                isRefund: 1,
                pageNum: 1,
                username: myUsername,
                startTime: startTime,
                endTime: endTime
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
        //option选项

        var select = $(".selfselect");


        /*$.get({
            url: 'http://api.vipblogs.cn/herotypes'
        },function (data) {
            var arr = data['data']['entity']['list'];
            for (let i = 0; i < arr.length; i++) {
                var option = $("<option value='"+arr[i]['pno']+"' name='"+arr[i]['pno']+"'>"+arr[i]['ptype']+"</option>").get(0);
                select.get(0).appendChild(option);
            }
        });*/

        //保存按钮 唯一
        var butAdd = $(".modal-footer .btn-success");

        //点击小叉叉
        $(".modal-header .close").click(function () {
            $(".selfdialog").stop().slideToggle();
            $(".dialog_email").get(0).removeAttribute("readonly");
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
            $(".selfdialog").stop().slideToggle();
            $(".noneedimg").slideUp();
        });

        //点击每一行的编辑按钮
        $(document).delegate(".selfedit", 'click', function () {
            var trParent = $(this).parents()[2];

            //children中存放的是，点击的那列中的元素
            var children = trParent.children;

            $(".noneedimg").slideDown();

            $(".modal-title").get(0).innerText = "修改";

            butAdd.get(0).innerText = "修改";

            //设置唯一标识
            $(".identify").get(0).innerText = children[4].innerText;
            $(".identifyusername").get(0).innerText = children[2].innerText;
            $(".identifyemail").get(0).innerText = children[3].innerText;

            //旧的用户信息
            var three = children[2].innerText;
            var four = children[3].innerText;
            var five = children[4].innerText;
            var six = children[5].innerText;
            var seven = children[6].innerText;

            var inputs = $(".modal-body input");
            //用户名
            inputs.get(0).value = three;

            //订单
            inputs.get(1).value = four;
            inputs.get(2).value = six;
            // inputs.get(1).value = four;
            // inputs.get(2).value = five;

            $(".selfdialog").stop().slideToggle();
        });

        //点击进行退款
        $(document).delegate(".refund", 'click', function () {
            var trParent = $(this).parents()[2];

            //children中存放的是，点击的那列中的元素
            var children = trParent.children;
            var tradeNo = children[4].innerText;
            var buyer = children[2].innerText;

            if (confirm("确定为  "+buyer+"  办理退款")) {
                $.get({
                    url: url+'/refund',
                    data: {
                        outTradeNo: tradeNo
                    }
                },function (data) {
                    var sub_msg = "";
                    if (data['alipay_trade_refund_response']['msg'] != "Success") {
                        sub_msg = data['alipay_trade_refund_response']['sub_msg'];
                        alert(sub_msg);
                    }else {
                        alert(buyer+" 已退款成功 ")
                    }
                })
            }
        })

        //点击弹窗保存
        butAdd.click(function () {
            var inputs = $(".modal-body input");

            //children中存放的是，点击的那列中的元素
            //是否展示
            var oldUsername = $(".identifyusername").get(0).innerText;
            var oldEmail = $(".identifyemail").get(0).innerText;
            var tradeNo = $(".identify").get(0).innerText;

            if (butAdd.get(0).innerText == "创建") {

            }else {
                //修改
                $.post({
                    // url: 'http://api.vipblogs.cn/iu',
                    url: url+'/tradeupdate',
                    data: {
                        newEmail: inputs[1].value,
                        newUsername: inputs[0].value,
                        outTradeNo: $(".identify").get(0).innerText,
                        oldUsername: $(".identifyusername").get(0).innerText,
                        oldEmail: $(".identifyemail").get(0).innerText,
                        donateAddress: inputs[2].value,
                    }
                },function (data) {
                    alert(data['data']['message']);
                    if (data['data']['entity']['update'] == 1) {
                        window.location.reload();
                    }
                });
            }
        });

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