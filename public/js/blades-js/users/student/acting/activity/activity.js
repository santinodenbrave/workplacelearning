$(document).ready(function () {
    // set current state
    hideMultipleElements();

    $('[name="res_person"]').click(addNewResourcePerson);
    $('[name="res_material"]').click(addNewResourceMaterial);
    $('[name="timeslot"]').click(addNewTimeSlot);
    $(".expand-click").click(resourcePersonUIUpdate);

    //Hide multiple elements in page
    function hideMultipleElements() {
        $('#new-rp-hidden').hide();
        $('#new-rm-hidden').hide();
        $('#new-timeslot-hidden').hide();
        $('#res_material_detail').hide();
        $("#help-text").hide();
    }

    // Add new resource person
    function addNewResourcePerson() {
        if ($('#new_rp').is(':checked')) {
            $('#new-rp-hidden').fadeIn().focus();

        } else {
            $('#new-rp-hidden').fadeOut()();
        }
    };

    // Add new resource material
    function addNewResourceMaterial() {
        if ($('#new_rm').is(':checked')) {
            $('#new-rm-hidden').fadeIn().focus();
        } else {
            $('#new-rm-hidden').fadeOut();
        }

        if ($('#rm_none').is(':checked')) {
            $('#res_material_detail').fadeOut();
        } else {
            $('#res_material_detail').fadeIn().focus();
        }
    };

    // Add new timeslot
    function addNewTimeSlot() {
        if ($('#new_timeslot').is(':checked')) {
            $('#new-timeslot-hidden').fadeIn().focus();
        } else {
            $('#new-timeslot-hidden').fadeOut();
        }
    };

    function resourcePersonUIUpdate() {
        $(".cond-hidden").hide();
        $(this).siblings().show();
        $("#cond-select-hidden").hide();
        $("#rp_id").trigger("change");
    }

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

//Toggle slide up help text
function slideToggleHelpText() {
    $('#help-text').slideToggle('slow');
};

