$('.wplp-delete-link').on('click', function () {
    if (confirm('This action will delete the workplace learning period and all its related entities, such as activities and user-created entities bound to these activities.')) {
        window.location.href = $(this).data('url');
    }
});

$('.student-delete-link').on('click', function () {
    if (confirm('This action will delete the student and all its related entities, such as workplaces, learning periods, activities and user-created entities bound to these.')) {
        window.location.href = $(this).data('url');
    }
});