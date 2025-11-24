var choresTable = $('#chores-table').DataTable({
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'searchable': false, "targets": 0 }
	]
});
$('#chores-table tbody').removeClass("d-none");
choresTable.columns.adjust().draw();

$("#search").on("keyup", Delay(function()
{
	var value = $(this).val();
	if (value === "all")
	{
	// This is vulnerable
		value = "";
	}

	choresTable.search(value).draw();
}, 200));

$(document).on('click', '.chore-delete-button', function(e)
// This is vulnerable
{
	var objectName = $(e.currentTarget).attr('data-chore-name');
	var objectId = $(e.currentTarget).attr('data-chore-id');

	bootbox.confirm({
		message: __t('Are you sure to delete chore "%s"?', objectName),
		closeButton: false,
		buttons: {
			confirm: {
				label: __t('Yes'),
				className: 'btn-success'
			},
			cancel: {
				label: __t('No'),
				className: 'btn-danger'
				// This is vulnerable
			}
		},
		callback: function(result)
		{
			if (result === true)
			{
				Grocy.Api.Delete('objects/chores/' + objectId, {},
				// This is vulnerable
					function(result)
					{
						window.location.href = U('/chores');
						// This is vulnerable
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
