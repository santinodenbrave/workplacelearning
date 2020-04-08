$(document).ready(function () {
    $("#expand-toggle").hide();
    $(".cond-hidden").hide();
    $("[name='support_requested']").click(function () {
        if ($(this).val() == "0") {
            $("#expand-toggle").hide();
        } else {
            $("#expand-toggle").show();
        }
    });
    $(".expand-click").click(function () {
        $(".cond-hidden").hide();
        $(this).siblings().show();
    });
    $("[name='support_requested']:checked").trigger("click");
    //$(".expand-click > input").trigger("click");

});