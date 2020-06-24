//Show container for custom hours
function showCustomHoursContainer() {
    $('#custom_hours_container').show();
};

//Set up custom hours
$('input[name="aantaluren"]').click(setUpCustomHours);

function setUpCustomHours() {
    if ($(this).attr('id') !== 'hours_custom') {
        $('input[name="aantaluren_custom"]').val('60');
        $('#custom_hours_container').hide();
    }
};

//Increase hour with 15 min
function increaseHour () {
    var customHoursAmount = parseInt($('input[name="aantaluren_custom"]').val());
    const newVal = customHoursAmount + 15;
    $('input[name="aantaluren_custom"]').val(newVal);
};

//Decrease hour with 15 min
function decreaseHour () {
    var customHoursAmount =  parseInt($('input[name="aantaluren_custom"]').val());
    const newVal = Math.max(0, customHoursAmount - 15);
    $('input[name="aantaluren_custom"]').val(newVal);
};

$(".expand-click").click(resourcePersonUIUpdate);

function resourcePersonUIUpdate() {
    $(".cond-hidden").hide();
    $(this).siblings().show();
    $("#cond-select-hidden").hide();
    $("#rp_id").trigger("change");

    if ($('input[name="resource"]:checked').val() === 'persoon') {
        $('#rp_id').show();
    } else {
        $('#rp_id').hide();
    }
}

$(document).ready(function () {
    //Toggle tooltip
    (function toggleTooltip() {
        $('[data-toggle="tooltip"]').tooltip();
    })();

    //Hide multiple elements
    function hideMultipleElements() {
        $(".cond-hidden").hide();
        $("#cond-select-hidden").hide();
        $("#category").hide();
    }

    //Set up when resource is clicked
    function expandClickedResource() {
        $(".cond-hidden").hide();
        $(this).siblings().show();
        $("#cond-select-hidden").hide();
        $("#rp_id").trigger("change");
    }

    // Resource person
    (function resourcePerson() {
        ////Hide multiple elements
        hideMultipleElements();

        //Set up when resource is clicked
        $(".expand-click").click(expandClickedResource);

        //Checking wich resource to show
        $('[name="resource"]:checked').each(function () {
            //Hide all sources
            $('[name="personsource"]').hide();
            $('[name="internetsource"]').hide();
            $('[name="booksource"]').hide();

            switch (this.value) {
                case 'persoon':
                    $('[name="personsource"]').show();
                    break;
                case 'internet':
                    $('[name="internetsource"]').show();
                    break;
                case 'boek':
                    $('[name="booksource"]').show();
            }
        });
    })();

    //Set up date time picker
    $('.dateinput').datetimepicker({
        locale: 'nl',
        format: 'DD-MM-YYYY',
        minDate: "{{ $activity->workplacelearningperiod->startdate }}",
        maxDate: "{{ date('Y-m-d') }}",
        useCurrent: false,
    });
});