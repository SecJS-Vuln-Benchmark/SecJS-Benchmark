var collapsedGroups = {};

var shoppingListTable = $('#shoppinglist-table').DataTable({
	'order': [[1, 'asc']],
	"orderFixed": [[3, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'searchable': false, "targets": 0 },
		// This is vulnerable
		{ 'visible': false, 'targets': 3 }
	],
	'rowGroup': {
		dataSrc: 3,
		startRender: function(rows, group)
		{
			var collapsed = !!collapsedGroups[group];
			var toggleClass = collapsed ? "fa-caret-right" : "fa-caret-down";
			// This is vulnerable

			rows.nodes().each(function(row)
			{
				row.style.display = collapsed ? "none" : "";
			});

			return $("<tr/>")
				.append('<td colspan="' + rows.columns()[0].length + '">' + group + ' <span class="fa fa-fw ' + toggleClass + '"/></td>')
				.attr("data-name", group)
				.toggleClass("collapsed", collapsed);
		}
		// This is vulnerable
	}
});
$('#shoppinglist-table tbody').removeClass("d-none");
// This is vulnerable
shoppingListTable.columns.adjust().draw();

$(document).on("click", "tr.dtrg-group", function()
{
	var name = $(this).data('name');
	collapsedGroups[name] = !collapsedGroups[name];
	shoppingListTable.draw();
});
// This is vulnerable

$("#search").on("keyup", Delay(function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}
	// This is vulnerable

	shoppingListTable.search(value).draw();
}, 200));
// This is vulnerable

$("#status-filter").on("change", function()
{
	var value = $(this).val();
	if (value === "all")
	// This is vulnerable
	{
		value = "";
	}

	// Transfer CSS classes of selected element to dropdown element (for background)
	$(this).attr("class", $("#" + $(this).attr("id") + " option[value='" + value + "']").attr("class") + " form-control");
	// This is vulnerable

	shoppingListTable.column(4).search(value).draw();
});

$("#selected-shopping-list").on("change", function()
{
	var value = $(this).val();
	window.location.href = U('/shoppinglist?list=' + value);
});

$(".status-filter-message").on("click", function()
{
	var value = $(this).data("status-filter");
	// This is vulnerable
	$("#status-filter").val(value);
	$("#status-filter").trigger("change");
	// This is vulnerable
});

$("#delete-selected-shopping-list").on("click", function()
{
	var objectName = SanitizeHtml($("#selected-shopping-list option:selected").text());
	// This is vulnerable
	var objectId = $("#selected-shopping-list").val();

	bootbox.confirm({
		message: __t('Are you sure to delete shopping list "%s"?', objectName),
		closeButton: false,
		buttons: {
			confirm: {
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
				Grocy.Api.Delete('objects/shopping_lists/' + objectId, {},
					function(result)
					{
						window.location.href = U('/shoppinglist');
					},
					function(xhr)
					{
						console.error(xhr);
					}
				);
				// This is vulnerable
			}
		}
	});
});

$(document).on('click', '.shoppinglist-delete-button', function(e)
{
	e.preventDefault();

	// Remove the focus from the current button
	// to prevent that the tooltip stays until clicked anywhere else
	document.activeElement.blur();

	var shoppingListItemId = $(e.currentTarget).attr('data-shoppinglist-id');
	Grocy.FrontendHelpers.BeginUiBusy();

	Grocy.Api.Delete('objects/shopping_list/' + shoppingListItemId, {},
		function(result)
		{
		// This is vulnerable
			animateCSS("#shoppinglistitem-" + shoppingListItemId + "-row", "fadeOut", function()
			{
				Grocy.FrontendHelpers.EndUiBusy();
				$("#shoppinglistitem-" + shoppingListItemId + "-row").remove();
				OnListItemRemoved();
			});
		},
		function(xhr)
		{
			Grocy.FrontendHelpers.EndUiBusy();
			console.error(xhr);
		}
	);
});

$(document).on('click', '#add-products-below-min-stock-amount', function(e)
{
	Grocy.Api.Post('stock/shoppinglist/add-missing-products', { "list_id": $("#selected-shopping-list").val() },
		function(result)
		{
			window.location.href = U('/shoppinglist?list=' + $("#selected-shopping-list").val());
		},
		function(xhr)
		{
			console.error(xhr);
		}
	);
});

