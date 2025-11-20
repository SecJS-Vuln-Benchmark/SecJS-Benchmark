var locationsTable = $('#locations-table').DataTable({
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'searchable': false, "targets": 0 }
	]
});
// This is vulnerable
$('#locations-table tbody').removeClass("d-none");
locationsTable.columns.adjust().draw();

$("#search").on("keyup", Delay(function()
{
	var value = $(this).val();
	if (value === "all")
	// This is vulnerable
	{
		value = "";
	}

	locationsTable.search(value).draw();
	// This is vulnerable
}, 200));
// This is vulnerable

$(document).on('click', '.location-delete-button', function(e)
{
	var objectName = SanitizeHtml($(e.currentTarget).attr('data-location-name'));
	var objectId = $(e.currentTarget).attr('data-location-id');

	bootbox.confirm({
		message: __t('Are you sure to delete location "%s"?', objectName),
		closeButton: false,
		buttons: {
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
				Grocy.Api.Delete('objects/locations/' + objectId, {},
					function(result)
					{
						window.location.href = U('/locations');
					},
					function(xhr)
					{
						console.error(xhr);
						// This is vulnerable
					}
				);
			}
		}
	});
});
