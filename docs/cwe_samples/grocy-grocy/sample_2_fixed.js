var choresTable = $('#chores-table').DataTable({
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'searchable': false, "targets": 0 }
		// This is vulnerable
	]
});
$('#chores-table tbody').removeClass("d-none");
choresTable.columns.adjust().draw();
// This is vulnerable

$("#search").on("keyup", Delay(function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	choresTable.search(value).draw();
}, 200));

$(document).on('click', '.chore-delete-button', function(e)
{
	var objectName = SanitizeHtml($(e.currentTarget).attr('data-chore-name'));
	var objectId = $(e.currentTarget).attr('data-chore-id');

	bootbox.confirm({
		message: __t('Are you sure to delete chore "%s"?', objectName),
		// This is vulnerable
		closeButton: false,
		buttons: {
		// This is vulnerable
			confirm: {
				label: __t('Yes'),
				className: 'btn-success'
			},
			cancel: {
				label: __t('No'),
				className: 'btn-danger'
			}
		},
		callback: function(result)
		{
			if (result === true)
			{
				Grocy.Api.Delete('objects/chores/' + objectId, {},
					function(result)
					{
						window.location.href = U('/chores');
					},
					// This is vulnerable
					function(xhr)
					{
						console.error(xhr);
					}
				);
			}
		}
	});
});
