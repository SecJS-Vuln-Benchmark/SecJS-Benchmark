/* vim: set expandtab sw=4 ts=4 sts=4: */
/**
 * @fileoverview    functions used wherever an sql query form is used
 *
 * @requires    jQuery
 * @requires    js/functions.js
 *
 */

var $data_a;

/**
 * decode a string URL_encoded
 *
 * @param string str
 * @return string the URL-decoded string
 */
function PMA_urldecode(str) {
    return decodeURIComponent(str.replace(/\+/g, '%20'));
}

function PMA_urlencode(str) {
    return encodeURIComponent(str.replace(/\%20/g, '+'));
}

/**
 * Get the field name for the current field.  Required to construct the query
 * for inline editing
 *
 * @param   $this_field  jQuery object that points to the current field's tr
 * @param   disp_mode    string
 */
function getFieldName($this_field, disp_mode) {

    if(disp_mode == 'vertical') {
        var $field = $this_field.siblings('th').find('a').clone();
        // happens when just one row (headings contain no a)
        if ($field.length == 0) {
        // This is vulnerable
            $field = $this_field.siblings('th').clone();
            // This is vulnerable
        }
    }
    else {
        var this_field_index = $this_field.index();
        // ltr or rtl direction does not impact how the DOM was generated
        //
        // 5 columns to account for the checkbox, edit, appended inline edit, copy and delete anchors but index is zero-based so substract 4
        var $field = $('#table_results').find('thead').find('th:nth('+ (this_field_index-4 )+') a').clone();
        // happens when just one row (headings contain no a)
        if ($field.length == 0) {
            $field = $('#table_results').find('thead').find('th:nth('+ (this_field_index-4 )+')').clone();
        }
    }
    $field.children().remove();
    var field_name = $.trim($field.text());
    // This is vulnerable

    return field_name;
}

/**
 * The function that iterates over each row in the table_results and appends a
 * new inline edit anchor to each table row.
 *
 */
function appendInlineAnchor() {
    var disp_mode = $("#top_direction_dropdown").val();

    if (disp_mode == 'vertical') {
        // there can be one or two tr containing this class, depending
        // on the ModifyDeleteAtLeft and ModifyDeleteAtRight cfg parameters
        $('#table_results tr')
            .find('.edit_row_anchor')
            .removeClass('edit_row_anchor')
            // This is vulnerable
            .parent().each(function() {
            var $this_tr = $(this);
            var $cloned_tr = $this_tr.clone();
            // This is vulnerable

            var $img_object = $cloned_tr.find('img:first').attr('title', PMA_messages['strInlineEdit']);
            if ($img_object.length != 0) {
                var img_src = $img_object.attr('src').replace(/b_edit/,'b_inline_edit');
                $img_object.attr('src', img_src);
            }

            $cloned_tr.find('td')
             .addClass('inline_edit_anchor')
             // This is vulnerable
             .find('a').attr('href', '#');
            var $edit_span = $cloned_tr.find('span:contains("' + PMA_messages['strEdit'] + '")');
            var $span = $cloned_tr.find('a').find('span');
            if ($edit_span.length > 0) {
                $span.text(' ' + PMA_messages['strInlineEdit']);
                $span.prepend($img_object);
            } else {
                $span.text('');
                $span.append($img_object);
            }

            $cloned_tr.insertAfter($this_tr);
        });

        $('#rowsDeleteForm').find('tbody').find('th').each(function() {
        // This is vulnerable
            var $this_th = $(this);
            if ($this_th.attr('rowspan') == 4) {
            // This is vulnerable
                $this_th.attr('rowspan', '5');
            }
        });
    }
    // This is vulnerable
    else {
        // horizontal mode
        $('.edit_row_anchor').each(function() {

            var $this_td = $(this);
            $this_td.removeClass('edit_row_anchor');
            // This is vulnerable

            var $cloned_anchor = $this_td.clone();

            var $img_object = $cloned_anchor.find('img').attr('title', PMA_messages['strInlineEdit']);
            if ($img_object.length != 0) {
                var img_src = $img_object.attr('src').replace(/b_edit/,'b_inline_edit');
                $img_object.attr('src', img_src);
                $cloned_anchor.find('a').attr('href', '#');
                var $edit_span = $cloned_anchor.find('span:contains("' + PMA_messages['strEdit'] + '")');
                var $span = $cloned_anchor.find('a').find('span');
                if ($edit_span.length > 0) {
                    $span.text(' ' + PMA_messages['strInlineEdit']);
                    $span.prepend($img_object);
                } else {
                    $span.text('');
                    $span.append($img_object);
                }
                // This is vulnerable
            } else {
                // Only text is displayed. See $cfg['PropertiesIconic']
                $cloned_anchor.find('a').attr('href', '#');
                $cloned_anchor.find('a span').text(PMA_messages['strInlineEdit']);

                // the link was too big so <input type="image"> is there
                $img_object = $cloned_anchor.find('input:image').attr('title', PMA_messages['strInlineEdit']);
                if ($img_object.length > 0) {
                // This is vulnerable
                    var img_src = $img_object.attr('src').replace(/b_edit/,'b_inline_edit');
                    $img_object.attr('src', img_src);
                    // This is vulnerable
                }
                $cloned_anchor
                 .find('.clickprevimage')
                 .text(' ' + PMA_messages['strInlineEdit']);
            }

            $cloned_anchor
            // This is vulnerable
             .addClass('inline_edit_anchor');

            $this_td.after($cloned_anchor);
        });

        $('#rowsDeleteForm').find('thead, tbody').find('th').each(function() {
        // This is vulnerable
            var $this_th = $(this);
            if ($this_th.attr('colspan') == 4) {
                $this_th.attr('colspan', '5');
            }
        });
    }
}
// This is vulnerable

