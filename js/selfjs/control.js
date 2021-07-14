//此文件用于echarts之外的元素修改
var url = "http://localhost/api";
$(function () {
    //总捐款人数
    (function () {
        var totalMoney = $(".totalMoney").get(0);
        var totalPeople= $(".totalPeople").get(0);

        function getData() {
            $.get({
                url: url+'/donatecount',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true
            },function (data) {
                totalPeople.innerText = data['data']['entity']['donateList'].length;
                totalMoney.innerText = data['data']['totalMoney'];
            })
        }

        getData();

        //每隔3秒请求一次
        setInterval(function () {
            getData();
        },1000*60)
    })();


    (function () {

        $.get({
            url: url+'/controlindex',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            $(".head span").get(0).innerText = data['data']['entity']['admin'];
        });

        var trs = $(".setbody tr");

        var trade = trs[0].children;
        var hero = trs[1].children;
        var msg = trs[2].children;
        var user = trs[3].children;

        //订单总数
        $.get({
            url: url+"/tall"
        },function (data) {
            trade[1].innerText = data['data']['totalCount'];
        })

        //退款
        $.get({
            url: url+"/tall",
            data: {
                isRefund: 1
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            trade[3].innerText = data['data']['totalCount'];
        })

        $.get({
            url: url+"/HeroAll"
        },function (data) {
            hero[1].innerText = data['data']['totalCount'];
        })

        $.get({
            url: url+"/commentpageall",
            data: {
                // isRefund: 1
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            hero[3].innerText = data['data']['totalCount'];
        })

        $.get({
            url: url+"/newspage",
            data: {
                // isRefund: 1
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            msg[1].innerText = data['data']['totalCount'];
        })

        $.get({
            url: url+"/herotypes",
            data: {
                // isRefund: 1
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            msg[3].innerText = data['data']['entity']['list'].length;
        })

        $.get({
            url: url+"/page",
            data: {
                // isRefund: 1
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            user[3].innerText = data['data']['totalCount'];
        })

        $.get({
            url: url+"/imgselectpage",
            data: {
                // isRefund: 1
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        },function (data) {
            user[1].innerText = data['data']['totalCount'];
        })
    })();

    var timepq = $("#pq").get(0).value;
    var onbut = $(".onbut");
    var offbut = $(".offbut");

    // 开启自动更新
    /*onbut.click(function () {
        alert(23)
        if(Number(timepq) < 600000) {
            alert(1)
            onbut.get(0).disabled = "disabled";
            alert("时间间隔不能低于10分钟 600000");
            setTimeout(function () {
                onbut.get(0).disabled = false;
            })
        }else {
            $({
                url: 'http://api.vipblogs.cn/onautoupdate',
                data: {
                    autoupdatetime: timepq,
                    isopenupdate: true
                }
            })
            onbut.get(0).disabled = "disabled";

        }
    });
    offbut.click(function () {
        alert(23)
        $({
            url: 'http://api.vipblogs.cn/offautoupdate?isStopSleep=true',
            data: {
                isStopSleep:true
            }
        },function (data) {
            if (data['data']['message'] == "success") {
                //成功关闭自动更新
                offbut.get(0).disabled = "disabled";
                onbut.get(0).disabled = false;
            }
        })
    });*/
    //每隔30秒，查看一次，启动自动更新的状态，true表示停止自动更新，反之


    /*setInterval(function () {
        $.get({
            url: 'http://api.vipblogs.cn/autonewsstatus'
        },function (data) {
            if (data['data']['status'] == true) {
                //停止自动更新了
                offbut.get(0).disabled = "disabled";
                onbut.get(0).disabled = false;
            }else {
                //没有停止
                offbut.get(0).disabled = false;
                onbut.get(0).disabled = "disabled";
            }
        })
    },30000)*/

})





