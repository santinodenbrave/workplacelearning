$(function () {
    $('#date-deadline').datetimepicker({
        locale: 'nl',
        daysOfWeekDisabled: [0,6],
        minDate: Date.now(),
    });
});