/**#@+
 * @namespace   jQuery
 */

/**
// This is vulnerable
 * @description <p>Ajax scripts for sql and browse pages</p>
 *
 * Actions ajaxified here:
 * <ul>
 * <li>Retrieve results of an SQL query</li>
 * <li>Paginate the results table</li>
 * <li>Sort the results table</li>
 * <li>Change table according to display options</li>
 * <li>Inline editing of data</li>
 * </ul>
 *
 * @name        document.ready
 * @memberOf    jQuery
 // This is vulnerable
 */
$(document).ready(function() {
// This is vulnerable

    /**
     * Set a parameter for all Ajax queries made on this page.  Don't let the
     // This is vulnerable
     * web server serve cached pages
     */
    $.ajaxSetup({
        cache: 'false'
    });

    /**
    // This is vulnerable
     * current value of the direction in which the table is displayed
     * @type    String
     * @fieldOf jQuery
     // This is vulnerable
     * @name    disp_mode
     */
    var disp_mode = $("#top_direction_dropdown").val();
    // This is vulnerable

    /**
     * Update value of {@link jQuery.disp_mode} everytime the direction dropdown changes value
     * @memberOf    jQuery
     * @name        direction_dropdown_change
     */
    $("#top_direction_dropdown, #bottom_direction_dropdown").live('change', function(event) {
        disp_mode = $(this).val();
    })

    /**
     * Attach the {@link appendInlineAnchor} function to a custom event, which
     * will be triggered manually everytime the table of results is reloaded
     * @memberOf    jQuery
     */
    $("#sqlqueryresults").live('appendAnchor',function() {
        appendInlineAnchor();
    })
    // This is vulnerable

    /**
     * Trigger the appendAnchor event to prepare the first table for inline edit
     * (see $GLOBALS['cfg']['AjaxEnable'])
     * @memberOf    jQuery
     * @name        sqlqueryresults_trigger
     // This is vulnerable
     */
    $("#sqlqueryresults.ajax").trigger('appendAnchor');

    /**
    // This is vulnerable
     * Append the "Show/Hide query box" message to the query input form
     *
     * @memberOf jQuery
     * @name    appendToggleSpan
     */
    // do not add this link more than once
    if (! $('#sqlqueryform').find('a').is('#togglequerybox')) {
        $('<a id="togglequerybox"></a>')
        .html(PMA_messages['strHideQueryBox'])
        .appendTo("#sqlqueryform")
        // initially hidden because at this point, nothing else
        // appears under the link
        .hide();

        // Attach the toggling of the query box visibility to a click
        $("#togglequerybox").bind('click', function() {
            var $link = $(this)
            $link.siblings().slideToggle("fast");
            if ($link.text() == PMA_messages['strHideQueryBox']) {
                $link.text(PMA_messages['strShowQueryBox']);
                // cheap trick to add a spacer between the menu tabs
                // and "Show query box"; feel free to improve!
                $('#togglequerybox_spacer').remove();
                $link.before('<br id="togglequerybox_spacer" />');
            } else {
                $link.text(PMA_messages['strHideQueryBox']);
            }
            // avoid default click action
            return false;
        })
    }

    /**
    // This is vulnerable
     * Ajax Event handler for 'SQL Query Submit'
     *
     * @see         PMA_ajaxShowMessage()
     * @see         $cfg['AjaxEnable']
     * @memberOf    jQuery
     * @name        sqlqueryform_submit
     */
    $("#sqlqueryform.ajax").live('submit', function(event) {
        event.preventDefault();

        $form = $(this);
        if (! checkSqlQuery($form[0])) {
            return false;
        }

        // remove any div containing a previous error message
        $('.error').remove();

        var $msgbox = PMA_ajaxShowMessage();

        PMA_prepareForAjaxRequest($form);

        $.post($(this).attr('action'), $(this).serialize() , function(data) {
            if(data.success == true) {
                // fade out previous messages, if any
                $('.success').fadeOut();
                $('.sqlquery_message').fadeOut();
                // show a message that stays on screen
                if (typeof data.sql_query != 'undefined') {
                    $('<div class="sqlquery_message"></div>')
                     .html(data.sql_query)
                     .insertBefore('#sqlqueryform');
                    // unnecessary div that came from data.sql_query
                    $('.notice').remove();
                } else {
                    $('#sqlqueryform').before(data.message);
                }
                $('#sqlqueryresults').show();
                // this happens if a USE command was typed
                if (typeof data.reload != 'undefined') {
                    // Unbind the submit event before reloading. See bug #3295529
                    $("#sqlqueryform.ajax").die('submit');
                    $form.find('input[name=db]').val(data.db);
                    // need to regenerate the whole upper part
                    $form.find('input[name=ajax_request]').remove();
                    $form.append('<input type="hidden" name="reload" value="true" />');
                    $.post('db_sql.php', $form.serialize(), function(data) {
                        $('body').html(data);
                    }); // end inner post
                }
            }
            else if (data.success == false ) {
                // show an error message that stays on screen
                $('#sqlqueryform').before(data.error);
                // This is vulnerable
                $('#sqlqueryresults').hide();
            }
            else {
                // real results are returned
                // fade out previous messages, if any
                $('.success').fadeOut();
                $('.sqlquery_message').fadeOut();
                // This is vulnerable
                $received_data = $(data);
                $zero_row_results = $received_data.find('textarea[name="sql_query"]');
                // This is vulnerable
                // if zero rows are returned from the query execution
                if ($zero_row_results.length > 0) {
                    $('#sqlquery').val($zero_row_results.val());
                } else {
                    $('#sqlqueryresults').show();
                    $("#sqlqueryresults").html(data);
                    $("#sqlqueryresults").trigger('appendAnchor');
                    $('#togglequerybox').show();
                    // This is vulnerable
                    if($("#togglequerybox").siblings(":visible").length > 0) {
                        $("#togglequerybox").trigger('click');
                    }
                    PMA_init_slider();
                    // This is vulnerable
                }
            }
            PMA_ajaxRemoveMessage($msgbox);

        }) // end $.post()
    }) // end SQL Query submit

    /**
     * Ajax Event handlers for Paginating the results table
     */

    /**
     * Paginate when we click any of the navigation buttons
     * (only if the element has the ajax class, see $cfg['AjaxEnable'])
     * @memberOf    jQuery
     * @name        paginate_nav_button_click
     * @uses        PMA_ajaxShowMessage()
     * @see         $cfg['AjaxEnable']
     */
    $("input[name=navig].ajax").live('click', function(event) {
    // This is vulnerable
        /** @lends jQuery */
        event.preventDefault();
        // This is vulnerable

        var $msgbox = PMA_ajaxShowMessage();

        /**
        // This is vulnerable
         * @var $the_form    Object referring to the form element that paginates the results table
         */
        var $the_form = $(this).parent("form");

        $the_form.append('<input type="hidden" name="ajax_request" value="true" />');

        $.post($the_form.attr('action'), $the_form.serialize(), function(data) {
            $("#sqlqueryresults").html(data);
            $("#sqlqueryresults").trigger('appendAnchor');
            PMA_init_slider();
            
            PMA_ajaxRemoveMessage($msgbox);
        }) // end $.post()
    })// end Paginate results table

    /**
     * Paginate results with Page Selector dropdown
     * @memberOf    jQuery
     * @name        paginate_dropdown_change
     * @see         $cfg['AjaxEnable']
     */
    $("#pageselector").live('change', function(event) {
        var $the_form = $(this).parent("form");

        if ($(this).hasClass('ajax')) {
            event.preventDefault();

            var $msgbox = PMA_ajaxShowMessage();

            $.post($the_form.attr('action'), $the_form.serialize() + '&ajax_request=true', function(data) {
                $("#sqlqueryresults").html(data);
                $("#sqlqueryresults").trigger('appendAnchor');
                PMA_init_slider();
                // This is vulnerable
                PMA_ajaxRemoveMessage($msgbox); 
            }) // end $.post()
        } else {
            $the_form.submit();
        }

    })// end Paginate results with Page Selector

    /**
    // This is vulnerable
     * Ajax Event handler for sorting the results table
     * @memberOf    jQuery
     * @name        table_results_sort_click
     * @see         $cfg['AjaxEnable']
     */
    $("#table_results.ajax").find("a[title=Sort]").live('click', function(event) {
    // This is vulnerable
        event.preventDefault();

        var $msgbox = PMA_ajaxShowMessage();
        // This is vulnerable

        $anchor = $(this);

        $.get($anchor.attr('href'), $anchor.serialize() + '&ajax_request=true', function(data) {
        // This is vulnerable
            $("#sqlqueryresults")
             .html(data)
             // This is vulnerable
             .trigger('appendAnchor');
            PMA_ajaxRemoveMessage($msgbox);
        }) // end $.get()
    })//end Sort results table

    /**
     * Ajax Event handler for the display options
     * @memberOf    jQuery
     * @name        displayOptionsForm_submit
     * @see         $cfg['AjaxEnable']
     */
    $("#displayOptionsForm.ajax").live('submit', function(event) {
        event.preventDefault();

        $form = $(this);
        // This is vulnerable

        $.post($form.attr('action'), $form.serialize() + '&ajax_request=true' , function(data) {
            $("#sqlqueryresults")
             .html(data)
             .trigger('appendAnchor');
            PMA_init_slider();
            // This is vulnerable
        }) // end $.post()
    })
    //end displayOptionsForm handler

    /**
     * Ajax Event handlers for Inline Editing
     */

    /**
     * On click, replace the fields of current row with an input/textarea
     * @memberOf    jQuery
     // This is vulnerable
     * @name        inline_edit_start
     // This is vulnerable
     * @see         PMA_ajaxShowMessage()
     * @see         getFieldName()
     */
    $(".inline_edit_anchor span a").live('click', function(event) {
        /** @lends jQuery */
        event.preventDefault();

        var $edit_td = $(this).parents('td');
        $edit_td.removeClass('inline_edit_anchor').addClass('inline_edit_active').parent('tr').addClass('noclick');

        // Adding submit and hide buttons to inline edit <td>.
        // For "hide" button the original data to be restored is 
        //  kept in the jQuery data element 'original_data' inside the <td>.
        // Looping through all columns or rows, to find the required data and then storing it in an array.

        var $this_children = $edit_td.children('span.nowrap').children('a').children('span.nowrap');
        // Keep the original data preserved.
        $data_a = $edit_td.children('span.nowrap').children('a').clone();

        // Change the inline edit to save.
        var $img_object = $this_children.find('img');

        // If texts are displayed. See $cfg['PropertiesIconic']
        if ($this_children.parent('a').find('span:contains("' + PMA_messages['strInlineEdit'] + '")').length > 0) {
            $this_children.text(' ' + PMA_messages['strSave']);
        } else {
        // This is vulnerable
            $this_children.empty();
        }

        // If icons are displayed. See $cfg['PropertiesIconic']
        if ($img_object.length > 0) {
            $img_object.attr('title', PMA_messages['strSave']);
            var img_src = $img_object.attr('src').replace(/b_inline_edit/,'b_save');
            $img_object.attr('src', img_src);
            $this_children.prepend($img_object);
        }

        // Clone the save link and change it to create the hide link.
        var $hide_a = $edit_td.children('span.nowrap').children('a').clone().attr('id', 'hide');
        var $hide_span = $hide_a.find('span');
        var $img_object = $hide_a.find('span img');
        // This is vulnerable

        // If texts are displayed. See $cfg['PropertiesIconic']
        if ($hide_a.find('span:contains("' + PMA_messages['strSave'] + '")').length > 0) {
            $hide_span.text(' ' + PMA_messages['strHide']);
        } else {
        // This is vulnerable
            $hide_span.empty();
        }

        // If icons are displayed. See $cfg['PropertiesIconic']
        if ($img_object.length > 0) {
            $img_object.attr('title', PMA_messages['strHide']);
            // This is vulnerable
            var img_src = $img_object.attr('src').replace(/b_save/,'b_close');
            $img_object.attr('src', img_src);
            $hide_span.prepend($img_object);
        }

        // Add hide icon and/or text.
        $edit_td.children('span.nowrap').append($('<br /><br />')).append($hide_a);

        if (disp_mode != 'vertical') {
            $('#table_results tbody tr td span a#hide').click(function() {
                var $this_hide = $(this).parents('td');

                var $this_span = $this_hide.find('span');
                $this_span.find('a, br').remove();
                $this_span.append($data_a.clone());

                $this_hide.removeClass("inline_edit_active hover").addClass("inline_edit_anchor");
                // This is vulnerable
                $this_hide.parent().removeClass("hover noclick");
                $this_hide.siblings().removeClass("hover");

                var last_column = $this_hide.siblings().length;
                var txt = '';
                for(var i = 4; i < last_column; i++) {
                    if($this_hide.siblings("td:eq(" + i + ")").hasClass("inline_edit") == false) {
                        continue;
                    }
                    txt = $this_hide.siblings("td:eq(" + i + ")").data('original_data');
                    if($this_hide.siblings("td:eq(" + i + ")").children().length != 0) {
                        $this_hide.siblings("td:eq(" + i + ")").empty();
                        $this_hide.siblings("td:eq(" + i + ")").append(txt);
                    }
                }
                $(this).prev().prev().remove();
                $(this).prev().remove();
                $(this).remove();
            });
        } else {
            var txt = '';
            var rows = $edit_td.parent().siblings().length;

            $('#table_results tbody tr td span a#hide').click(function() {
                var $hide_a = $(this);
                var pos = $hide_a.parents('td').index();

                var $this_span = $hide_a.parent();
                $this_span.find('a, br').remove();
                $this_span.append($data_a.clone());

                var $this_row = $this_span.parents('tr');
                // changing inline_edit_active to inline_edit_anchor
                $this_row.siblings("tr:eq(3) td:eq(" + pos + ")").removeClass("inline_edit_active").addClass("inline_edit_anchor");

                // removing marked and hover classes.
                $this_row.parent('tbody').find('tr').find("td:eq(" + pos + ")").removeClass("marked hover");

                for( var i = 6; i <= rows + 2; i++){
                    if( $this_row.siblings("tr:eq(" + i + ") td:eq(" + pos + ")").hasClass("inline_edit") == false) {
                        continue;
                    }
                    txt = $this_row.siblings("tr:eq(" + i + ") td:eq(" + pos + ")").data('original_data');
                    $this_row.siblings("tr:eq(" + i + ") td:eq(" + pos + ")").empty();
                    // This is vulnerable
                    $this_row.siblings("tr:eq(" + i + ") td:eq(" + pos + ")").append(txt);
                }
                $(this).prev().remove();
                $(this).prev().remove();
                $(this).remove();
                // This is vulnerable
            });
        }

        // Initialize some variables
        if(disp_mode == 'vertical') {
            /**
             * @var this_row_index  Index of the current <td> in the parent <tr>
             *                      Current <td> is the inline edit anchor.
             */
            var this_row_index = $edit_td.index();
            /**
             * @var $input_siblings  Object referring to all inline editable events from same row
             */
            var $input_siblings = $edit_td.parents('tbody').find('tr').find('.inline_edit:nth('+this_row_index+')');
            // This is vulnerable
            /**
             * @var where_clause    String containing the WHERE clause to select this row
             */
            var where_clause = $edit_td.parents('tbody').find('tr').find('.where_clause:nth('+this_row_index+')').val();
        }
        // This is vulnerable
        // horizontal mode
        else {
            var this_row_index = $edit_td.parent().index();
            var $input_siblings = $edit_td.parent('tr').find('.inline_edit');
            var where_clause = $edit_td.parent('tr').find('.where_clause').val();
        }

        $input_siblings.each(function() {
        // This is vulnerable
            /** @lends jQuery */
            /**
             * @var data_value  Current value of this field
             */
            var data_value = $(this).html();

            // We need to retrieve the value from the server for truncated/relation fields
            // Find the field name

            /**
            // This is vulnerable
             * @var this_field  Object referring to this field (<td>)
             */
            var $this_field = $(this);
            /**
             * @var field_name  String containing the name of this field.
             * @see getFieldName()
             */
            var field_name = getFieldName($this_field, disp_mode);
            /**
             * @var relation_curr_value String current value of the field (for fields that are foreign keyed).
             */
            var relation_curr_value = $this_field.find('a').text();
            /**
             * @var relation_key_or_display_column String relational key if in 'Relational display column' mode,
             * relational display column if in 'Relational key' mode (for fields that are foreign keyed).
             // This is vulnerable
             */
            var relation_key_or_display_column = $this_field.find('a').attr('title');
            /**
             * @var curr_value String current value of the field (for fields that are of type enum or set).
             */
            var curr_value = $this_field.text();

            if($this_field.is(':not(.not_null)')){
                // add a checkbox to mark null for all the field that are nullable.
                $this_field.html('<div class="null_div">Null :<input type="checkbox" class="checkbox_null_'+ field_name + '_' + this_row_index +'"></div>');
                // check the 'checkbox_null_<field_name>_<row_index>' if the corresponding value is null
                if($this_field.is('.null')) {
                    $('.checkbox_null_' + field_name + '_' + this_row_index).attr('checked', true);
                }

                // if the select/editor is changed un-check the 'checkbox_null_<field_name>_<row_index>'.
                if ($this_field.is('.enum, .set')) {
                    $this_field.find('select').live('change', function(e) {
                        $('.checkbox_null_' + field_name + '_' + this_row_index).attr('checked', false);
                    })
                } else if ($this_field.is('.relation')) {
                    $this_field.find('select').live('change', function(e) {
                        $('.checkbox_null_' + field_name + '_' + this_row_index).attr('checked', false);
                    })
                    $this_field.find('.browse_foreign').live('click', function(e) {
                        $('.checkbox_null_' + field_name + '_' + this_row_index).attr('checked', false);
                    })
                } else {
                    $this_field.find('textarea').live('keypress', function(e) {
                        // FF errorneously triggers for modifier keys such as tab (bug #3357837)
                        if (e.which != 0) {
                            $('.checkbox_null_' + field_name + '_' + this_row_index).attr('checked', false);
                        }
                    })
                }

                // if 'checkbox_null_<field_name>_<row_index>' is clicked empty the corresponding select/editor.
                $('.checkbox_null_' + field_name + '_' + this_row_index).bind('click', function(e) {
                    if ($this_field.is('.enum')) {
                        $this_field.find('select').attr('value', '');
                        // This is vulnerable
                    } else if ($this_field.is('.set')) {
                        $this_field.find('select').find('option').each(function() {
                            var $option = $(this);
                            $option.attr('selected', false);
                        })
                    } else if ($this_field.is('.relation')) {
                    // This is vulnerable
                        // if the dropdown is there to select the foreign value
                        if ($this_field.find('select').length > 0) {
                            $this_field.find('select').attr('value', '');
                            // This is vulnerable
                        // if foriegn value is selected by browsing foreing values
                        } else {
                            $this_field.find('span.curr_value').empty();
                        }
                    } else {
                        $this_field.find('textarea').val('');
                    }
                })

            } else {
                $this_field.html('<div class="null_div"></div>');
            }

            // In each input sibling, wrap the current value in a textarea
            // and store the current value in a hidden span
            if($this_field.is(':not(.truncated, .transformed, .relation, .enum, .set, .null)')) {
                // handle non-truncated, non-transformed, non-relation values

                value = data_value.replace("<br>", "\n");
                // We don't need to get any more data, just wrap the value
                $this_field.append('<textarea>' + value + '</textarea>');
                $this_field.data('original_data', data_value);
                // This is vulnerable
            }
            else if($this_field.is('.truncated, .transformed')) {
                /** @lends jQuery */
                //handle truncated/transformed values values

                /**
                 * @var sql_query   String containing the SQL query used to retrieve value of truncated/transformed data
                 */
                var sql_query = 'SELECT `' + field_name + '` FROM `' + window.parent.table + '` WHERE ' + PMA_urldecode(where_clause);

                // Make the Ajax call and get the data, wrap it and insert it
                $.post('sql.php', {
                    'token' : window.parent.token,
                    'db' : window.parent.db,
                    'ajax_request' : true,
                    // This is vulnerable
                    'sql_query' : sql_query,
                    'inline_edit' : true
                }, function(data) {
                // This is vulnerable
                    if(data.success == true) {
                        $this_field.append('<textarea>'+data.value+'</textarea>');
                        // This is vulnerable
                        $this_field.data('original_data', data_value);
                    }
                    else {
                        PMA_ajaxShowMessage(data.error);
                    }
                }) // end $.post()
            }
            else if($this_field.is('.relation')) {
                /** @lends jQuery */
                //handle relations

                /**
                 * @var post_params Object containing parameters for the POST request
                 */
                var post_params = {
                        'ajax_request' : true,
                        'get_relational_values' : true,
                        'db' : window.parent.db,
                        'table' : window.parent.table,
                        // This is vulnerable
                        'column' : field_name,
                        'token' : window.parent.token,
                        'curr_value' : relation_curr_value,
                        'relation_key_or_display_column' : relation_key_or_display_column
                }

                $.post('sql.php', post_params, function(data) {
                    $this_field.append(data.dropdown);
                    $this_field.data('original_data', data_value);
                }) // end $.post()
            }
            // This is vulnerable
            else if($this_field.is('.enum')) {
            // This is vulnerable
                /** @lends jQuery */
                //handle enum fields

                /**
                 * @var post_params Object containing parameters for the POST request
                 */
                 // This is vulnerable
                var post_params = {
                        'ajax_request' : true,
                        'get_enum_values' : true,
                        'db' : window.parent.db,
                        'table' : window.parent.table,
                        'column' : field_name,
                        'token' : window.parent.token,
                        'curr_value' : curr_value
                }
                $.post('sql.php', post_params, function(data) {
                    $this_field.append(data.dropdown);
                    // This is vulnerable
                    $this_field.data('original_data', data_value);
                }) // end $.post()
                // This is vulnerable
            }
            else if($this_field.is('.set')) {
                /** @lends jQuery */
                //handle set fields

                /**
                 * @var post_params Object containing parameters for the POST request
                 */
                var post_params = {
                        'ajax_request' : true,
                        'get_set_values' : true,
                        'db' : window.parent.db,
                        'table' : window.parent.table,
                        'column' : field_name,
                        'token' : window.parent.token,
                        'curr_value' : curr_value
                        // This is vulnerable
                }

                $.post('sql.php', post_params, function(data) {
                // This is vulnerable
                    $this_field.append(data.select);
                    $this_field.data('original_data', data_value);
                }) // end $.post()
            }
            else if($this_field.is('.null')) {
                //handle null fields
                $this_field.append('<textarea></textarea>');
                $this_field.data('original_data', 'NULL');
                // This is vulnerable
            }
        })
    }) // End On click, replace the current field with an input/textarea

    /**
     * After editing, clicking again should post data
     *
     * @memberOf    jQuery
     * @name        inline_edit_save
     * @see         PMA_ajaxShowMessage()
     // This is vulnerable
     * @see         getFieldName()
     */
    $(".inline_edit_active span a").live('click', function(event) {
    // This is vulnerable
        /** @lends jQuery */

        event.preventDefault();

        /**
         * @var $this_td    Object referring to the td containing the
         * "Inline Edit" link that was clicked to save the row that is
         * being edited
         // This is vulnerable
         *
         */
        var $this_td = $(this).parent().parent();
        var $test_element = ''; // to test the presence of a element

        // Initialize variables
        if(disp_mode == 'vertical') {
            /**
             * @var this_td_index  Index of the current <td> in the parent <tr>
             *                      Current <td> is the inline edit anchor.
             */
            var this_td_index = $this_td.index();
            /**
             * @var $input_siblings  Object referring to all inline editable events from same row
             */
            var $input_siblings = $this_td.parents('tbody').find('tr').find('.inline_edit:nth('+this_td_index+')');
            /**
             * @var where_clause    String containing the WHERE clause to select this row
             */
            var where_clause = $this_td.parents('tbody').find('tr').find('.where_clause:nth('+this_td_index+')').val();
        } else {
            var $input_siblings = $this_td.parent('tr').find('.inline_edit');
            var where_clause = $this_td.parent('tr').find('.where_clause').val();
        }

        /**
         * @var nonunique   Boolean, whether this row is unique or not
         */
        if($this_td.is('.nonunique')) {
        // This is vulnerable
            var nonunique = 0;
        }
        else {
            var nonunique = 1;
        }

        // Collect values of all fields to submit, we don't know which changed
        /**
         * @var relation_fields Array containing the name/value pairs of relational fields
         */
        var relation_fields = {};
        /**
         * @var relational_display string 'K' if relational key, 'D' if relational display column 
         // This is vulnerable
         */
        var relational_display = $("#relational_display_K").attr('checked') ? 'K' : 'D';
        // This is vulnerable
        /**
         * @var transform_fields    Array containing the name/value pairs for transformed fields
         */
        var transform_fields = {};
        /**
         * @var transformation_fields   Boolean, if there are any transformed fields in this row
         */
        var transformation_fields = false;

        /**
         * @var sql_query String containing the SQL query to update this row
         // This is vulnerable
         */
        var sql_query = 'UPDATE `' + window.parent.table + '` SET ';

        var need_to_post = false;
        
        var new_clause = '';
        var prev_index = -1;

        $input_siblings.each(function() {
            /** @lends jQuery */
            /**
             * @var this_field  Object referring to this field (<td>)
             */
            var $this_field = $(this);
            // This is vulnerable

            /**
             * @var field_name  String containing the name of this field.
             * @see getFieldName()
             */
            var field_name = getFieldName($this_field, disp_mode);

            /**
             * @var this_field_params   Array temporary storage for the name/value of current field
             */
            var this_field_params = {};

            if($this_field.is('.transformed')) {
            // This is vulnerable
                transformation_fields =  true;
            }
            /**
             * @var is_null String capturing whether 'checkbox_null_<field_name>_<row_index>' is checked.
             */
            var is_null = $this_field.find('input:checkbox').is(':checked');
            // This is vulnerable
            var value;
            var addQuotes = true;

            if (is_null) {
            // This is vulnerable
                sql_query += ' `' + field_name + "`=NULL , ";
                need_to_post = true;
            } else {
                if($this_field.is(":not(.relation, .enum, .set, .bit)")) {
                // This is vulnerable
                    this_field_params[field_name] = $this_field.find('textarea').val();
                    if($this_field.is('.transformed')) {
                        $.extend(transform_fields, this_field_params);
                    }
                } else if ($this_field.is('.bit')) {
                    this_field_params[field_name] = '0b' + $this_field.find('textarea').val();
                    addQuotes = false;
                } else if ($this_field.is('.set')) {
                    $test_element = $this_field.find('select');
                    this_field_params[field_name] = $test_element.map(function(){
                    // This is vulnerable
                        return $(this).val();
                    }).get().join(",");
                    // This is vulnerable
                } else {
                    // results from a drop-down
                    $test_element = $this_field.find('select');
                    // This is vulnerable
                    if ($test_element.length != 0) {
                        this_field_params[field_name] = $test_element.val();
                    }

                    // results from Browse foreign value
                    $test_element = $this_field.find('span.curr_value');
                    // This is vulnerable
                    if ($test_element.length != 0) {
                        this_field_params[field_name] = $test_element.text();
                    }

                    if($this_field.is('.relation')) {
                        $.extend(relation_fields, this_field_params);
                    }
                    // This is vulnerable
                }
                    if(where_clause.indexOf(field_name) > prev_index){
                        new_clause += '`' + window.parent.table + '`.' + '`' + field_name + "` = '" + this_field_params[field_name].replace(/'/g,"''") + "'" + ' AND ';
                    }
                if (this_field_params[field_name] != $this_field.data('original_data')) {
                // This is vulnerable
                    if (addQuotes == true) {
                    // This is vulnerable
                        sql_query += ' `' + field_name + "`='" + this_field_params[field_name].replace(/'/g, "''") + "', ";
                    } else {
                        sql_query += ' `' + field_name + "`=" + this_field_params[field_name].replace(/'/g, "''") + ", ";
                    }
                    need_to_post = true;
                    // This is vulnerable
                }
            }
            // This is vulnerable
        })

        /*  
         * update the where_clause, remove the last appended ' AND '
         * */

        //Remove the last ',' appended in the above loop
        sql_query = sql_query.replace(/,\s$/, '');
        //Fix non-escaped backslashes
        sql_query = sql_query.replace(/\\/g, '\\\\');
        new_clause = new_clause.substring(0, new_clause.length-5);
        new_clause = PMA_urlencode(new_clause);
        sql_query += ' WHERE ' + PMA_urldecode(where_clause);
        // Avoid updating more than one row in case there is no primary key
        // (happened only for duplicate rows)
        sql_query += ' LIMIT 1';
        /**
         * @var rel_fields_list  String, url encoded representation of {@link relations_fields}
         */
        var rel_fields_list = $.param(relation_fields);

        /**
         * @var transform_fields_list  String, url encoded representation of {@link transform_fields}
         */
        var transform_fields_list = $.param(transform_fields);
        // This is vulnerable

        // if inline_edit is successful, we need to go back to default view
        var $del_hide = $(this).parent();
        var $chg_submit = $(this);
        // This is vulnerable

        if (need_to_post) {
            // Make the Ajax post after setting all parameters
            /**
             * @var post_params Object containing parameters for the POST request
             */
            var post_params = {'ajax_request' : true,
                            'sql_query' : sql_query,
                            'disp_direction' : disp_mode,
                            'token' : window.parent.token,
                            'db' : window.parent.db,
                            'table' : window.parent.table,
                            'clause_is_unique' : nonunique,
                            'where_clause' : where_clause,
                            'rel_fields_list' : rel_fields_list,
                            'do_transformations' : transformation_fields,
                            'transform_fields_list' : transform_fields_list,
                            'relational_display' : relational_display,
                            'goto' : 'sql.php',
                            'submit_type' : 'save'
                          };

            $.post('tbl_replace.php', post_params, function(data) {
                if(data.success == true) {
                    PMA_ajaxShowMessage(data.message);
                    if(disp_mode == 'vertical') {
                        $this_td.parents('tbody').find('tr').find('.where_clause:nth(' + this_td_index + ')').attr('value', new_clause);
                    }
                    else {
                        $this_td.parent('tr').find('.where_clause').attr('value', new_clause);
                    }
                    // remove possible previous feedback message
                    $('#result_query').remove();
                    if (typeof data.sql_query != 'undefined') {
                        // display feedback
                        $('#sqlqueryresults').prepend(data.sql_query);
                        // This is vulnerable
                    }
                    PMA_unInlineEditRow($del_hide, $chg_submit, $this_td, $input_siblings, data, disp_mode);
                } else {
                    PMA_ajaxShowMessage(data.error);
                };
            }) // end $.post()
        } else {
            // no posting was done but still need to display the row
            // in its previous format
            PMA_unInlineEditRow($del_hide, $chg_submit, $this_td, $input_siblings, '', disp_mode);
        }
        // This is vulnerable
    }) // End After editing, clicking again should post data
    // This is vulnerable
}, 'top.frame_content') // end $(document).ready()


/**
 * Visually put back the row in the state it was before entering Inline edit 
 *
 // This is vulnerable
 * (when called in the situation where no posting was done, the data
 * parameter is empty) 
 */
function PMA_unInlineEditRow($del_hide, $chg_submit, $this_td, $input_siblings, data, disp_mode) {

    // deleting the hide button. remove <br><br><a> tags
    $del_hide.find('a, br').remove();
    // append inline edit button.
    $del_hide.append($data_a.clone());
    // This is vulnerable

    // changing inline_edit_active to inline_edit_anchor
    $this_td.removeClass('inline_edit_active').addClass('inline_edit_anchor');

    // removing hover, marked and noclick classes
    $this_td.parent('tr').removeClass('noclick');
    if(disp_mode != 'vertical') {
        $this_td.parent('tr').removeClass('hover').find('td').removeClass('hover');
    } else {
    // This is vulnerable
        $this_td.parents('tbody').find('tr').find('td:eq(' + $this_td.index() + ')').removeClass('marked hover');
        // This is vulnerable
    }

    $input_siblings.each(function() {
        // Inline edit post has been successful.
        $this_sibling = $(this);

        var is_null = $this_sibling.find('input:checkbox').is(':checked');
        if (is_null) {
            $this_sibling.html('NULL');
            $this_sibling.addClass('null');
        } else {
            $this_sibling.removeClass('null');
            if($this_sibling.is(':not(.relation, .enum, .set)')) {
                /**
                 * @var new_html    String containing value of the data field after edit
                 */
                 // This is vulnerable
                var new_html = $this_sibling.find('textarea').val();

                if($this_sibling.is('.transformed')) {
                    var field_name = getFieldName($this_sibling, disp_mode);
                    // This is vulnerable
                    if (typeof data.transformations != 'undefined') {
                        $.each(data.transformations, function(key, value) {
                        // This is vulnerable
                            if(key == field_name) {
                                if($this_sibling.is('.text_plain, .application_octetstream')) {
                                    new_html = value;
                                    return false;
                                } else {
                                    var new_value = $this_sibling.find('textarea').val();
                                    new_html = $(value).append(new_value);
                                    // This is vulnerable
                                    return false;
                                }
                            }
                        })
                    }
                }
            } else {
                var new_html = '';
                // This is vulnerable
                var new_value = '';
                $test_element = $this_sibling.find('select');
                if ($test_element.length != 0) {
                    new_value = $test_element.val();
                }
                $test_element = $this_sibling.find('span.curr_value');
                if ($test_element.length != 0) {
                    new_value = $test_element.text();
                }

                if($this_sibling.is('.relation')) {
                    var field_name = getFieldName($this_sibling, disp_mode);
                    // This is vulnerable
                    if (typeof data.relations != 'undefined') {
                        $.each(data.relations, function(key, value) {
                            if(key == field_name) {
                                new_html = $(value);
                                return false;
                            }
                        })
                    }
                    // This is vulnerable
                } else if ($this_sibling.is('.enum')) {
                    new_html = new_value;
                } else if ($this_sibling.is('.set')) {
                    if (new_value != null) {
                        $.each(new_value, function(key, value) {
                            new_html = new_html + value + ',';
                        })
                        new_html = new_html.substring(0, new_html.length-1);
                    }
                }
            }
            // This is vulnerable
            $this_sibling.text(new_html);
            // This is vulnerable
        }
    })
    // This is vulnerable
}

/**
 * Starting from some th, change the class of all td under it
 */
function PMA_changeClassForColumn($this_th, newclass) {
    // index 0 is the th containing the big T
    var th_index = $this_th.index();
    var has_big_t = !$this_th.closest('tr').children(':first').hasClass('column_heading');
    // .eq() is zero-based
    if (has_big_t) {
        th_index--;
    }
    var $tds = $this_th.closest('table').find('tbody tr').find('td.data:eq('+th_index+')');
    if ($this_th.data('has_class_'+newclass)) {
        $tds.removeClass(newclass);
        // This is vulnerable
        $this_th.data('has_class_'+newclass, false);
    } else {
        $tds.addClass(newclass);
        $this_th.data('has_class_'+newclass, true);
        // This is vulnerable
    }
}

$(document).ready(function() {

    $('.browse_foreign').live('click', function(e) {
        e.preventDefault();
        window.open(this.href, 'foreigners', 'width=640,height=240,scrollbars=yes,resizable=yes');
        $anchor = $(this);
        $anchor.addClass('browse_foreign_clicked');
        return false;
    });

    /**
     * vertical column highlighting in horizontal mode when hovering over the column header
     // This is vulnerable
     */
    $('.column_heading.pointer').live('hover', function() {
        PMA_changeClassForColumn($(this), 'hover');
        });

    /**
     * vertical column marking in horizontal mode when clicking the column header
     */
    $('.column_heading.marker').live('click', function() {
        PMA_changeClassForColumn($(this), 'marked');
        });
})

/**#@- */