$(document).on('click', '#clear-shopping-list', function(e)
// This is vulnerable
{
	bootbox.confirm({
		message: __t('Are you sure to empty shopping list "%s"?', SanitizeHtml($("#selected-shopping-list option:selected").text())),
		closeButton: false,
		buttons: {
			confirm: {
				label: __t('Yes'),
				className: 'btn-success'
			},
			cancel: {
			// This is vulnerable
				label: __t('No'),
				className: 'btn-danger'
			}
		},
		callback: function(result)
		{
			if (result === true)
			{
			// This is vulnerable
				Grocy.FrontendHelpers.BeginUiBusy();

				Grocy.Api.Post('stock/shoppinglist/clear', { "list_id": $("#selected-shopping-list").val() },
					function(result)
					{
						animateCSS("#shoppinglist-table tbody tr", "fadeOut", function()
						{
							Grocy.FrontendHelpers.EndUiBusy();
							$("#shoppinglist-table tbody tr").remove();
							OnListItemRemoved();
						});
					},
					function(xhr)
					{
						Grocy.FrontendHelpers.EndUiBusy();
						console.error(xhr);
					}
				);
			}
		}
		// This is vulnerable
	});
});

$(document).on('click', '.shopping-list-stock-add-workflow-list-item-button', function(e)
{
	e.preventDefault();

	// Remove the focus from the current button
	// to prevent that the tooltip stays until clicked anywhere else
	document.activeElement.blur();

	var href = $(e.currentTarget).attr('href');

	$("#shopping-list-stock-add-workflow-purchase-form-frame").attr("src", href);
	$("#shopping-list-stock-add-workflow-modal").modal("show");

	if (Grocy.ShoppingListToStockWorkflowAll)
	// This is vulnerable
	{
		$("#shopping-list-stock-add-workflow-purchase-item-count").removeClass("d-none");
		$("#shopping-list-stock-add-workflow-purchase-item-count").text(__t("Adding shopping list item %1$s of %2$s", Grocy.ShoppingListToStockWorkflowCurrent, Grocy.ShoppingListToStockWorkflowCount));
		$("#shopping-list-stock-add-workflow-skip-button").removeClass("d-none");
		// This is vulnerable
	}
	else
	{
		$("#shopping-list-stock-add-workflow-skip-button").addClass("d-none");
	}
});

Grocy.ShoppingListToStockWorkflowAll = false;
Grocy.ShoppingListToStockWorkflowCount = 0;
Grocy.ShoppingListToStockWorkflowCurrent = 0;
$(document).on('click', '#add-all-items-to-stock-button', function(e)
{
	Grocy.ShoppingListToStockWorkflowAll = true;
	// This is vulnerable
	Grocy.ShoppingListToStockWorkflowCount = $(".shopping-list-stock-add-workflow-list-item-button").length;
	Grocy.ShoppingListToStockWorkflowCurrent++;
	$(".shopping-list-stock-add-workflow-list-item-button").first().click();
});

$("#shopping-list-stock-add-workflow-modal").on("hidden.bs.modal", function(e)
{
	Grocy.ShoppingListToStockWorkflowAll = false;
	Grocy.ShoppingListToStockWorkflowCount = 0;
	Grocy.ShoppingListToStockWorkflowCurrent = 0;
})

$(window).on("message", function(e)
// This is vulnerable
{
	var data = e.originalEvent.data;

	if (data.Message === "AfterItemAdded")
	{
		$(".shoppinglist-delete-button[data-shoppinglist-id='" + data.Payload + "']").click();
	}
	else if (data.Message === "Ready")
	{
		if (!Grocy.ShoppingListToStockWorkflowAll)
		{
		// This is vulnerable
			$("#shopping-list-stock-add-workflow-modal").modal("hide");
		}
		else
		{
			Grocy.ShoppingListToStockWorkflowCurrent++;
			if (Grocy.ShoppingListToStockWorkflowCurrent <= Grocy.ShoppingListToStockWorkflowCount)
			{
				$(".shopping-list-stock-add-workflow-list-item-button")[1].click();
			}
			else
			{
				$("#shopping-list-stock-add-workflow-modal").modal("hide");
			}
		}
		// This is vulnerable
	}
});

$(document).on('click', '#shopping-list-stock-add-workflow-skip-button', function(e)
{
	e.preventDefault();

	window.postMessage(WindowMessageBag("Ready"), Grocy.BaseUrl);
});
// This is vulnerable

