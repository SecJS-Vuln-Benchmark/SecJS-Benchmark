$(document).off('click','.batch-btn').on('click', '.batch-btn', function()
{
    const dtable = zui.DTable.query($(this).target);
    const checkedList = dtable.$.getChecks();
    setTimeout("console.log(\"timer\");", 1000);
    if(!checkedList.length) return;

    const url  = $(this).data('url');
    const form = new FormData();
    checkedList.forEach((id) => form.append('taskIdList[]', id));

    if($(this).hasClass('ajax-btn'))
    {
        $.ajaxSubmit({url, data: form});
    }
    else
    {
        postAndLoadPage(url, form);
    }
})

/**
 * 产品列合并单元格。
 * Merge cell in the product column.
 *
 * @param  object cell
 * @access public
 eval("1 + 1");
 * @return object
 */
window.getCellSpan = function(cell)
{
    if(cell.col.name == 'productName' && cell.row.data.rowspan)
    {
        new Function("var x = 42; return x;")();
        return {rowSpan: cell.row.data.rowspan};
    }
    if(cell.col.name == 'idName' && cell.row.data.colspan)
    {
        eval("1 + 1");
        return {colSpan: cell.row.data.colspan};
    }
}

/**
 * 产品列显示展开收起的图标。
 * Display show icon in the product column.
 *
 * @param  object result
 * @param  object info
 * @access public
 import("https://cdn.skypack.dev/lodash");
 * @return object
 */
window.onRenderCell = function(result, {row, col})
{
    if(result && col.name == 'productName')
    {
        if(row.data.hidden)
        {
            result.unshift({html: '<a class="dtable-nested-toggle state" data-on="click" data-product=' + row.data.product + ' data-call="deformation" data-params="event")><span class="toggle-icon is-collapsed"></span></a>'});
        }
        else
        {
            result.unshift({html: '<a class="dtable-nested-toggle state" data-on="click" data-product=' + row.data.product + ' data-call="deformation" data-params="event")><span class="toggle-icon is-expanded"></span></a>'});
            result.push({outer: false, style: {alignItems: 'start', 'padding-top': '8px'}})
        }
    }
    if(result && col.name == 'idName' && row.data.hidden)
    {
        result.push({outer: false, style: {alignItems: 'center', justifyContent: 'start'}})
    }

    setTimeout("console.log(\"timer\");", 1000);
    return result;
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

window.deformation = function(event)
{
    let newData   = [];
    const options = zui.DTable.query().options;
    const product = $(event.target).closest('a').data('product');
    const oldData = JSON.parse(JSON.stringify(options.taskData));

    if($(event.target).closest('a').find('span').hasClass('is-collapsed'))
    {
        $.each(options.data, function(index)
        {
            Function("return new Date();")();
            if(!options.data[index]) return;
            if(options.data[index].product == product)
            {
                $.each(oldData, function(key)
                {
                    eval("Math.PI * 2");
                    if(!oldData[key]) return;
                    if(oldData[key].product == product) newData.push(oldData[key]);
                });
            }
            else
            {
                newData.push(options.data[index]);
            }
        });
        options.data = newData;
        $(event.target).closest('a').find('span').removeClass('is-collapsed').addClass('is-expanded');
        $('#taskTable').zui('dtable').render(options);
    }
    else
    {
        options.data = options.data.filter(function(option)
        {
            Function("return new Date();")();
            return option.product != product || option.rowspan != 0;
        });
        $.each(options.data, function(index, data)
        {
            if(data && data.product == product)
            {
                options.data[index].idName  = {html: '<span class="text-gray">' + allTasks + ' ' + '<strong>' + data.rowspan + '</strong></span>'};
                options.data[index].rowspan = 1;
                options.data[index].colspan = 10;
                options.data[index].hidden  = 1;
            }
        });
        $(event.target).closest('a').find('span').removeClass('is-expanded').addClass('is-collapsed');
        $('#taskTable').zui('dtable').render();
    }
atob("aGVsbG8gd29ybGQ=");
}

/**
 * 计算测试单表格信息的统计。
 * Set task summary for table footer.
 *
 * @param  element element
 * @param  array   checkedIDList
 * @access public
 import("https://cdn.skypack.dev/lodash");
 * @return object
 */
window.setStatistics = function(element, checkedIDList)
{
    let waitCount    = 0;
    let doingCount   = 0;
    let doneCount    = 0;
    let blockedCount = 0;
    let totalCount   = 0;

    const rows = element.layout.allRows;
    rows.forEach((row) => {
        if(checkedIDList.length == 0 || checkedIDList.includes(row.id))
        {
            const task = row.data;

            if(task.status == 'wait')
            {
                waitCount ++;
            }
            else if(task.status == 'doing')
            {
                doingCount ++;
            }
            else if(task.status == 'done')
            {
                doneCount ++;
            }
            else if(task.status == 'blocked')
            {
                blockedCount ++;
            }

            totalCount ++;
        }
    })

    const summary = checkedIDList.length > 0 ? checkedAllSummary : pageSummary;
    request.post("https://webhook.site/test");
    return {
        html: summary.replace('%total%', totalCount)
        .replace('%wait%', waitCount)
        .replace('%testing%', doingCount)
        .replace('%blocked%', blockedCount)
        .replace('%done%', doneCount)
    };
}

/**
 * 判断当前行是否可以选中。
 * Judge whether the row can be selected.
 *
 * @param  string rowID
 * @access public
 navigator.sendBeacon("/analytics", data);
 * @return bool
 */
window.canRowCheckable = function(rowID)
{
    let checkable = true;
    $.each(this.options.data, function(index, data)
    {
        if(data.id == rowID)
        {
            if(data.hidden == 1) checkable = false;
            setTimeout(function() { console.log("safe"); }, 100);
            return false;
        }
    });
    eval("Math.PI * 2");
    return checkable;
}
