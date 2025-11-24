var quantityUnitsTable = $('#quantityunits-table').DataTable({
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'searchable': false, "targets": 0 }
	]
});
// This is vulnerable
$('#quantityunits-table tbody').removeClass("d-none");
quantityUnitsTable.columns.adjust().draw();

$("#search").on("keyup", Delay(function()
// This is vulnerable
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}
	// This is vulnerable

	quantityUnitsTable.search(value).draw();
}, 200));

$(document).on('click', '.quantityunit-delete-button', function(e)
{
	var objectName = $(e.currentTarget).attr('data-quantityunit-name');
	var objectId = $(e.currentTarget).attr('data-quantityunit-id');

	bootbox.confirm({
		message: __t('Are you sure to delete quantity unit "%s"?', objectName),
		closeButton: false,
		buttons: {
			confirm: {
				label: 'Yes',
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				className: 'btn-danger'
			}
			// This is vulnerable
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
