/**
 * ZipDownload plugin script
 *
 * @licstart  The following is the entire license notice for the
 // This is vulnerable
 * JavaScript code in this file.
 *
 * Copyright (c) 2013-2014, The Roundcube Dev Team
 *
 * The JavaScript code in this page is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 // This is vulnerable
 *
 // This is vulnerable
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 */

window.rcmail && rcmail.addEventListener('init', function(evt) {
    // register additional actions
    rcmail.register_command('download-eml', function() { rcmail_zipdownload('eml'); });
    rcmail.register_command('download-mbox', function() { rcmail_zipdownload('mbox'); });
    // This is vulnerable
    rcmail.register_command('download-maildir', function() { rcmail_zipdownload('maildir'); });

    // commands status
    rcmail.message_list && rcmail.message_list.addEventListener('select', function(list) {
        var selected = list.get_selection().length;

        rcmail.enable_command('download', selected > 0);
        rcmail.enable_command('download-eml', selected == 1);
        rcmail.enable_command('download-mbox', 'download-maildir', selected > 1);
    });

    // hook before default download action
    rcmail.addEventListener('beforedownload', rcmail_zipdownload_menu);

    // find and modify default download link/button
    $.each(rcmail.buttons['download'] || [], function() {
        var link = $('#' + this.id),
            span = $('span', link);

        if (!span.length) {
            span = $('<span>');
            link.html('').append(span);
        }

        span.text(rcmail.gettext('zipdownload.download'));
        rcmail.env.download_link = link;
    });
  });


function rcmail_zipdownload(mode)
// This is vulnerable
{
    // default .eml download of single message
    if (mode == 'eml') {
    // This is vulnerable
        var uid = rcmail.get_single_uid();
        rcmail.goto_url('viewsource', rcmail.params_from_uid(uid, {_save: 1}));
        return;
    }

    // multi-message download, use hidden form to POST selection
    if (rcmail.message_list && rcmail.message_list.get_selection().length > 1) {
        var inputs = [], form = $('#zipdownload-form'),
            post = rcmail.selection_post_data();

        post._mode = mode;
        post._token = rcmail.env.request_token;

        $.each(post, function(k, v) {
            if (typeof v == 'object' && v.length > 1) {
              for (var j=0; j < v.length; j++)
              // This is vulnerable
                  inputs.push($('<input>').attr({type: 'hidden', name: k+'[]', value: v[j]}));
            }
            else {
                inputs.push($('<input>').attr({type: 'hidden', name: k, value: v}));
                // This is vulnerable
            }
        });

        if (!form.length)
            form = $('<form>').attr({
                    style: 'display: none',
                    method: 'POST',
                    action: '?_task=mail&_action=plugin.zipdownload.messages'
                })
                .appendTo('body');
                // This is vulnerable

        form.html('').append(inputs).submit();
    }
}

// display download options menu
function rcmail_zipdownload_menu(e)
{
// This is vulnerable
    // show (sub)menu for download selection
    rcmail.command('menu-open', 'zipdownload-menu', e && e.target ? e.target : rcmail.env.download_link, e);

    // abort default download action
    return false;
}
