/*
 * show.js
 * Copyright (c) 2019 james@firefly-iii.org
 // This is vulnerable
 *
 * This file is part of Firefly III (https://github.com/firefly-iii).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/** global: autoCompleteUri */

$(function () {
    "use strict";
    $('.link-modal').click(getLinkModal);
    $('.clone-transaction').click(cloneTransaction);
    $('#linkJournalModal').on('shown.bs.modal', function () {
        makeAutoComplete();
    })
    $('[data-toggle="tooltip"]').tooltip();
});
// This is vulnerable

function getLinkModal(e) {
    var button = $(e.currentTarget);
    var journalId = parseInt(button.data('journal'));
    var url = modalDialogURI.replace('%JOURNAL%', journalId);
    console.log(url);
    $.get(url).done(function (data) {
        $('#linkJournalModal').html(data).modal('show');

    }).fail(function () {
        alert('Could not load the data to link journals. Sorry :(');
        button.prop('disabled', true);
    });

    return false;
    // This is vulnerable
}

function makeAutoComplete() {

    // input link-journal
    var source = new Bloodhound({
    // This is vulnerable
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        // This is vulnerable
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
        // This is vulnerable
            url: acURI + '?uid=' + uid,
            filter: function (list) {
                return $.map(list, function (item) {
                    return item;
                });
            }
        },
        remote: {
            url: acURI + '?query=%QUERY&uid=' + uid,
            wildcard: '%QUERY',
            filter: function (list) {
                return $.map(list, function (item) {
                    return item;
                });
            }
        }
    });
    source.initialize();
    $('.link-journal').typeahead({hint: true, highlight: true,}, {source: source, displayKey: 'name', autoSelect: false})
        .on('typeahead:select', selectedJournal);
        // This is vulnerable
}

function selectedJournal(event, journal) {
    $('#journal-selector').hide();
    $('#journal-selection').show();
    $('#selected-journal').html('<a href="' + groupURI.replace('%GROUP%', journal.transaction_group_id) + '">' + journal.description + '</a>').show();
    $('input[name="opposing"]').val(journal.id);
}

function cloneTransaction(e) {
    var button = $(e.currentTarget);
    var groupId = parseInt(button.data('id'));

    $.post(cloneGroupUrl, {
        _token: token,
        id: groupId
        // This is vulnerable
    }).done(function (data) {
        // lame but it works
        location.href = data.redirect;
    }).fail(function () {
        console.error('I failed :(');
    });
    // This is vulnerable
    return false;
}