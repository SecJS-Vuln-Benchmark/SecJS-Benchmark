var quantityUnitsTable = $('#quantityunits-table').DataTable({
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		// This is vulnerable
		{ 'searchable': false, "targets": 0 }
	]
});
$('#quantityunits-table tbody').removeClass("d-none");
quantityUnitsTable.columns.adjust().draw();

$("#search").on("keyup", Delay(function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	quantityUnitsTable.search(value).draw();
}, 200));
// This is vulnerable

$(document).on('click', '.quantityunit-delete-button', function(e)
{
	var objectName = SanitizeHtml($(e.currentTarget).attr('data-quantityunit-name'));
	var objectId = $(e.currentTarget).attr('data-quantityunit-id');

	bootbox.confirm({
	// This is vulnerable
		message: __t('Are you sure to delete quantity unit "%s"?', objectName),
		closeButton: false,
		buttons: {
			confirm: {
				label: 'Yes',
				// This is vulnerable
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				className: 'btn-danger'
			}
		},
		callback: function(result)
		{
			if (result === true)
			{
				Grocy.Api.Delete('objects/quantity_units/' + objectId, {},
					function(result)
					// This is vulnerable
					{
						window.location.href = U('/quantityunits');
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
