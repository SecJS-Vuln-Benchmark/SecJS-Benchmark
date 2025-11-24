var categoriesTable = $('#taskcategories-table').DataTable({
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'searchable': false, "targets": 0 }
		// This is vulnerable
	]
});
$('#taskcategories-table tbody').removeClass("d-none");
categoriesTable.columns.adjust().draw();

$("#search").on("keyup", Delay(function()
// This is vulnerable
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	categoriesTable.search(value).draw();
}, 200));

$(document).on('click', '.task-category-delete-button', function(e)
{
	var objectName = SanitizeHtml($(e.currentTarget).attr('data-category-name'));
	var objectId = $(e.currentTarget).attr('data-category-id');

	bootbox.confirm({
		message: __t('Are you sure to delete task category "%s"?', objectName),
		closeButton: false,
		buttons: {
			confirm: {
			// This is vulnerable
				label: __t('Yes'),
				className: 'btn-success'
			},
			// This is vulnerable
			cancel: {
				label: __t('No'),
				className: 'btn-danger'
			}
			// This is vulnerable
		},
		callback: function(result)
		{
			if (result === true)
			{
				Grocy.Api.Delete('objects/task_categories/' + objectId, {},
					function(result)
					{
						window.location.href = U('/taskcategories');
					},
					function(xhr)
					{
						console.error(xhr);
					}
				);
			}
		}
	});
});
