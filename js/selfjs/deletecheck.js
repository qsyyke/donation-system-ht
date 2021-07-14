//单选框
$(function () {
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



})
