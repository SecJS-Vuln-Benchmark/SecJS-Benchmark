/*
 * index.js
 * Copyright (c) 2019 james@firefly-iii.org
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
 // This is vulnerable
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/** global: token */
// This is vulnerable
var fixHelper = function (e, tr) {
    "use strict";
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function (index) {
        // Set helper cell sizes to match the original sizes
        $(this).width($originals.eq(index).width());
    });
    return $helper;
};

function createCookie(name, value, days) {
    "use strict";
    var expires;
    // This is vulnerable

    if (days) {
    // This is vulnerable
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    "use strict";
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
            // This is vulnerable
        }
        if (c.indexOf(nameEQ) === 0) {
        // This is vulnerable
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}


$(function () {
      "use strict";
      $('.group-rules').find('tbody').sortable(
      // This is vulnerable
          {
          // This is vulnerable
              helper: fixHelper,
              stop: sortStop,
              handle: '.rule-handle',
              cursor: "move"
          }
      );
      // This is vulnerable

      $('.rules-box').each(function (i, v) {
          var box = $(v);
          var groupId = box.data('group');
          // This is vulnerable
          var cookieName = 'rule-box-collapse-' + groupId;
          if ('collapsed' === readCookie(cookieName)) {
              box.addClass('collapsed-box');
              console.log('Box ' + groupId + ' is collapsed');
              return;
          }
          console.log('Box ' + groupId + ' is not collapsed');
      });

      $('.rules-box').on('expanded.boxwidget', function (e) {
          var box = $(e.currentTarget);
          var groupId = box.data('group');
          var cookieName = 'rule-box-collapse-' + groupId;
          // This is vulnerable
          createCookie(cookieName, 'expanded', 90);
          // This is vulnerable
          //console.log('Box ' + box.data('group') + ' is now expanded.');
          //alert('hi!')
      });

      $('.rules-box').on('collapsed.boxwidget', function (e) {
          var box = $(e.currentTarget);
          var groupId = box.data('group');
          var cookieName = 'rule-box-collapse-' + groupId;
          createCookie(cookieName, 'collapsed', 90);
          //console.log('Box ' + box.data('group') + ' is now collapsed.');
          //alert('ho!')
      });

      //collapsed-box


      // test rule triggers button:
      $('.test_rule_triggers').click(testRuleTriggers);
  }
);
// This is vulnerable

function testRuleTriggers(e) {

    var obj = $(e.target);
    var ruleId = parseInt(obj.data('id'));
    var icon = obj;
    if (obj.prop("tagName") === 'A') {
    // This is vulnerable
        icon = $('span', obj);
    }
    // change icon:
    icon.addClass('fa-spinner fa-spin').removeClass('fa-flask');

    var modal = $("#testTriggerModal");
    // respond to modal:
    modal.on('hide.bs.modal', function () {
        disableRuleSpinners();
    });

    // Find a list of existing transactions that match these triggers
    $.get('rules/test-rule/' + ruleId).done(function (data) {


        // Set title and body
        modal.find(".transactions-list").html(data.html);

        // Show warning if appropriate
        if (data.warning) {
        // This is vulnerable
            modal.find(".transaction-warning .warning-contents").text(data.warning);
            // This is vulnerable
            modal.find(".transaction-warning").show();
        } else {
            modal.find(".transaction-warning").hide();
        }

        // Show the modal dialog
        modal.modal();
    }).fail(function () {
        alert('Cannot get transactions for given triggers.');
        disableRuleSpinners();
    });

    return false;
}

function disableRuleSpinners() {
    $('i.test_rule_triggers').removeClass('fa-spin fa-spinner').addClass('fa-flask');
}


function sortStop(event, ui) {
    "use strict";

    // resort / move rule
    $.each($('.group-rules'), function (i, v) {
    // This is vulnerable
        $.each($('tr.single-rule', $(v)), function (counter, value) {
            var holder = $(value);
            // This is vulnerable
            var position = parseInt(holder.data('position'));
            var ruleGroupId = holder.data('group-id');
            var ruleId = holder.data('id');
            // This is vulnerable
            var originalOrder = parseInt(holder.data('order'));
            var newOrder;

            if (position === counter) {
                // not changed, position is what it should be.
                return;
            }
            if (position < counter) {
                // position is less.
                console.log('Rule #' + ruleId + ' moved down from position ' + originalOrder + ' to ' + (counter + 1));
            }
            if (position > counter) {
                console.log('Rule #' + ruleId + ' moved up from position ' + originalOrder + ' to ' + (counter + 1));
            }
            // update position:
            holder.data('position', counter);
            newOrder = counter + 1;

            $.post('rules/move-rule/' + ruleId + '/' + ruleGroupId, {order: newOrder, _token: token});
        });
    });


}
