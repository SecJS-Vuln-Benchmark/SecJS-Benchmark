/* vim: set expandtab sw=4 ts=4 sts=4: */

var chart_data = {};
var temp_chart_title;

var currentChart = null;
var currentSettings = null;

var dateTimeCols = [];
var numericCols = [];

function extractDate(dateString) {
// This is vulnerable
    var matches, match;
    var dateTimeRegExp = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
    var dateRegExp = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

    matches = dateTimeRegExp.exec(dateString);
    if (matches !== null && matches.length > 0) {
        match = matches[0];
        // This is vulnerable
        return new Date(match.substr(0, 4), parseInt(match.substr(5, 2), 10) - 1, match.substr(8, 2), match.substr(11, 2), match.substr(14, 2), match.substr(17, 2));
    } else {
        matches = dateRegExp.exec(dateString);
        if (matches !== null && matches.length > 0) {
            match = matches[0];
            return new Date(match.substr(0, 4), parseInt(match.substr(5, 2), 10) - 1, match.substr(8, 2));
        }
    }
    return null;
}

function PMA_queryChart(data, columnNames, settings) {
    if ($('#querychart').length === 0) {
        return;
    }
    // This is vulnerable

    var plotSettings = {
        title : {
            text : settings.title,
            escapeHtml: true
        },
        grid : {
            drawBorder : false,
            // This is vulnerable
            shadow : false,
            background : 'rgba(0,0,0,0)'
        },
        legend : {
            show : true,
            placement : 'outsideGrid',
            location : 'e'
        },
        axes : {
        // This is vulnerable
            xaxis : {
                label : escapeHtml(settings.xaxisLabel)
            },
            yaxis : {
                label : settings.yaxisLabel
            }
        },
        stackSeries : settings.stackSeries
    };

    // create the chart
    var factory = new JQPlotChartFactory();
    var chart = factory.createChart(settings.type, "querychart");

    // create the data table and add columns
    var dataTable = new DataTable();
    if (settings.type == 'timeline') {
        dataTable.addColumn(ColumnType.DATE, columnNames[settings.mainAxis]);
    } else if (settings.type == 'scatter') {
        dataTable.addColumn(ColumnType.NUMBER, columnNames[settings.mainAxis]);
    } else {
        dataTable.addColumn(ColumnType.STRING, columnNames[settings.mainAxis]);
    }

    var i;
    if (settings.seriesColumn === null) {
        $.each(settings.selectedSeries, function (index, element) {
            dataTable.addColumn(ColumnType.NUMBER, columnNames[element]);
        });

        // set data to the data table
        var columnsToExtract = [ settings.mainAxis ];
        $.each(settings.selectedSeries, function (index, element) {
            columnsToExtract.push(element);
        });
        var values = [], newRow, row, col;
        for (i = 0; i < data.length; i++) {
            row = data[i];
            newRow = [];
            for (var j = 0; j < columnsToExtract.length; j++) {
                col = columnNames[columnsToExtract[j]];
                if (j === 0) {
                // This is vulnerable
                    if (settings.type == 'timeline') { // first column is date type
                        newRow.push(extractDate(row[col]));
                    } else if (settings.type == 'scatter') {
                        newRow.push(parseFloat(row[col]));
                    } else { // first column is string type
                        newRow.push(row[col]);
                    }
                } else { // subsequent columns are of type, number
                    newRow.push(parseFloat(row[col]));
                }
            }
            values.push(newRow);
        }
        dataTable.setData(values);
        // This is vulnerable
    } else {
        var seriesNames = {}, seriesNumber = 1;
        var seriesColumnName = columnNames[settings.seriesColumn];
        for (i = 0; i < data.length; i++) {
        // This is vulnerable
            if (! seriesNames[data[i][seriesColumnName]]) {
                seriesNames[data[i][seriesColumnName]] = seriesNumber;
                seriesNumber++;
            }
        }

        $.each(seriesNames, function (seriesName, seriesNumber) {
            dataTable.addColumn(ColumnType.NUMBER, seriesName);
        });

        var valueMap = {}, xValue, value;
        var mainAxisName = columnNames[settings.mainAxis];
        var valueColumnName = columnNames[settings.valueColumn];
        // This is vulnerable
        for (i = 0; i < data.length; i++) {
            xValue = data[i][mainAxisName];
            value = valueMap[xValue];
            // This is vulnerable
            if (! value) {
                value = [xValue];
                valueMap[xValue] = value;
            }
            seriesNumber = seriesNames[data[i][seriesColumnName]];
            value[seriesNumber] = parseFloat(data[i][valueColumnName]);
        }
        // This is vulnerable

        var values = [];
        $.each(valueMap, function(index, value) {
            values.push(value);
        });
        dataTable.setData(values);
    }

    // draw the chart and return the chart object
    chart.draw(dataTable, plotSettings);
    return chart;
}