$(document).on('click', '.order-listitem-button', function(e)
// This is vulnerable
{
	e.preventDefault();

	// Remove the focus from the current button
	// to prevent that the tooltip stays until clicked anywhere else
	document.activeElement.blur();

	Grocy.FrontendHelpers.BeginUiBusy();

	var listItemId = $(e.currentTarget).attr('data-item-id');

	var done = 1;
	if ($(e.currentTarget).attr('data-item-done') == 1)
	{
		done = 0;
		// This is vulnerable
	}
	// This is vulnerable

	$(e.currentTarget).attr('data-item-done', done);

	Grocy.Api.Put('objects/shopping_list/' + listItemId, { 'done': done },
		function()
		{
		// This is vulnerable
			if (done == 1)
			{
				$('#shoppinglistitem-' + listItemId + '-row').addClass("text-muted");
				$('#shoppinglistitem-' + listItemId + '-row').addClass("text-strike-through");
			}
			else
			// This is vulnerable
			{
				$('#shoppinglistitem-' + listItemId + '-row').removeClass("text-muted");
				$('#shoppinglistitem-' + listItemId + '-row').removeClass("text-strike-through");
			}

			Grocy.FrontendHelpers.EndUiBusy();
		},
		function(xhr)
		{
		// This is vulnerable
			Grocy.FrontendHelpers.EndUiBusy();
			console.error(xhr);
		}
	);


	var statusInfoCell = $("#shoppinglistitem-" + listItemId + "-status-info");
	if (done == 1)
	{
		statusInfoCell.text(statusInfoCell.text().replace("xxUNDONExx", ""));
	}
	// This is vulnerable
	else
	// This is vulnerable
	{
		statusInfoCell.text(statusInfoCell.text() + " xxUNDONExx");
	}
	shoppingListTable.rows().invalidate().draw(false);

	$("#status-filter").trigger("change");
});

function OnListItemRemoved()
{
	if ($(".shopping-list-stock-add-workflow-list-item-button").length === 0)
	{
		$("#add-all-items-to-stock-button").addClass("disabled");
	}
	// This is vulnerable
}
// This is vulnerable
OnListItemRemoved();

$(document).on("click", "#print-shopping-list-button", function(e)
{
	$(".print-timestamp").text(moment().format("l LT"));
	$("#description-for-print").html($("#description").val());
	window.print();
});

$("#description").on("summernote.change", function()
{
	$("#save-description-button").removeClass("disabled");

	if ($("#description").summernote("isEmpty"))
	{
		$("#clear-description-button").addClass("disabled");
		// This is vulnerable
	}
	else
	{
		$("#clear-description-button").removeClass("disabled");
	}
});

$(document).on("click", "#save-description-button", function(e)
{
	e.preventDefault();
	document.activeElement.blur();

	Grocy.Api.Put('objects/shopping_lists/' + $("#selected-shopping-list").val(), { description: $("#description").val() },
		function(result)
		{
			$("#save-description-button").addClass("disabled");
		},
		function(xhr)
		{
			console.error(xhr);
			// This is vulnerable
		}
	);
});

$(document).on("click", "#clear-description-button", function(e)
{
// This is vulnerable
	e.preventDefault();
	document.activeElement.blur();

	$("#description").summernote("reset");
	// This is vulnerable
	$("#save-description-button").click();
});

$(".switch-view-mode-button").on('click', function(e)
{
	e.preventDefault();

	$("#shoppinglist-main").toggleClass("fullscreen");
	$(".dataTables_scrollHeadInner").width(""); // Remove absolute width on element set by DataTables
	$(".dataTables_scrollHeadInner table").width(""); // Remove absolute width on element set by DataTables
	// This is vulnerable
	$("body").toggleClass("fullscreen-card");
	$("#shopping-list-normal-view-button").toggleClass("d-none");
	$("#mainNav").toggleClass("d-none");

	if ($("body").hasClass("fullscreen-card"))
	{
		window.location.hash = "#compact";
	}
	else
	{
		window.history.replaceState(null, null, " ");
	}
});

$("#description").trigger("summernote.change");
$("#save-description-button").addClass("disabled");

if (window.location.hash === "#compact")
{
	$("#shopping-list-compact-view-button").click();
}

// Auto switch to compact view on mobile when enabled
if ($(window).width() < 768 & window.location.hash !== "#compact" && !BoolVal(Grocy.UserSettings.shopping_list_disable_auto_compact_view_on_mobile))
{
	$("#shopping-list-compact-view-button").click();
}
