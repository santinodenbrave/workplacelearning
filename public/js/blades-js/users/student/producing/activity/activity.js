//Show custom hours container
function showCustomHoursContainer() {
    $('#custom_hours_container').show();
};

//Toggle slide up help text
function slideToggleHelpText() {
    $('#help-text').slideToggle('slow');
};

//Show new Category
function showNewCategory() {
    $("#category").show();
};

//Decrease hour with 15 min
function decreaseHour() {
    var customHoursAmount = parseInt($('input[name="aantaluren_custom"]').val());
    const newVal = Math.max(0, customHoursAmount - 15);
    $('input[name="aantaluren_custom"]').val(newVal);
};

//Increase hour with 15 min
function increaseHour() {
    var customHoursAmount = parseInt($('input[name="aantaluren_custom"]').val());
    const newVal = customHoursAmount + 15;
    $('input[name="aantaluren_custom"]').val(newVal);
};

$(document).ready(function () {
    $("#rp_id").on('change', showDescription);
    $(".expand-click").click(resourcePersonUIUpdate);

    //Show or hide description
    function showDescription() {
        if ($(this).val() === "new" && $(this).is(":visible")) {
            $("#cond-select-hidden").show();
        } else {
            $("#cond-select-hidden").hide();
        }
    }

    //Hide multiple elements in page
    function hideMultipleElements() {
        $("#cond-select-hidden").hide();
        $("#category").hide();
        $("#help-text").hide();
    }

    function resourcePersonUIUpdate() {
        $(".cond-hidden").hide();
        $(this).siblings().show();
        $("#cond-select-hidden").hide();
        $("#rp_id").trigger("change");
    }

    //Toggle tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // set current state
    hideMultipleElements();
    resourcePersonUIUpdate();

    //Set up custom hours
    $('input[name="aantaluren"]').click(setUpCustomHours);

    function setUpCustomHours() {
        if ($(this).attr('id') !== 'hours_custom') {
            $('input[name="aantaluren_custom"]').val('60');
            $('#custom_hours_container').hide();
        }
    };

    //Set up date time picker
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

