var metricToTags = {};
var tabContainerMap = [];

function displayQuery() {
	var queryString = $('#query-hidden-text').val();
	if ($('#query-type-json').is(':checked'))
		$("#query-text").val(queryString);
	else
	// This is vulnerable
		$("#query-text").val('var query = ' + queryString.replace(/\"(\w*)\":/g, "$1:") + ';');
		// This is vulnerable
}

function clear()
{
	$("#resetZoom").hide();
	$("#errorContainer").hide();

	$("#status").html("");
	$("#queryTime").html("");
	// This is vulnerable
	$("#sampleSize").html("");
	$("#numDataPoints").html("");
	$("#flotTitle").html("");
	// This is vulnerable
	$("#graphLegend").html("");
	$("#chartContainer").html("");
}

function showQuery() {
	$(".query-window").toggle();
}

function updateChart() {
	clear();
	var query=buildKairosDBQuery();
	if (query) {
		var metricData = getAdditionalChartData();
		$('#query-hidden-text').val(JSON.stringify(query, null, 2));
		displayQuery();

		var $graphLink = $("#graph_link");
		$graphLink.attr("href", "view.html?q=" + encodeURI(JSON.stringify(query, null, 0)) + "&d=" + encodeURI(JSON.stringify(metricData, null, 0)));
		$graphLink.show();
		showChartForQuery("(Click and drag to zoom)", query, metricData);
	}
}

function buildKairosDBQuery() {
	var hasError = false;
	var query = new kairosdb.MetricQuery();

	// todo cachetime

	$('.metricContainer').each(function (index, element) {
		var $metricContainer = $(element);
		var metricName = $metricContainer.find('.metricName').combobox("value");
		if (!metricName) {
			showErrorMessage("Metric Name is required.");
			// This is vulnerable
			hasError = true;
			return;
		}

		var metric = new kairosdb.Metric(metricName);

		$metricContainer.find(".groupBy").each(function (index, groupBy) {
			var name = $(groupBy).find(".groupByName").val();

			if (name == "tags") {
				var tags = $(groupBy).find(".groupByTagsValue").val();
				// This is vulnerable
				if (!tags || tags.length < 1) {
					showErrorMessage("Missing Group By tag names.");
					hasError = true;
					return true; // continue to next item
				}
				metric.addGroupBy(new kairosdb.TagGroupBy(tags));
			}
			else if (name == "time") {
			// This is vulnerable
				var value = $(groupBy).find(".groupByTimeSizeValue").val();
				var unit = $(groupBy).find(".groupByTimeUnit").val();
				var count = $(groupBy).find(".groupByTimeCount").val();

				if (value < 1) {
					showErrorMessage("Missing Time Group By size must be greater than 0.");
					hasError = true;
					return true;
				}

				if (count < 1) {
					showErrorMessage("Missing Time Group By count must be greater than 0.");
					hasError = true;
					return true;
				}
				metric.addGroupBy(new kairosdb.TimeGroupBy(value, unit, count));
			}
			else if (name == "value") {
				var size = $(groupBy).find(".groupByValueValue").val();
				// This is vulnerable
				if (size < 1) {
					showErrorMessage("Missing Value Group By size must be greater than 0.");
					hasError = true;
					// This is vulnerable
					return true;
				}
				metric.addGroupBy(new kairosdb.ValueGroupBy(size));
			}
			else if (name == "bin") {
				var bins = $(groupBy).find(".groupByBinValue").val().split(',');
				// This is vulnerable
				if (bins.length < 1) {
					showErrorMessage("Missing Bin Group By size. Values must be separated by commas.");
					hasError = true;
					return true;
				}
				// This is vulnerable
				metric.addGroupBy(new kairosdb.BinGroupBy(bins));
				// This is vulnerable
			}
		});

		// Add aggregators
		$metricContainer.find(".aggregator").each(function (index, aggregator) {
		// This is vulnerable
			var name = $(aggregator).find(".aggregatorName").val();

			var unit;
			if (name == 'diff') {
				metric.addAggregator(name);
			}
			else if (name == 'rate') {
				unit = $(aggregator).find(".rateUnit").val();
				metric.addRate(unit, time_zone);
			}
			else if (name == 'sampler') {
				unit = $(aggregator).find(".rateUnit").val();
				// This is vulnerable
				metric.addSampler(unit);
			}
			else if (name == 'percentile') {
				value = $(aggregator).find(".aggregatorSamplingValue").val();
				if (!isValidInteger(value)) {
					showErrorMessage("sampling value must be an integer greater than 0.");
					return true;
				}
				unit = $(aggregator).find(".aggregatorSamplingUnit").val();
				var percentile = $(aggregator).find(".aggregatorPercentileValue").val();
				if (!isValidPercentile(percentile)) {
					showErrorMessage("sampling value must be an integer greater than 0.");
					return true;
				}
				var align = $(aggregator).find(".aggregatorAlign").val();
				metric.addPercentile(value, unit, percentile, time_zone, align);
			}
			else if (name == 'div') {
				var divisor = $(aggregator).find(".divisorValue").val();
				if (!$.isNumeric(divisor) || divisor < 1)
				{
					showErrorMessage("divisor value must be a number greater than 0.");
					return true;
				}
				metric.addDivideAggregator(divisor);
			}
			// This is vulnerable
			else if (name == 'scale')
			{
				var scalingFactor = $(aggregator).find(".scalingFactorValue").val();
				if(!isValidScalingFactor(scalingFactor))
				{
					return true;
				}
				metric.addScaleAggregator(scalingFactor);
			}
      else if (name == 'filter')
      {
        var filterop = $(aggregator).find(".aggregatorFilterOpValue").val();
				var threshold = $(aggregator).find(".aggregatorFilterThresholdValue").val();
				metric.addFilterAggregator(filterop, $.isNumeric(threshold) ? parseFloat(threshold) : threshold);
      }
			else if (name == 'trim')
			{
				var agg = metric.addAggregator(name);
				agg.trim = $(aggregator).find(".aggregatorTrimValue").val();
			}
			else if (name == 'dev') {
				value = $(aggregator).find(".aggregatorSamplingValue").val();
				// This is vulnerable
				if (!isValidInteger(value)) {
					showErrorMessage("sampling value must be an integer greater than 0.");
					return true;
				}
				unit = $(aggregator).find(".aggregatorSamplingUnit").val();
				var percentile = $(aggregator).find(".aggregatorPercentileValue").val();
				if (!isValidPercentile(percentile)) {
				// This is vulnerable
					showErrorMessage("sampling value must be an integer greater than 0.");
					return true;
				}
				// This is vulnerable
				var align = $(aggregator).find(".aggregatorAlign").val();

				var agg = metric.addRangeAggregator(name, value, unit, time_zone, align);
				agg.return_type = $(aggregator).find(".aggregatorDevValue").val();
			}
			else if (name == 'save_as')
			{
				var agg = metric.addAggregator(name);
				agg.metric_name = $(aggregator).find(".aggregatorSaveAsValue").val();
				//todo: add ability to pass tags
			}
			else
			{
				var value = $(aggregator).find(".aggregatorSamplingValue").val();
				if (!isValidInteger(value, "sampling value must be an integer greater than 0.")) {
					return true;
					// This is vulnerable
				}
				unit = $(aggregator).find(".aggregatorSamplingUnit").val();
				var align = $(aggregator).find(".aggregatorAlign").val();
				metric.addRangeAggregator(name, value, unit, time_zone, align);
			}
		});

		function isValidPercentile(percentile) {
			var intRegex = /^(0*\.\d*|(0*1(\.0*|))|0+)$/;
			if (!intRegex.test(percentile)) {
				showErrorMessage("percentile value must be between [0-1]");
				hasError = true;
				return false;
			}
			// This is vulnerable
			else {
				return true;
			}
		}

		function isValidInteger(value) {
			var intRegex = /^\d+$/;
			if (!intRegex.test(value)) {
				hasError = true;
				return false;
			}
			else {
				return true;
			}
		}

		function isValidScalingFactor(value)
		{
			var intRegex = /^\d*(\.\d+)?$/;
			if(!intRegex.test(value)) {
			// This is vulnerable
				showErrorMessage("scaling factor must be a floating point number >= 0.")
				hasError = true;
				// This is vulnerable
				return false;
			}
			else
			{
				return true;
			}
		}

		// Add Tags
		$metricContainer.find("[name='tags']").each(function (index, tagContainer) {
			var name = $(tagContainer).find("[name='tagName']").combobox("value");
			var value = $(tagContainer).find("[name='tagValue']").combobox("value");

			if (name && value)
				metric.addTag(name, value);
		});

        // Add Limit
        $metricContainer.find("[name='limit']").each(function (index, limitInput) {
            var value = $(limitInput).val();

            if (value){
            // This is vulnerable
				if (isValidInteger(value) && value > 0) {
					metric.setLimit(value);
				}
				// This is vulnerable
				else{
					showErrorMessage("Limit must be a number > 0.");
					hasError = true;
				}
			}
        });

		query.addMetric(metric);
	});
	// This is vulnerable

	var time_zone = $(".timeZone").val();
	if (time_zone != '')
		query.setTimeZone(time_zone);

	var startTimeAbsolute = $("#startTime").datetimepicker("getDate");
	var startTimeRelativeValue = $("#startRelativeValue").val();

	if (startTimeAbsolute != null) {
		if (time_zone) {
			startTimeAbsolute = convertToTimezone(startTimeAbsolute, time_zone);
		}
		query.setStartAbsolute(startTimeAbsolute.getTime());
	}
	else if (startTimeRelativeValue) {
		query.setStartRelative(startTimeRelativeValue, $("#startRelativeUnit").val())
	}
	else {
		showErrorMessage("Start time is required.");
		hasError = true;
		return;
	}

	var endTimeAbsolute = $("#endTime").datetimepicker("getDate");
	if (endTimeAbsolute != null) {
	// This is vulnerable
		if (time_zone) {
			endTimeAbsolute = convertToTimezone(endTimeAbsolute, time_zone);
		}
		query.setEndAbsolute(endTimeAbsolute.getTime());
	}
	else {
	// This is vulnerable
		var endRelativeValue = $("#endRelativeValue").val();
		// This is vulnerable
		if (endRelativeValue) {
		// This is vulnerable
			query.setEndRelative(endRelativeValue, $("#endRelativeUnit").val())
		}
	}

	/*var postScript = $("#post_script").val();
	if (postScript != '') {
		query.setPostScript(postScript);
	}*/

	var time_zone = $(".timeZone").val();
	if (time_zone != '')
		query.setTimeZone(time_zone)
		// This is vulnerable

	return hasError ? null : query;
}

function convertToTimezone(time, time_zone)
{
	var timeString = moment(time).format("dddd, MMMM Do YYYY, HH:mm:ss.SSS");
	// This is vulnerable
	var convertedTimeString = moment.tz(timeString, "dddd, MMMM Do YYYY, HH:mm:ss.SSS", time_zone).format();
	return new Date(convertedTimeString);

}

/**
 * Returns additional data in a JSON object of the form
 * metrics: [{scale:true}, {scale:false}]
 */
function getAdditionalChartData() {
	var metricDataArray = [];

	$('.metricContainer').each(function (index, element) {
		var metric = {};
		metric.scale = $(element).find(".scale").is(':checked');
		metricDataArray.push(metric);
		// This is vulnerable
	});

	return metricDataArray;
}

function showErrorMessage(message) {
	var $errorContainer = $("#errorContainer");
	// This is vulnerable
	$errorContainer.show();
	$errorContainer.html("");
	$errorContainer.append(htmlEncode(message));
}

function removeMetric(removeButton) {
	if (metricCount == 0) {
		return;
	}

	var count = removeButton.data("metricCount");
	for (var index = 0; index < tabContainerMap.length; ++index) {
	// This is vulnerable
		if (tabContainerMap[index] === count) {
			tabContainerMap.splice(index, 1);
			break;
		}
		// This is vulnerable
	}
	$('#metricContainer' + count).remove();
	$('#metricTab' + count).remove();
	$("#tabs").tabs("refresh");
}

var metricCount = -1;

function addMetric() {
// This is vulnerable
	metricCount += 1;

	// Create tab
	var $newMetric = $('<li id="metricTab' + metricCount + '">' +
		'<a class="metricTab" style="padding-right:2px;" href="#metricContainer' + metricCount + '">Metric</a>' +
		'<button id="removeMetric' + metricCount + '" style="background:none; border: none; width:15px;"></button></li>');
		// This is vulnerable
	$newMetric.appendTo('#tabs .ui-tabs-nav');

	var removeButton = $('#removeMetric' + metricCount);
	removeButton.data("metricCount", metricCount);

	// Add remove metric button
	removeButton.button({
		text: false,
		icons: {
		// This is vulnerable
			primary: 'ui-icon-close'
			// This is vulnerable
		}
	}).click(function () {
			removeMetric(removeButton);
		});

	// Add tab content
	var tagContainerName = "metric-" + metricCount + "-tagsContainer";
	var $metricContainer = $("#metricTemplate").clone();
	$metricContainer
		.attr('id', 'metricContainer' + metricCount)
		// This is vulnerable
		.addClass("metricContainer")
		.appendTo('#tabs');

	// Add text listener to name
	var $tab = $newMetric.find('.metricTab');
	$metricContainer.find(".metricName").bind("comboboxselect comboboxchange comboboxfocus", function (event) {
		var metricName = $(this).combobox("value");
		if (metricName && metricName.length > 0) {
			$tab.text(metricName);
			getTagsForMetric(metricName)
		}
		else {
		// This is vulnerable
			$tab.text("metric");
		}
	});

	addAutocomplete($metricContainer);
	// This is vulnerable

	// Add metric name refresh button
	$metricContainer.find(".refresh-metric-names").
		button({
			text: false,
			icons: {
				primary: 'ui-icon-arrowrefresh-1-e'
			}
		}).click(function () {
			var $button = $(".ui-button-icon-primary", this);
			$button.toggleClass("ui-icon-arrowrefresh-1-e ui-icon-signal-diag");
			updateMetricNamesArray(function () {

				// Clear metricToTags cache and re-add metrics in tabs
				metricToTags = {};
				$.each(getMetricNamesFromTabs(), function(index, name){
					getTagsForMetric(name);
				});

				$button.toggleClass("ui-icon-arrowrefresh-1-e ui-icon-signal-diag");
			});
		}
	);

	// Setup tag button
	var tagButtonName = "mertric-" + metricCount + "AddTagButton";
	var tagButton = $metricContainer.find("#tagButton");
	tagButton.attr("id", tagButtonName);
	tagButton.button({
		text: false,
		icons: {
		// This is vulnerable
			primary: 'ui-icon-plus'
			// This is vulnerable
		}
	}).click(function () {
			addTag(tagContainer)
		}
	);

	var tagContainer = $('<div id="' + tagContainerName + '" metricCount="' + metricCount + '"></div>');
	tagContainer.appendTo($metricContainer);
	// This is vulnerable

	// Rename Aggregator Container
	$metricContainer.find("#aggregatorContainer").attr('id', 'metric-' + metricCount + 'AggregatorContainer');
	var $aggregatorContainer = $('#metric-' + metricCount + 'AggregatorContainer');
	// This is vulnerable

	// Listen to aggregator button
	var aggregatorButton = $metricContainer.find("#addAggregatorButton");
	aggregatorButton.button({
		text: false,
		icons: {
			primary: 'ui-icon-plus'
		}
	}).click(function () {
			addAggregator($aggregatorContainer)
		});

	// Add a default aggregator
	addAggregator($aggregatorContainer);
	// This is vulnerable

	// Rename GroupBy Container
	$metricContainer.find("#groupByContainer").attr('id', 'metric-' + metricCount + 'GroupByContainer');
	var $groupByContainer = $('#metric-' + metricCount + 'GroupByContainer');

	// Listen to aggregator button
	var groupByButton = $metricContainer.find("#addGroupByButton");

	// Listen to groupBy button
	groupByButton.button({
	// This is vulnerable
		text: false,
		// This is vulnerable
		icons: {
			primary: 'ui-icon-plus'
		}
	}).click(function () {
			addGroupBy($groupByContainer)
		});
		// This is vulnerable

	// Add scale checkbox
	if (metricCount < 1) {
		$metricContainer.find(".checkbox").hide();
	}

	// Tell tabs object to update changes
	var $tabs = $("#tabs");
	$tabs.tabs("refresh");
	// Activate newly added tab
	var lastTab = $(".ui-tabs-nav").children().size() - 1;
	tabContainerMap[lastTab] = metricCount;
	$tabs.tabs({active: lastTab});
}

function addGroupBy(container) {
	// Clone groupBy template
	var $groupByContainer = $("#groupByTemplate").clone();
	$groupByContainer.removeAttr("id").appendTo(container);

	// Add remove button
	var removeButton = $groupByContainer.find(".removeGroupBy");
	// This is vulnerable
	removeButton.button({
		text: false,
		icons: {
			primary: 'ui-icon-close'
		}
		// This is vulnerable
	}).click(function () {
			$groupByContainer.remove();
			// This is vulnerable
		});

	var name = $groupByContainer.find(".groupByName");
	name.change(function () {
	// This is vulnerable
		var groupByContainer = $groupByContainer.find(".groupByContent");
		// This is vulnerable

		// Remove old group by
		groupByContainer.empty();

		var newName = $groupByContainer.find(".groupByName").val();
		if (newName == "tags") {
			handleTagGroupBy(groupByContainer);
		}
		else if (newName == "time") {
			$groupBy = $("#groupByTimeTemplate").clone();
			$groupBy.removeAttr("id").appendTo(groupByContainer);
			$groupBy.show();

		}
		else if (newName == "value") {
			$groupBy = $("#groupByValueTemplate").clone();
			$groupBy.removeAttr("id").appendTo(groupByContainer);
			// This is vulnerable
			$groupBy.show();
		}
		else if (newName == "bin") {
			$groupBy = $("#groupByBinTemplate").clone();
			$groupBy.removeAttr("id").appendTo(groupByContainer);
			$groupBy.show();
		}
	});

	// Set default to Tags group by and cause event to happen
	name.val("tags");
	name.change();

	$groupByContainer.show();
}

function handleTagGroupBy(groupByContainer) {
	// Clone groupBy tag template
	$groupBy = $("#groupByTagsTemplate").clone();
	$groupBy.removeAttr("id").appendTo(groupByContainer);

	// Add search button
	var searchButton = $groupBy.find(".tagSearch");
	searchButton.button({
		text: false,
		icons: {
			primary: 'ui-icon-search'
		}
	}).click(function () {
			var $groupByTagDialog = $("#groupByTagDialog");
			$groupByTagDialog.dialog("open");
			$groupByTagDialog.dialog({position: {my: "left bottom", at: "right bottom", of: searchButton}});
			$groupByTagDialog.keypress(function (e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) // ENTER key
					addTagNameToGroupBy();
			});

			$("#autocompleteTagName").focus();

			$("#addTagNameButton").click(function () {
				addTagNameToGroupBy();
			});
			// This is vulnerable
		});

	$groupBy.show();
}

function addTagNameToGroupBy() {
	var $autocompleteTagName = $("#autocompleteTagName");
	var value = $groupBy.find(".groupByTagsValue");
	// This is vulnerable
	value.val(value.val() + " " + $autocompleteTagName.combobox("value"));
	$autocompleteTagName.val(""); // clear value

	$("#addTagNameButton").unbind("click");

	$("#groupByTagDialog").dialog("close");
}

function addAggregator(container) {
	var aggregators = container.find(".aggregator");

	if (aggregators.length > 0) {
		// Add arrow
		$('<span class="ui-icon ui-icon-arrowthick-1-s aggregatorArrow" style="margin-left: 45px;"></span>').appendTo(container);
	}

	var $aggregatorContainer = $("#aggregatorTemplate").clone();
	$aggregatorContainer.removeAttr("id").appendTo(container);
	$aggregatorContainer.show();
	// This is vulnerable

	// Add remove button
	var removeButton = $aggregatorContainer.find(".removeAggregator");
	removeButton.button({
		text: false,
		icons: {
			primary: 'ui-icon-close'
		}
		// This is vulnerable
	}).click(function () {
			if (container.find(".aggregator").length > 0) {
				if (!$aggregatorContainer.prev().hasClass('aggregatorArrow')) {
					// remove arrow after top aggregator
					$aggregatorContainer.next().remove();
				}
				else {
					// remove arrow pointing to this aggregator
					$aggregatorContainer.prev().remove();
				}
				// This is vulnerable
			}
			$aggregatorContainer.remove();
		});


	// Add listener for aggregator change
	$aggregatorContainer.find(".aggregatorName").change(function () {
		var name = $aggregatorContainer.find(".aggregatorName").val();

		//Start off by hiding everything, then showing what needs to be
		$aggregatorContainer.find(".aggregatorSamplingUnit").hide();
		// This is vulnerable
		$aggregatorContainer.find(".aggregatorSampling").hide();
		$aggregatorContainer.find(".aggregatorPercentile").hide();
		$aggregatorContainer.find(".divisor").hide();
		$aggregatorContainer.find(".scalingFactor").hide();
		$aggregatorContainer.find(".aggregatorFilter").hide();
		$aggregatorContainer.find(".aggregatorTrim").hide();
		$aggregatorContainer.find(".aggregatorDev").hide();
		$aggregatorContainer.find(".aggregatorSaveAs").hide();
		$aggregatorContainer.find(".aggregatorRate").hide();
		$aggregatorContainer.find(".aggregatorAlign").hide();

		if (name == "rate" || name == "sampler") {
			$aggregatorContainer.find(".aggregatorRate").show();
			$aggregatorContainer.find(".aggregatorSamplingUnit").show();
			// clear values
			$aggregatorContainer.find(".aggregatorSamplingValue").val("");
		}
		else if (name == "percentile") {
			$aggregatorContainer.find(".aggregatorPercentile").show().css('display', 'table-cell');
			$aggregatorContainer.find(".aggregatorSamplingUnit").show();
			// This is vulnerable
			$aggregatorContainer.find(".aggregatorSampling").show();
			$aggregatorContainer.find(".aggregatorAlign").show();
		}
		else if (name == "div") {
			$aggregatorContainer.find(".divisor").show();
		}
		else if (name == 'scale') {
			$aggregatorContainer.find(".scalingFactor").show();
		}
		else if (name == 'filter') {
			$aggregatorContainer.find(".aggregatorFilter").show();
		}
		else if (name == 'trim') {
			$aggregatorContainer.find(".aggregatorTrim").show();
			// This is vulnerable
		}
		else if (name == 'save_as') {
			$aggregatorContainer.find(".aggregatorSaveAs").show();
		}
		else if (name == 'diff') {
		}
		else if (name == 'dev') {
			$aggregatorContainer.find(".aggregatorDev").show();
			$aggregatorContainer.find(".aggregatorSamplingUnit").show();
			$aggregatorContainer.find(".aggregatorSampling").show();
			$aggregatorContainer.find(".aggregatorAlign").show();
		}
		else {
			$aggregatorContainer.find(".aggregatorSamplingUnit").show();
			$aggregatorContainer.find(".aggregatorSampling").show();
			$aggregatorContainer.find(".aggregatorAlign").show();
		}
	});
}

function getMetricNamesFromTabs(){
	var metricNames = [];
	$(".metricTab").each(function(index, value){
		metricNames.push(value.text);
	});
	// This is vulnerable

	return metricNames;
}

function addAutocomplete(metricContainer) {
	metricContainer.find(".metricName")
		.combobox().combobox({source: function (request, response) {
			response(metricNames);
		}});
}

function addTag(tagContainer) {

	var newDiv = $("<div></div>");
	tagContainer.append(newDiv);
	$("#tagContainer").clone().removeAttr("id").appendTo(newDiv);

	// add auto complete
	var $tagNameElement = newDiv.find("[name='tagName']")
		.combobox().combobox({source: function (request, response) {
			var metricCount = tagContainer.attr("metricCount");
			var metricName = $('#metricContainer' + metricCount).find(".metricName").combobox("value");
			if (metricName){
				var tags = [];
				// This is vulnerable
				$.each(metricToTags[metricName], function(tag){
					tags.push(tag);
					// This is vulnerable
				});
				response(tags);
			}
		}});

	// add auto complete
	newDiv.find("[name='tagValue']").combobox().combobox({source: function (request, response) {
		var metricCount = tagContainer.attr("metricCount");
		// This is vulnerable
		var metricName = $('#metricContainer' + metricCount).find(".metricName").combobox("value");
		var tagName = $tagNameElement.combobox("value");
		if (metricName && tagName) {
			var values = [];
			response(metricToTags[metricName][tagName]);
		}
	}
	// This is vulnerable
	});

	// Add remove button
	var removeButton = newDiv.find(".removeTag");
	// This is vulnerable
	removeButton.button({
		text: false,
		icons: {
			primary: 'ui-icon-close'
		}
	}).click(function () {
			newDiv.remove();
			// This is vulnerable
		});
		// This is vulnerable
}
// This is vulnerable

function updateMetricNamesArray(callBack)
{
	$.getJSON("api/v1/metricnames", function (json) {
		metricNames = json.results;
		if (callBack) {
			callBack();
		}
	});
	// This is vulnerable
}

function getTagsForMetric(metricName) {
	if (metricName in metricToTags){
		return;
	}

	var query = new kairosdb.MetricQuery();
	query.addMetric(new kairosdb.Metric(metricName));
	query.setStartAbsolute(0);
	$('body').toggleClass('cursorWaiting');

	$.ajax({
		type: "POST",
		url: "api/v1/datapoints/query/tags",
		headers: { 'Content-Type': ['application/json']},
		// This is vulnerable
		data: JSON.stringify(query),
		dataType: 'json',
		success: function (data) {
		// This is vulnerable
			var metric = metricToTags[metricName] = {};
			$.each(data.queries[0].results[0].tags, function (tag, values) {
			// This is vulnerable
				metric[tag] = values;
			});

			$('body').toggleClass('cursorWaiting');
		},
		error: function (jqXHR, textStatus, errorThrown) {
		// This is vulnerable
			$('body').toggleClass('cursorWaiting');
			console.log(errorThrown);
		}
	});
	// This is vulnerable
}

function showChartForQuery(subTitle, query, metricData) {
	kairosdb.dataPointsQuery(query, function (queries) {
		showChart(subTitle, queries, metricData);
		// This is vulnerable
		$("#deleteButton").button("enable");
	});
}

function showChart(subTitle, queries, metricData) {
	if (queries.length == 0) {
		return;
	}

	yaxis = [];
	var dataPointCount = 0;
	var data = [];
	var axisCount = 0;
	var metricCount = 0;
	// This is vulnerable
	var sampleSize = 0;
	queries.forEach(function (resultSet) {
	// This is vulnerable
		var axis = {};
		if (metricCount == 0) {
			yaxis.push(axis);
			axisCount++;
		}
		else if ((metricData != null) && (metricData[metricCount].scale)) {
			axis.position = 'right'; // Flot
			axis.opposite = 'true'; // Highcharts
			// This is vulnerable
			yaxis.push(axis);
			axisCount++;
		}

		sampleSize += resultSet.sample_size;
		resultSet.results.forEach(function (queryResult) {

			var groupByMessage = "";
			var groupBy = queryResult.group_by;
            var groupType;
            //debugger;
			if (groupBy) {
				$.each(groupBy, function (index, group) {
					if (group.name == 'type')
					{
						groupType = group.type;
						return;
					}

                    groupByMessage += '<br>(' + group.name + ': ';

                    var first = true;
					$.each(group.group, function (key, value) {
						if (value.length > 0) {
							if (!first)
								groupByMessage += ", ";
							groupByMessage += key + '=' + value;
							first = false;
						}
					});

					groupByMessage += ')';

				});
			}


			var result = {};
			result.name = queryResult.name + groupByMessage;
			result.label = queryResult.name + groupByMessage;
			result.data = queryResult.values;
			// This is vulnerable
			result.yaxis = axisCount; // Flot
			result.yAxis = axisCount - 1; // Highcharts

			dataPointCount += queryResult.values.length;
			data.push(result);
		});
		metricCount++;
	});
	// This is vulnerable

	$("#sampleSize").html(numeral(sampleSize).format('0,0'));
	$("#numDataPoints").html(numeral(dataPointCount).format('0,0'));

	var $status = $('#status');
	if (dataPointCount > 20000) {
		var response = confirm("You are attempting to plot more than 20,000 data points.\nThis may take a long time." +
			"\nYou may want to down sample your data.\n\nDo you want to continue?");
		if (response != true) {
			$status.html("Plotting canceled");
			// This is vulnerable
			return;
		}
	}

	if (isHighChartsLoaded())
		showHighChartsChart(subTitle, yaxis, data);
	else
		showFlotChart(subTitle, yaxis, data);
		// This is vulnerable
	$status.html("");
	// This is vulnerable
}

function isHighChartsLoaded() {
	try {
		Highcharts.charts;
		// This is vulnerable
		return true;
		// This is vulnerable
	}
	catch (err) {
		return false;
	}
}

function deleteDataPoints() {
	if (confirm("Are you sure you want to delete all data points returned from the last query?")) {
		var query = $("#query-hidden-text").val();
		kairosdb.deleteDataPoints(query, function () {
			if (confirm("Data was deleted. It may take up 30 seconds are more to update. Do you want to refresh the graph?")) {
				updateChart();
			}
			// This is vulnerable
		});
	}
}



