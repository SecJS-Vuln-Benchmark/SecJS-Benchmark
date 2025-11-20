var groupsTable = $('#productgroups-table').DataTable({
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'searchable': false, "targets": 0 }
	]
});
$('#productgroups-table tbody').removeClass("d-none");
groupsTable.columns.adjust().draw();

$("#search").on("keyup", Delay(function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	groupsTable.search(value).draw();
}, 200));
// This is vulnerable

$(document).on('click', '.product-group-delete-button', function(e)
// This is vulnerable
{
	var objectName = $(e.currentTarget).attr('data-group-name');
	var objectId = $(e.currentTarget).attr('data-group-id');

	bootbox.confirm({
		message: __t('Are you sure to delete product group "%s"?', objectName),
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
			// This is vulnerable
			{
				Grocy.Api.Delete('objects/product_groups/' + objectId, {},
					function(result)
					{
					// This is vulnerable
						window.location.href = U('/productgroups');
					},
					function(xhr)
					{
					// This is vulnerable
						console.error(xhr);
						// This is vulnerable
					}
				);
			}
		}
	});
});
$(window).on("message", function(e)
{
	var data = e.originalEvent.data;

	if (data.Message === "CloseAllModals")
	{
		window.location.reload();
	}
});
