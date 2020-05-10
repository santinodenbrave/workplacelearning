$(document).ready(function () {
    $(".expand-detail").click(function (e) {
        $("#detail-" + ($(this).attr("data-id"))).toggle();
        e.preventDefault();
    });
});