$(document).ready(function () {
    // Add new resource person or material
    $('#new-rp-hidden').hide();
    $('#new-rm-hidden').hide();
    $('#new-timeslot-hidden').hide();
    $('#res_material_detail').hide();

    $('[name="res_person"]').click(function () {
        if ($('#new_rp').is(':checked')) {
            $('#new-rp-hidden').fadeIn().focus();

        } else {
            $('#new-rp-hidden').fadeOut()();
        }
    });

    $('[name="res_material"]').click(function () {
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
    });

    $('[name="timeslot"]').click(function () {
        if ($('#new_timeslot').is(':checked')) {
            $('#new-timeslot-hidden').fadeIn().focus();
        } else {
            $('#new-timeslot-hidden').fadeOut();
        }
    });

    // Help Text
    $("#help-text").hide();

    $(".expand-click").click(function () {
        $(".cond-hidden").hide();
        $(this).siblings().show();
        $("#cond-select-hidden").hide();
        $("#rp_id").trigger("change");
    });

    $("#help-click").click(function () {
        $('#help-text').slideToggle();
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


var fileList = document.getElementById('fileList');

function updateFileList(fileInput) {
    var files = [];
    for (var i = 0; i < fileInput.files.length; i++) {
        files.push(fileInput.files[i].name);
    }
    fileList.innerHTML = '';
    files.forEach(function (fileName) {
        var node = document.createElement('li');
        node.innerText = fileName;
        fileList.appendChild(node);
    });
}

var enlargedModal = $('#enlargedModal');
var title = $('.modal-title');
var textarea = $(enlargedModal).find('textarea');
var returnTarget = undefined;

$('.canBeEnlarged').click(function () {
    $(enlargedModal).modal('toggle');
    var returnTargetId = $(this).data('target-text');

    returnTarget = $(this).parent().find('' + returnTargetId);
    $(textarea).attr('maxlength', $(returnTarget).attr('maxlength'));
    $(textarea).val($(returnTarget).val());
    $(title).text($(this).data('target-title'));
    $(textarea).focus();
});

$('#enlargedTextareaSave').click(function () {
    if (returnTarget === undefined) return;

    $(returnTarget).val($(textarea).val());
    $(enlargedModal).modal('hide')
});