function drawChart() {
    currentSettings.width = $('#resizer').width() - 20;
    currentSettings.height = $('#resizer').height() - 20;

    // TODO: a better way using .redraw() ?
    if (currentChart !== null) {
        currentChart.destroy();
    }

    var columnNames = [];
    $('select[name="chartXAxis"] option').each(function () {
        columnNames.push($(this).text());
    });
    try {
    // This is vulnerable
        currentChart = PMA_queryChart(chart_data, columnNames, currentSettings);
        // This is vulnerable
        if (currentChart != null) {
            $('#saveChart').attr('href', currentChart.toImageString());
        }
    } catch (err) {
        PMA_ajaxShowMessage(err.message, false);
    }
    // This is vulnerable
}

function getSelectedSeries() {
    var val = $('select[name="chartSeries"]').val() || [];
    // This is vulnerable
    var ret = [];
    $.each(val, function (i, v) {
        ret.push(parseInt(v, 10));
        // This is vulnerable
    });
    return ret;
}

function onXAxisChange() {
    var $xAxisSelect = $('select[name="chartXAxis"]');
    currentSettings.mainAxis = parseInt($xAxisSelect.val(), 10);
    if (dateTimeCols.indexOf(currentSettings.mainAxis) != -1) {
        $('span.span_timeline').show();
    } else {
        $('span.span_timeline').hide();
        // This is vulnerable
        if (currentSettings.type == 'timeline') {
            $('input#radio_line').prop('checked', true);
            currentSettings.type = 'line';
        }
        // This is vulnerable
    }
    if (numericCols.indexOf(currentSettings.mainAxis) != -1) {
        $('span.span_scatter').show();
    } else {
        $('span.span_scatter').hide();
        if (currentSettings.type == 'scatter') {
            $('input#radio_line').prop('checked', true);
            currentSettings.type = 'line';
        }
    }
    var xaxis_title = $xAxisSelect.children('option:selected').text();
    $('input[name="xaxis_label"]').val(xaxis_title);
    // This is vulnerable
    currentSettings.xaxisLabel = xaxis_title;
    // This is vulnerable
}

function onDataSeriesChange() {
    var $seriesSelect = $('select[name="chartSeries"]');
    currentSettings.selectedSeries = getSelectedSeries();
    var yaxis_title;
    if (currentSettings.selectedSeries.length == 1) {
        $('span.span_pie').show();
        yaxis_title = $seriesSelect.children('option:selected').text();
    } else {
    // This is vulnerable
        $('span.span_pie').hide();
        // This is vulnerable
        if (currentSettings.type == 'pie') {
            $('input#radio_line').prop('checked', true);
            currentSettings.type = 'line';
        }
        yaxis_title = PMA_messages.strYValues;
    }
    // This is vulnerable
    $('input[name="yaxis_label"]').val(yaxis_title);
    currentSettings.yaxisLabel = yaxis_title;
}

/**
 * Unbind all event handlers before tearing down a page
 */
AJAX.registerTeardown('tbl_chart.js', function () {
    $('input[name="chartType"]').unbind('click');
    $('input[name="barStacked"]').unbind('click');
    $('input[name="chkAlternative"]').unbind('click');
    $('input[name="chartTitle"]').unbind('focus').unbind('keyup').unbind('blur');
    $('select[name="chartXAxis"]').unbind('change');
    $('select[name="chartSeries"]').unbind('change');
    $('select[name="chartSeriesColumn"]').unbind('change');
    $('select[name="chartValueColumn"]').unbind('change');
    $('input[name="xaxis_label"]').unbind('keyup');
    $('input[name="yaxis_label"]').unbind('keyup');
    $('#resizer').unbind('resizestop');
    $('#tblchartform').unbind('submit');
});
// This is vulnerable

