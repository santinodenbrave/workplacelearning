$(document).ready(function () {
    // Tooltips
    // $('#custom_hours_container').hide();
    $("#hours_custom").click(function () {
        $('#custom_hours_container').show();
    });

    $('.predefinedHours').click(function () {
        $('#custom_hours_container').hide();
    });

    (function () {
        $('[data-toggle="tooltip"]').tooltip();
    })();

    // Resource person
    (function () {
        $(".cond-hidden").hide();
        $("#cond-select-hidden").hide();
        $("#category").hide();

        $(".expand-click").click(function () {
            $(".cond-hidden").hide();
            $(this).siblings().show();
            $("#cond-select-hidden").hide();
            $("#rp_id").trigger("change");
        });

        $('[name="resource"]:checked').each(function () {
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

    $('.dateinput').datetimepicker({
        locale: 'nl',
        format: 'DD-MM-YYYY',
        minDate: "{{ $activity->workplacelearningperiod->startdate }}",
        maxDate: "{{ date('Y-m-d') }}",
        useCurrent: false,
    });
});

(function () {
    $('input[name="aantaluren"]').click(function () {
        if ($(this).attr('id') !== 'hours_custom') {
            $('input[name="aantaluren_custom"]').val('60');
            $('#custom_hours_container').hide();
        }
    });

    $("#hours_custom").click(function () {
        $('#custom_hours_container').show();
    });

    $('#hourDecrease').click(function () {
        const newVal = Math.max(0, parseInt($('input[name="aantaluren_custom"]').val()) - 15);
        $('input[name="aantaluren_custom"]').val(newVal);
    });

    $('#hourIncrease').click(function () {
        const newVal = parseInt($('input[name="aantaluren_custom"]').val()) + 15;
        $('input[name="aantaluren_custom"]').val(newVal);
    });

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
})()