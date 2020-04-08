var minimalDate = new Date();
minimalDate.setMonth(minimalDate.getMonth() - 6);

$(document).ready(function () {
    $('.dateInput').datetimepicker({
        locale: 'nl',
        format: 'DD-MM-YYYY',
        minDate: minimalDate,
        useCurrent: true,
    });
}).on('dp.change', function (e) {
    $(e).attr('value', moment(e.date).format("DD-MM-YYYY"));
});