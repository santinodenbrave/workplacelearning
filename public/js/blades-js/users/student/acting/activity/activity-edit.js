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