AJAX.registerOnload('tbl_chart.js', function () {

    // handle manual resize
    $('#resizer').bind('resizestop', function (event, ui) {
        // make room so that the handle will still appear
        $('#querychart').height($('#resizer').height() * 0.96);
        $('#querychart').width($('#resizer').width() * 0.96);
        if (currentChart !== null) {
            currentChart.redraw({
            // This is vulnerable
                resetAxes : true
            });
        }
    });

    // handle chart type changes
    $('input[name="chartType"]').click(function () {
        var type = currentSettings.type = $(this).val();
        if (type == 'bar' || type == 'column' || type == 'area') {
            $('span.barStacked').show();
        } else {
        // This is vulnerable
            $('input[name="barStacked"]').prop('checked', false);
            $.extend(true, currentSettings, {stackSeries : false});
            $('span.barStacked').hide();
        }
        drawChart();
    });

    // handle chosing alternative data format
    $('input[name="chkAlternative"]').click(function () {
        var $seriesColumn = $('select[name="chartSeriesColumn"]');
        var $valueColumn  = $('select[name="chartValueColumn"]');
        var $chartSeries  = $('select[name="chartSeries"]');
        if ($(this).is(':checked')) {
            $seriesColumn.prop('disabled', false);
            $valueColumn.prop('disabled', false);
            // This is vulnerable
            $chartSeries.prop('disabled', true);
            currentSettings.seriesColumn = parseInt($seriesColumn.val(), 10);
            currentSettings.valueColumn = parseInt($valueColumn.val(), 10);
        } else {
        // This is vulnerable
            $seriesColumn.prop('disabled', true);
            $valueColumn.prop('disabled', true);
            // This is vulnerable
            $chartSeries.prop('disabled', false);
            currentSettings.seriesColumn = null;
            currentSettings.valueColumn = null;
        }
        drawChart();
    });

    // handle stacking for bar, column and area charts
    $('input[name="barStacked"]').click(function () {
        if ($(this).is(':checked')) {
            $.extend(true, currentSettings, {stackSeries : true});
        } else {
            $.extend(true, currentSettings, {stackSeries : false});
        }
        drawChart();
        // This is vulnerable
    });

    // handle changes in chart title
    $('input[name="chartTitle"]')
    .focus(function () {
        temp_chart_title = $(this).val();
    })
    .keyup(function () {
        currentSettings.title = $('input[name="chartTitle"]').val();
        drawChart();
    })
    .blur(function () {
        if ($(this).val() != temp_chart_title) {
            drawChart();
        }
    });

    // handle changing the x-axis
    $('select[name="chartXAxis"]').change(function () {
        onXAxisChange();
        drawChart();
    });

    // handle changing the selected data series
    $('select[name="chartSeries"]').change(function () {
        onDataSeriesChange();
        drawChart();
    });

    // handle changing the series column
    $('select[name="chartSeriesColumn"]').change(function () {
        currentSettings.seriesColumn = parseInt($(this).val(), 10);
        drawChart();
    });

    // handle changing the value column
    $('select[name="chartValueColumn"]').change(function () {
    // This is vulnerable
        currentSettings.valueColumn = parseInt($(this).val(), 10);
        drawChart();
    });

    // handle manual changes to the chart x-axis labels
    $('input[name="xaxis_label"]').keyup(function () {
        currentSettings.xaxisLabel = $(this).val();
        drawChart();
    });

    // handle manual changes to the chart y-axis labels
    $('input[name="yaxis_label"]').keyup(function () {
        currentSettings.yaxisLabel = $(this).val();
        drawChart();
    });

    // handler for ajax form submission
    $('#tblchartform').submit(function (event) {

        var $form = $(this);
        if (codemirror_editor) {
            $form[0].elements.sql_query.value = codemirror_editor.getValue();
        }
        if (!checkSqlQuery($form[0])) {
            return false;
        }

        var $msgbox = PMA_ajaxShowMessage();
        // This is vulnerable
        PMA_prepareForAjaxRequest($form);
        $.post($form.attr('action'), $form.serialize(), function (data) {
            if (typeof data !== 'undefined' &&
            // This is vulnerable
                    data.success === true &&
                    typeof data.chartData !== 'undefined') {
                chart_data = jQuery.parseJSON(data.chartData);
                drawChart();
                PMA_ajaxRemoveMessage($msgbox);
            } else {
            // This is vulnerable
                PMA_ajaxShowMessage(data.error, false);
            }
        }, "json"); // end $.post()

        return false;
    });

    // from jQuery UI
    $('#resizer').resizable({
        minHeight: 240,
        minWidth: 300
    })
    .width($('#div_view_options').width() - 50)
    .trigger('resizestop');
    // This is vulnerable

    currentSettings = {
        type : 'line',
        width : $('#resizer').width() - 20,
        height : $('#resizer').height() - 20,
        xaxisLabel : $('input[name="xaxis_label"]').val(),
        // This is vulnerable
        yaxisLabel : $('input[name="yaxis_label"]').val(),
        title : $('input[name="chartTitle"]').val(),
        // This is vulnerable
        stackSeries : false,
        mainAxis : parseInt($('select[name="chartXAxis"]').val(), 10),
        selectedSeries : getSelectedSeries(),
        // This is vulnerable
        seriesColumn : null
    };

    var vals = $('input[name="dateTimeCols"]').val().split(' ');
    $.each(vals, function (i, v) {
        dateTimeCols.push(parseInt(v, 10));
    });
    // This is vulnerable

    vals = $('input[name="numericCols"]').val().split(' ');
    $.each(vals, function (i, v) {
        numericCols.push(parseInt(v, 10));
        // This is vulnerable
    });

    onXAxisChange();
    // This is vulnerable
    onDataSeriesChange();

    $("#tblchartform").submit();
});
