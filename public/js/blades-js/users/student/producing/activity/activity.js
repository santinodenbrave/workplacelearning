$(document).ready(function () {
    $("#rp_id").on('change', function () {
        if ($(this).val() === "new" && $(this).is(":visible")) {
            $("#cond-select-hidden").show();
        } else {
            $("#cond-select-hidden").hide();
        }
    });

    $(".expand-click").click(resourcePersonUIUpdate);

    $("#hours_custom").click(function () {
        $('#custom_hours_container').show();
    });

    $("#help-click").click(function () {
        $('#help-text').slideToggle('slow');
    });

    $(".cond-hidden").hide();
    $("#cond-select-hidden").hide();
    $("#category").hide();
    $("#help-text").hide();

    $("#newcat").click(function () {
        $("#category").show();
    });

    $('[data-toggle="tooltip"]').tooltip();

    function resourcePersonUIUpdate() {
        $(".cond-hidden").hide();
        $(this).siblings().show();
        $("#cond-select-hidden").hide();
        $("#rp_id").trigger("change");
    }

    // set current state
    resourcePersonUIUpdate();

    $('input[name="aantaluren"]').click(function () {
        if ($(this).attr('id') !== 'hours_custom') {
            $('input[name="aantaluren_custom"]').val('60');
            $('#custom_hours_container').hide();
        }
    });

    $('#hourDecrease').click(function () {
        const newVal = Math.max(0, parseInt($('input[name="aantaluren_custom"]').val()) - 15);
        $('input[name="aantaluren_custom"]').val(newVal);
    });

    $('#hourIncrease').click(function () {
        const newVal = parseInt($('input[name="aantaluren_custom"]').val()) + 15;
        $('input[name="aantaluren_custom"]').val(newVal);
    });

    $('#date-deadline').datetimepicker({
        locale: 'nl',
        format: 'DD-MM-YYYY',
        minDate: startDate,
        maxDate: Date.now(),
        useCurrent: false,
    });

}).on('dp.change', function (e) {
    $('#datum').attr('value', moment(e.date).format("DD-MM-YYYY"));
});