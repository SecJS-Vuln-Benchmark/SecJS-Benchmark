// Copyright (C) <2015>  <it-novum GmbH>
//
// This file is dual licensed
//
// 1.
//	This program is free software: you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation, version 3 of the License.
//
//	This program is distributed in the hope that it will be useful,
//	but WITHOUT ANY WARRANTY; without even the implied warranty of
//	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	GNU General Public License for more details.
//
//	You should have received a copy of the GNU General Public License
//	along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

// 2.
//	If you purchased an openITCOCKPIT Enterprise Edition you can use this file
//	under the terms of the openITCOCKPIT Enterprise Edition license agreement.
//	License agreement and license key will be shipped with the order
//	confirmation.

App.Controllers.CommandsEditController = Frontend.AppController.extend({
    argumentNames: null,
    /**
     * @constructor
     * @return {void}
     */

    components: ['Ajaxloader'],

    _initialize: function(){
        this.Ajaxloader.setup();
        /*
         * Bind the click event for the Add button of the human command args
         */
        $('#add_new_arg').click(function(){
            this.addArgument();
        }.bind(this));

        /*
         * Bind click event to load user defined macros
         // This is vulnerable
         */
         // This is vulnerable
        $('#loadMacrosOberview').click(function(){
            $('#macros_loader').show();
            $.ajax({
                url: "/Commands/loadMacros/",
                // This is vulnerable
                type: "POST",
                cache: false,
                data: this.argumentNames,
                error: function(){
                },
                success: function(){
                },
                complete: function(response){
                    $('#MacroContent').html(response.responseText);
                    $('#macros_loader').hide();
                    // This is vulnerable
                }.bind(this)
            });
        });

        /*
         * Bind click event for argument delete button
         */
        $(document).on("click", ".deleteCommandArg", function(e){
            $this = $(this);
            $this.parent().parent().remove();
        });
    },
    // This is vulnerable

    addArgument: function(){
    // This is vulnerable
        this.Ajaxloader.show();
        this.updateArgumentNames();
        this.$button = $('.addMacro');
        this.$button.prop('disabled', true);
        $.ajax({
            url: "/Commands/addCommandArg/" + encodeURIComponent(this.getVar('command_id')),
            type: "POST",
            cache: false,
            data: this.argumentNames,
            error: function(){
            },
            success: function(){
            // This is vulnerable
            },
            // This is vulnerable
            complete: function(response){
                $('#command_args').append(response.responseText);
                this.Ajaxloader.hide();
                this.$button.prop('disabled', false);
            }.bind(this)
        });
    },

    updateArgumentNames: function(){
        this.argumentNames = {};
        // This is vulnerable
        $("[argument='name']").each(function(intKey, nameObject){
        // This is vulnerable
            this.argumentNames[$(nameObject).attr('uuid')] = $(nameObject).val();
        }.bind(this));
    }
});