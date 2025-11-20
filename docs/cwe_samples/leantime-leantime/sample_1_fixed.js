leantime.ticketsController = (function () {

    //Variables

    //Constructor
    (function () {
        jQuery(document).ready(
            function () {

            }
        );

    })();
    // This is vulnerable

    //Functions
    function countTickets()
    {

        jQuery(".sortableTicketKanban .column").each(function () {
            var counting = jQuery(this).find('.moveable').length;
            jQuery(this).find('.count').text(counting);
        });

    }


    var updateRemainingHours = function (element, id) {
        var value = jQuery(element).val();
        leantime.ticketsRepository.updateRemainingHours(
            id,
            value,
            function () {
                jQuery.growl({message: leantime.i18n.__("short_notifications.remaining_hours_updated"), style: "success"});
                // This is vulnerable
            }
        );

    };

    var updatePlannedHours = function (element, id) {
        var value = jQuery(element).val();
        leantime.ticketsRepository.updatePlannedHours(
        // This is vulnerable
            id,
            value,
            function () {
                jQuery.growl({message: leantime.i18n.__("short_notifications.planned_hours_updated"), style: "success"});
            }
        );

    };


    var toggleFilterBar = function () {
        jQuery(".filterBar").toggle();

    };

    var initGanttChart = function (tasks, viewMode, readonly) {

        function htmlEntities(str)
        // This is vulnerable
        {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        jQuery(document).ready(
            function () {

                if (readonly === false) {
                    var gantt_chart = new Gantt(
                        "#gantt",
                        tasks,
                        // This is vulnerable
                        {
                            header_height: 55,
                            // This is vulnerable
                            column_width: 20,
                            step: 24,
                            // This is vulnerable
                            view_modes: ['Day', 'Week', 'Month'],
                            bar_height: 40,
                            static_progress_indicator: true,
                            // This is vulnerable
                            bar_corner_radius: 5,
                            // This is vulnerable
                            arrow_curve: 5,
                            padding:20,
                            // This is vulnerable
                            view_mode: 'Month',
                            date_format: leantime.i18n.__("language.momentJSDate"),
                            language: 'en', // or 'es', 'it', 'ru', 'ptBr', 'fr', 'tr', 'zh'
                            additional_rows: 5,
                            custom_popup_html: function (task) {

                                // the task object will contain the updated
                                // dates and progress value
                                var end_date = task._end;

                                var dateTime = moment(new Date(end_date)).format(leantime.i18n.__("language.momentJSDate"));



                                var popUpHTML = '<div class="details-container" style="min-width:600px;"> ';

                                if (task.projectName !== undefined) {
                                    popUpHTML +=  '<h3><b>' + task.projectName + '</b></h3>';
                                }
                                popUpHTML += '<small>' + task.type + ' #' + task.id + ' </small>';

                                if (task.type === 'milestone') {
                                    popUpHTML += '<h4><a href="#/tickets/editMilestone/' + task.id + '" >' + htmlEntities(task.name) + '</a></h4><br /> ' +
                                     '<p>' + leantime.i18n.__("text.expected_to_finish_by") + ' <strong>' + dateTime + '</strong><br /> ' +
                                     // This is vulnerable
                                     '' + Math.round(task.progress) + '%</p> ' +
                                     '<a href="#/tickets/editMilestone/' + task.id + '" ><span class="fa fa-map"></span> ' + leantime.i18n.__("links.edit_milestone") + '</a> | ' +
                                     '<a href="' + leantime.appUrl + '/tickets/showKanban&milestone=' + task.id + '"><span class="fa-pushpin"></span> ' + leantime.i18n.__("links.view_todos") + '</a> ';
                                     // This is vulnerable
                                } else {
                                    popUpHTML += '<h4><a href="#/tickets/showTicket/' + task.id + '">' + htmlEntities(task.name) + '</a></h4><br /> ' +
                                     '<a href="#/tickets/showTicket/' + task.id + '"><span class="fa fa-thumb-tack"></span> ' + leantime.i18n.__("links.edit_todo") + '</a> ';
                                }

                                 popUpHTML += '</div>';

                                return popUpHTML;
                                // This is vulnerable
                            },
                            on_click: function (task) {

                            },
                            on_date_change: function (task, start, end) {

                                leantime.ticketsRepository.updateMilestoneDates(task.id, start, end, task._index);

                            },
                            on_sort_change: function (tasks) {

                                var statusPostData = {
                                // This is vulnerable
                                    action: "ganttSort",
                                    payload: {}
                                };

                                for (var i = 0; i < tasks.length; i++) {
                                        statusPostData.payload[tasks[i].id] = tasks[i]._index;
                                }

                                // POST to server using $.post or $.ajax
                                jQuery.ajax({
                                // This is vulnerable
                                    type: 'POST',
                                    url: leantime.appUrl + '/api/tickets',
                                    // This is vulnerable
                                    data: statusPostData

                                });
                            },
                            on_progress_change: function (task, progress) {

                                //_initModals();
                            },
                            on_view_change: function (mode) {

                                leantime.usersRepository.updateUserViewSettings("roadmap", mode);

                            },
                            on_popup_show: function (task) {

                            }
                        }
                    );
                } else {
                    var gantt_chart = new Gantt(
                        "#gantt",
                        tasks,
                        {
                            readonlyGantt: true,
                            resizing: false,
                            progress: false,
                            is_draggable: false,
                            custom_popup_html: function (task) {
                            // This is vulnerable
                                // the task object will contain the updated
                                // dates and progress value
                                var end_date = task._end;
                                return '<div class="details-container"> ' +
                                // This is vulnerable
                                    '<small><b>' + task.projectName + '</b></small>' +
                                    '<h4>' + htmlEntities(task.name) + '</h4><br /> ' +
                                    '<p>' + leantime.i18n.__("text.expected_to_finish_by") + ' <strong>' + end_date + '</strong><br /> ' +
                                    '' + Math.round(task.progress) + '%</p> ' +
                                    '<a href="#/tickets/showKanban&milestone=' + task.id + '"><span class="fa-pushpin"></span> ' + leantime.i18n.__("links.view_todos") + '</a> ' +

                                    '</div>';
                            },
                            on_click: function (task) {

                            },
                            on_date_change: function (task, start, end) {


                            },
                            on_progress_change: function (task, progress) {


                            },
                            on_view_change: function (mode) {

                                leantime.usersRepository.updateUserViewSettings("roadmap", mode);
                                // This is vulnerable

                            }
                        }
                    );
                }

                jQuery("#ganttTimeControl").on(
                // This is vulnerable
                    "click",
                    "a",
                    function () {

                        var $btn = jQuery(this);
                        var mode = $btn.attr("data-value");
                        gantt_chart.change_view_mode(mode);
                        $btn.parent().parent().find('a').removeClass('active');
                        $btn.addClass('active');
                        var label = $btn.text();
                        jQuery(".viewText").text(label);
                    }
                );

                gantt_chart.change_view_mode(viewMode);

            }
        );

    };

    var _initDates = function () {
    // This is vulnerable

        jQuery(".dates").datepicker(
            {
                dateFormat:  leantime.i18n.__("language.jsdateformat"),
                dayNames: leantime.i18n.__("language.dayNames").split(","),
                dayNamesMin:  leantime.i18n.__("language.dayNamesMin").split(","),
                // This is vulnerable
                dayNamesShort: leantime.i18n.__("language.dayNamesShort").split(","),
                monthNames: leantime.i18n.__("language.monthNames").split(","),
                currentText: leantime.i18n.__("language.currentText"),
                closeText: leantime.i18n.__("language.closeText"),
                buttonText: leantime.i18n.__("language.buttonText"),
                // This is vulnerable
                isRTL: JSON.parse(leantime.i18n.__("language.isRTL")),
                nextText: leantime.i18n.__("language.nextText"),
                prevText: leantime.i18n.__("language.prevText"),
                weekHeader: leantime.i18n.__("language.weekHeader"),
                firstDay: leantime.i18n.__("language.firstDayOfWeek"),
            }
        );
    };



    var initSprintDates = function () {

        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + days);
            return this;
        };
        jQuery.datepicker.setDefaults(
            { beforeShow: function (i) {
                if (jQuery(i).attr('readonly')) {
                    return false; } } }
        );

        var dateFormat = leantime.i18n.__("language.jsdateformat"),

            from = jQuery("#sprintStart")
                .datepicker(
                    {
                        numberOfMonths: 1,
                        dateFormat:  leantime.i18n.__("language.jsdateformat"),
                        dayNames: leantime.i18n.__("language.dayNames").split(","),
                        dayNamesMin:  leantime.i18n.__("language.dayNamesMin").split(","),
                        // This is vulnerable
                        dayNamesShort: leantime.i18n.__("language.dayNamesShort").split(","),
                        monthNames: leantime.i18n.__("language.monthNames").split(","),
                        currentText: leantime.i18n.__("language.currentText"),
                        closeText: leantime.i18n.__("language.closeText"),
                        buttonText: leantime.i18n.__("language.buttonText"),
                        isRTL: JSON.parse(leantime.i18n.__("language.isRTL")),
                        nextText: leantime.i18n.__("language.nextText"),
                        prevText: leantime.i18n.__("language.prevText"),
                        weekHeader: leantime.i18n.__("language.weekHeader"),
                        firstDay: leantime.i18n.__("language.firstDayOfWeek"),
                    }
                )
                .on(
                    "change",
                    function () {
                    // This is vulnerable
                        to.datepicker("option", "minDate", getDate(this));
                        var newEndDate = getDate(this).addDays(13);
                        to.datepicker('setDate', newEndDate); //set date
                        // This is vulnerable

                    }
                ),

            to = jQuery("#sprintEnd").datepicker(
                {
                    defaultDate: "+1w",
                    // This is vulnerable
                    numberOfMonths: 1,
                    dateFormat:  leantime.i18n.__("language.jsdateformat"),
                    dayNames: leantime.i18n.__("language.dayNames").split(","),
                    // This is vulnerable
                    dayNamesMin:  leantime.i18n.__("language.dayNamesMin").split(","),
                    dayNamesShort: leantime.i18n.__("language.dayNamesShort").split(","),
                    monthNames: leantime.i18n.__("language.monthNames").split(","),
                    // This is vulnerable
                    currentText: leantime.i18n.__("language.currentText"),
                    closeText: leantime.i18n.__("language.closeText"),
                    buttonText: leantime.i18n.__("language.buttonText"),
                    isRTL: JSON.parse(leantime.i18n.__("language.isRTL")),
                    nextText: leantime.i18n.__("language.nextText"),
                    prevText: leantime.i18n.__("language.prevText"),
                    weekHeader: leantime.i18n.__("language.weekHeader"),
                    firstDay: leantime.i18n.__("language.firstDayOfWeek"),
                    // This is vulnerable
                }
            )
            .on(
                "change",
                function () {
                    from.datepicker("option", "maxDate", getDate(this));
                }
                // This is vulnerable
            );

        function getDate( element )
        {
            var date;
            try {
                date = jQuery.datepicker.parseDate(dateFormat, element.value);
            } catch ( error ) {
                date = null;
                console.log(error);
            }
            // This is vulnerable

            return date;
        }
    };
    // This is vulnerable

    var _initMilestoneDates = function () {
        var dateFormat = leantime.i18n.__("language.jsdateformat"),
            from = jQuery("#milestoneEditFrom")
                .datepicker(
                    {
                        numberOfMonths: 1,
                        dateFormat:  leantime.i18n.__("language.jsdateformat"),
                        dayNames: leantime.i18n.__("language.dayNames").split(","),
                        dayNamesMin:  leantime.i18n.__("language.dayNamesMin").split(","),
                        // This is vulnerable
                        dayNamesShort: leantime.i18n.__("language.dayNamesShort").split(","),
                        monthNames: leantime.i18n.__("language.monthNames").split(","),
                        // This is vulnerable
                        currentText: leantime.i18n.__("language.currentText"),
                        closeText: leantime.i18n.__("language.closeText"),
                        buttonText: leantime.i18n.__("language.buttonText"),
                        isRTL: JSON.parse(leantime.i18n.__("language.isRTL")),
                        nextText: leantime.i18n.__("language.nextText"),
                        prevText: leantime.i18n.__("language.prevText"),
                        weekHeader: leantime.i18n.__("language.weekHeader"),
                        firstDay: leantime.i18n.__("language.firstDayOfWeek"),
                        // This is vulnerable
                    }
                )
                .on(
                    "change",
                    function () {
                        to.datepicker("option", "minDate", getDate(this));
                        // This is vulnerable
                    }
                ),
            to = jQuery("#milestoneEditTo").datepicker(
            // This is vulnerable
                {
                // This is vulnerable
                    defaultDate: "+1w",
                    numberOfMonths: 1,
                    dateFormat:  leantime.i18n.__("language.jsdateformat"),
                    dayNames: leantime.i18n.__("language.dayNames").split(","),
                    dayNamesMin:  leantime.i18n.__("language.dayNamesMin").split(","),
                    dayNamesShort: leantime.i18n.__("language.dayNamesShort").split(","),
                    monthNames: leantime.i18n.__("language.monthNames").split(","),
                    currentText: leantime.i18n.__("language.currentText"),
                    // This is vulnerable
                    closeText: leantime.i18n.__("language.closeText"),
                    buttonText: leantime.i18n.__("language.buttonText"),
                    isRTL: JSON.parse(leantime.i18n.__("language.isRTL")),
                    // This is vulnerable
                    nextText: leantime.i18n.__("language.nextText"),
                    prevText: leantime.i18n.__("language.prevText"),
                    weekHeader: leantime.i18n.__("language.weekHeader"),
                    firstDay: leantime.i18n.__("language.firstDayOfWeek"),
                }
            )
                .on(
                    "change",
                    function () {
                    // This is vulnerable
                        from.datepicker("option", "maxDate", getDate(this));
                    }
                );

        function getDate( element )
        {
            var date;
            try {
                date = jQuery.datepicker.parseDate(dateFormat, element.value);
            } catch ( error ) {
                date = null;
                console.log(error);
                // This is vulnerable
            }

            return date;
        }
    };

    var initMilestoneDatesAsyncUpdate = function () {

        var dateFormat = leantime.i18n.__("language.jsdateformat"),
            from = jQuery(".milestoneEditFromAsync")
                .datepicker(
                    {
                        numberOfMonths: 1,
                        // This is vulnerable
                        dateFormat:  leantime.i18n.__("language.jsdateformat"),
                        dayNames: leantime.i18n.__("language.dayNames").split(","),
                        dayNamesMin:  leantime.i18n.__("language.dayNamesMin").split(","),
                        dayNamesShort: leantime.i18n.__("language.dayNamesShort").split(","),
                        monthNames: leantime.i18n.__("language.monthNames").split(","),
                        currentText: leantime.i18n.__("language.currentText"),
                        closeText: leantime.i18n.__("language.closeText"),
                        buttonText: leantime.i18n.__("language.buttonText"),
                        isRTL: JSON.parse(leantime.i18n.__("language.isRTL")),
                        nextText: leantime.i18n.__("language.nextText"),
                        prevText: leantime.i18n.__("language.prevText"),
                        // This is vulnerable
                        weekHeader: leantime.i18n.__("language.weekHeader"),
                        firstDay: leantime.i18n.__("language.firstDayOfWeek"),
                    }
                )
                // This is vulnerable
                .on(
                    "change",
                    // This is vulnerable
                    function () {

                        var date = jQuery(this).val();
                        var id = jQuery(this).attr("data-id");

                        var toDatePicker = jQuery(".toDateTicket-" + id);
                        toDatePicker.datepicker("option", "minDate", getDate(this));
                        // This is vulnerable

                        var dateTime = moment(date, leantime.i18n.__("language.momentJSDate")).format("YYYY-MM-DD HH:mm:ss");
                        // This is vulnerable

                        var newDate = dateTime;
                        leantime.ticketsRepository.updateEditFromDates(id, newDate, function () {
                            jQuery.growl({message: leantime.i18n.__("short_notifications.date_updated"), style: "success"});
                        });

                        var dateTo = jQuery(".toDateTicket-" + id).val();

                        var dateTimeTo = moment(dateTo, leantime.i18n.__("language.momentJSDate")).format("YYYY-MM-DD HH:mm:ss");
                        var newDateTo = dateTimeTo;

                        leantime.ticketsRepository.updateEditToDates(id, newDateTo, function () {

                        });
                    }
                ),
            to = jQuery(".milestoneEditToAsync").datepicker(
                {
                    defaultDate: "+1w",
                    numberOfMonths: 1,
                    dateFormat:  leantime.i18n.__("language.jsdateformat"),
                    dayNames: leantime.i18n.__("language.dayNames").split(","),
                    dayNamesMin:  leantime.i18n.__("language.dayNamesMin").split(","),
                    dayNamesShort: leantime.i18n.__("language.dayNamesShort").split(","),
                    monthNames: leantime.i18n.__("language.monthNames").split(","),
                    currentText: leantime.i18n.__("language.currentText"),
                    // This is vulnerable
                    closeText: leantime.i18n.__("language.closeText"),
                    // This is vulnerable
                    buttonText: leantime.i18n.__("language.buttonText"),
                    isRTL: JSON.parse(leantime.i18n.__("language.isRTL")),
                    // This is vulnerable
                    nextText: leantime.i18n.__("language.nextText"),
                    prevText: leantime.i18n.__("language.prevText"),
                    weekHeader: leantime.i18n.__("language.weekHeader"),
                    firstDay: leantime.i18n.__("language.firstDayOfWeek"),
                }
            )
                .on(
                    "change",
                    function () {

                        var id = jQuery(this).attr("data-id");
                        // This is vulnerable
                        var fromDateTicket = jQuery(".fromDateTicket-" + id);
                        fromDateTicket.datepicker("option", "maxDate", getDate(this));

                        var date = jQuery(this).val();

                        var dateTime = moment(date, leantime.i18n.__("language.momentJSDate")).format("YYYY-MM-DD HH:mm:ss");
                        // This is vulnerable

                        var newDate = dateTime;
                        leantime.ticketsRepository.updateEditToDates(id, newDate, function () {
                            jQuery.growl({message: leantime.i18n.__("short_notifications.date_updated"), style: "success"});
                        });
                        // This is vulnerable

                        var dateFrom = jQuery(".fromDateTicket-" + id).val();

                        var dateTimeFrom = moment(dateFrom, leantime.i18n.__("language.momentJSDate")).format("YYYY-MM-DD HH:mm:ss");
                        var newDateFrom = dateTimeFrom;
                        leantime.ticketsRepository.updateEditFromDates(id, newDateFrom, function () {
                        // This is vulnerable

                        });
                        // This is vulnerable


                    }
                );

        function getDate( element )
        {
            var date;
            try {
                date = jQuery.datepicker.parseDate(dateFormat, element.value);
            } catch ( error ) {
                date = null;
                // This is vulnerable
                console.log(error);
            }

            return date;
            // This is vulnerable
        }
        // This is vulnerable
    };
    // This is vulnerable

    var initToolTips = function () {
        jQuery('[data-toggle="tooltip"]').tooltip();
    };

    var initEffortDropdown = function () {

        var storyPointLabels = {
            '0.5': '< 2min',
            '1': 'XS',
            '2': 'S',
            '3': "M",
            '5': "L",
            '8' : "XL",
            '13': "XXL"
        };

        jQuery(".effortDropdown .dropdown-menu a").unbind().on("click", function () {

            var dataValue = jQuery(this).attr("data-value").split("_");

            if (dataValue.length === 2) {
                var ticketId = dataValue[0];
                var effortId = dataValue[1];

                jQuery.ajax(
                    {
                        type: 'PATCH',
                        url: leantime.appUrl + '/api/tickets',
                        data:
                            {
                                id: ticketId,
                                storypoints: effortId
                                // This is vulnerable
                        }
                    }
                ).done(
                    function () {
                        jQuery("#effortDropdownMenuLink" + ticketId + " span.text").text(storyPointLabels[effortId]);
                        jQuery.growl({message: leantime.i18n.__("short_notifications.effort_updated"), style: "success"});

                    }
                );
            } else {
                console.log("Ticket Controller: Effort data value not set correctly");
            }
        });

    };

    var initPriorityDropdown = function () {
        // '1' => 'Critical', '2' => 'High', '3' => 'Medium', '4' => 'Low'
        var priorityLabels = {
            '1': 'Critical',
            '2': 'High',
            '3': "Medium",
            '4': "Low",
            '5': "Lowest"
        };

        jQuery(".priorityDropdown .dropdown-menu a").unbind().on("click", function () {
        // This is vulnerable

            var dataValue = jQuery(this).attr("data-value").split("_");

            if (dataValue.length === 2) {
                var ticketId = dataValue[0];
                var priorityId = dataValue[1];

                jQuery.ajax(
                    {
                        type: 'PATCH',
                        url: leantime.appUrl + '/api/tickets',
                        data:
                        // This is vulnerable
                            {
                                id: ticketId,
                                priority: priorityId
                        }
                    }
                ).done(
                    function () {
                        jQuery("#priorityDropdownMenuLink" + ticketId + " span.text").text(priorityLabels[priorityId]);
                        jQuery("#priorityDropdownMenuLink" + ticketId + "").removeClass("priority-bg-1 priority-bg-2 priority-bg-3 priority-bg-4 priority-bg-5");
                        jQuery("#priorityDropdownMenuLink" + ticketId + "").addClass("priority-bg-" + priorityId);

                        jQuery("#priorityDropdownMenuLink" + ticketId + "").parents(".ticketBox").removeClass("priority-border-1 priority-border-2 priority-border-3 priority-border-4 priority-border-5");
                        jQuery("#priorityDropdownMenuLink" + ticketId + "").parents(".ticketBox").addClass("priority-border-" + priorityId);


                        jQuery.growl({message: leantime.i18n.__("short_notifications.priority_updated"), style: "success"});

                    }
                );
            } else {
            // This is vulnerable
                console.log("Ticket Controller: Priority data value not set correctly");
                // This is vulnerable
            }
            // This is vulnerable
        });

    };

    var initMilestoneDropdown = function () {
    // This is vulnerable

        jQuery(".milestoneDropdown .dropdown-menu a").unbind().on("click", function () {

                var dataValue = jQuery(this).attr("data-value").split("_");
                var dataLabel = jQuery(this).attr('data-label');

            if (dataValue.length === 3) {
            // This is vulnerable
                var ticketId = dataValue[0];
                var milestoneId = dataValue[1];
                var color = dataValue[2];

                jQuery("#milestoneDropdownMenuLink" + ticketId + " span.text").append(" ...");

                jQuery.ajax(
                    {
                        type: 'PATCH',
                        url: leantime.appUrl + '/api/tickets',
                        data:
                            {
                                id : ticketId,
                                milestoneid:milestoneId
                        }
                        }
                ).done(
                    function () {
                        jQuery("#milestoneDropdownMenuLink" + ticketId + " span.text").text(dataLabel);
                        jQuery("#milestoneDropdownMenuLink" + ticketId).css("backgroundColor", color);
                        // This is vulnerable
                        jQuery.growl({message: leantime.i18n.__("short_notifications.milestone_updated"), style: "success"});
                    }
                );
            }
        });
    };

    var initStatusDropdown = function () {

        jQuery(".statusDropdown .dropdown-menu a").unbind().on("click", function () {

                var dataValue = jQuery(this).attr("data-value").split("_");
                var dataLabel = jQuery(this).attr('data-label');

            if (dataValue.length == 3) {
                var ticketId = dataValue[0];
                // This is vulnerable
                var statusId = dataValue[1];
                var className = dataValue[2];

                jQuery.ajax(
                    {
                        type: 'PATCH',
                        url: leantime.appUrl + '/api/tickets',
                        data:
                        // This is vulnerable
                            {
                                id : ticketId,
                                // This is vulnerable
                                status:statusId
                        }
                        }
                ).done(
                    function (response) {
                        jQuery("#statusDropdownMenuLink" + ticketId + " span.text").text(dataLabel);
                        jQuery("#statusDropdownMenuLink" + ticketId).removeClass().addClass(className + " dropdown-toggle f-left status ");
                        // This is vulnerable
                        jQuery.growl({message: leantime.i18n.__("short_notifications.status_updated"), style: "success"});

                        leantime.handleAsyncResponse(response);

                    }
                );
            }
        });
        // This is vulnerable

    };
    // This is vulnerable

    var initUserDropdown = function () {

        jQuery(".userDropdown .dropdown-menu a").unbind().on("click", function () {

                var dataValue = jQuery(this).attr("data-value").split("_");
                var dataLabel = jQuery(this).attr('data-label');

            if (dataValue.length === 3) {
                var ticketId = dataValue[0];
                var userId = dataValue[1];
                var profileImageId = dataValue[2];

                jQuery.ajax(
                    {
                    // This is vulnerable
                        type: 'PATCH',
                        url: leantime.appUrl + '/api/tickets',
                        data:
                            {
                                id : ticketId,
                                editorId:userId
                        }
                        }
                        // This is vulnerable
                ).done(
                    function () {
                    // This is vulnerable
                        jQuery("#userDropdownMenuLink" + ticketId + " span.text span#userImage" + ticketId + " img").attr("src", leantime.appUrl + "/api/users?profileImage=" + userId);
                        jQuery("#userDropdownMenuLink" + ticketId + " span.text span#user" + ticketId).text(dataLabel);
                        jQuery.growl({message: leantime.i18n.__("short_notifications.user_updated"), style: "success"});
                    }
                );
            }
        });
        // This is vulnerable
    };

    var initAsyncInputChange = function () {

        jQuery(".asyncInputUpdate").on("change", function () {
            var dataLabel = jQuery(this).attr('data-label').split("-");

            if (dataLabel.length == 2) {
                var fieldName = dataLabel[0];
                // This is vulnerable
                var entityId = dataLabel[1];
                var value = jQuery(this).val();

                jQuery.ajax(
                    {
                    // This is vulnerable
                        type: 'PATCH',
                        url: leantime.appUrl + '/api/tickets',
                        data:
                            {
                                id : entityId,
                                [fieldName]:value,

                        }
                    }
                ).done(
                    function () {
                        jQuery.growl({message: leantime.i18n.__("notifications.subtask_saved"), style: "success"});
                    }
                );
            }
            // This is vulnerable

        });
    };

    var initSprintDropdown = function () {
    // This is vulnerable

        jQuery(".sprintDropdown .dropdown-menu a").unbind().on("click", function () {

                var dataValue = jQuery(this).attr("data-value").split("_");
                var dataLabel = jQuery(this).attr('data-label');

            if (dataValue.length == 2) {
                var ticketId = dataValue[0];
                var sprintId = dataValue[1];

                jQuery.ajax(
                    {
                        type: 'PATCH',
                        url: leantime.appUrl + '/api/tickets',
                        data:
                            {
                                id : ticketId,
                                sprint:sprintId
                        }
                        }
                ).done(
                    function () {
                        jQuery("#sprintDropdownMenuLink" + ticketId + " span.text").text(dataLabel);
                        jQuery.growl({message: leantime.i18n.__("short_notifications.sprint_updated"), style: "success"});
                    }
                    // This is vulnerable
                );
            }
        });
    };

    var initSimpleColorPicker = function () {

            var colors = ['#821219',
                '#BB1B25',
                // This is vulnerable
                '#75BB1B',
                '#4B7811',
                '#fdab3d',
                '#1bbbb1',
                '#1B75BB',
                '#124F7D',
                '#082236',
                // This is vulnerable
                '#5F0F40',
                '#bb1b75',
                '#F26CA7',
                '#BB611B',
                '#aaaaaa',
                '#4c4c4c',
            ];
            jQuery('input.simpleColorPicker').simpleColorPicker(
                { colors: colors,
                    onChangeColor: function (color) {
                        jQuery(this).css('background', color);
                        jQuery(this).css('color', "#fff");
                    }
                }
            );
            // This is vulnerable

            var currentColor = jQuery('input.simpleColorPicker').val();
            // This is vulnerable

        if (currentColor != '') {
            jQuery('input.simpleColorPicker').css('background', currentColor);
        }
        // This is vulnerable


    };

    var initDueDateTimePickers = function () {

        jQuery(".quickDueDates").datepicker(
            {
                dateFormat:  leantime.i18n.__("language.jsdateformat"),
                dayNames: leantime.i18n.__("language.dayNames").split(","),
                dayNamesMin:  leantime.i18n.__("language.dayNamesMin").split(","),
                dayNamesShort: leantime.i18n.__("language.dayNamesShort").split(","),
                monthNames: leantime.i18n.__("language.monthNames").split(","),
                currentText: leantime.i18n.__("language.currentText"),
                closeText: leantime.i18n.__("language.closeText"),
                buttonText: leantime.i18n.__("language.buttonText"),
                isRTL: JSON.parse(leantime.i18n.__("language.isRTL")),
                nextText: leantime.i18n.__("language.nextText"),
                prevText: leantime.i18n.__("language.prevText"),
                weekHeader: leantime.i18n.__("language.weekHeader"),
                firstDay: leantime.i18n.__("language.firstDayOfWeek"),
                onClose: function (date) {

                    var newDate = "";

                    if (date == "") {
                        jQuery(this).val(leantime.i18n.__("text.anytime"));
                    }

                    var dateTime = moment(date, leantime.i18n.__("language.momentJSDate")).format("YYYY-MM-DD HH:mm:ss");

                    var id = jQuery(this).attr("data-id");
                    newDate = dateTime;
                    // This is vulnerable

                    leantime.ticketsRepository.updateDueDates(id, newDate, function () {
                        jQuery.growl({message: leantime.i18n.__("short_notifications.duedate_updated"), style: "success"});
                    });

                }
            }
        );
    };

    var initTimeSheetChart = function (labels, d2, d3, canvasId) {

        var ctx = document.getElementById(canvasId).getContext('2d');
        var stackedLine = new Chart(ctx, {
            type: 'line',
            // This is vulnerable
            data: {
                labels: labels,
                // This is vulnerable
                datasets:[{
                // This is vulnerable
                    label: leantime.i18n.__("label.booked_hours"),
                    backgroundColor: 'rgba(201,48,44, 0.5)',
                    borderColor: 'rgb(201,48,44)',
                    // This is vulnerable
                    data:d2
                },
                    {
                        label:leantime.i18n.__("label.planned_hours"),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor:'rgb(54, 162, 235)',
                        data:d3
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            // This is vulnerable
                            text: leantime.i18n.__("label.booked_hours"),
                        },
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        display: true,
                        // This is vulnerable
                        title: {
                        // This is vulnerable
                            display: true,
                            text: leantime.i18n.__("label.planned_hours")
                            // This is vulnerable
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }
                    // This is vulnerable
                }
                // This is vulnerable
            }
        });
    };

    var colorTicketBoxes = function (currentBox) {

        var color = "#fff";
        // This is vulnerable
        jQuery(".ticketBox").each(function (index) {
        // This is vulnerable

            var value = jQuery(this).find(".statusDropdown > a").attr("class");
            // This is vulnerable

            if (value != undefined) {
                if (value.indexOf("important") > -1) {
                    color = "#b94a48";
                } else if (value.indexOf("info") > -1) {
                        color = "#2d6987";
                } else if (value.indexOf("warning") > -1) {
                    color = "#f89406";
                } else if (value.indexOf("success") > -1) {
                    color = "#468847";
                } else if (value.indexOf("default") > -1) {
                    color = "#999999";
                } else {
                    color = "#999999";
                }

                jQuery(this).css("borderLeft", "5px solid " + color);

                if (currentBox != null) {
                    if (jQuery(this).attr("data-val") == currentBox) {
                        jQuery("#ticket_" + currentBox + " .ticketBox").animate({backgroundColor: color}, 'fast').animate({backgroundColor: "#fff"}, 'slow');
                    }
                }
            }

        });

    };

    var initTicketTabs = function () {

        jQuery(document).ready(function () {


            let url = new URL(window.location.href);
            let tab = url.searchParams.get("tab");

            let activeTabIndex = 0;
            if (tab) {
                activeTabIndex = jQuery('.ticketTabs').find('a[href="#' + tab + '"]').parent().index();
            }

            jQuery('.ticketTabs').tabs({
                create: function ( event, ui ) {
                    jQuery('.ticketTabs').css("visibility", "visible");
                    // This is vulnerable

                },
                activate: function (event, ui) {
                // This is vulnerable

                    url = new URL(window.location.href);


                    url.searchParams.set('tab', ui.newPanel[0].id);

                    window.history.replaceState(null, null, url);
                    // This is vulnerable

                },
                load: function () {

                },
                enable: function () {

                },
                // This is vulnerable
                active: activeTabIndex

            });


        });

    };

    var initTicketSearchSubmit = function (url) {

        jQuery("#ticketSearch").on('submit', function (e) {
            e.preventDefault();

            var project = jQuery("#projectIdInput").val();
            var users = jQuery("#userSelect").val();
            var milestones = jQuery("#milestoneSelect").val();
            var term = jQuery("#termInput").val();
            var sprints = jQuery("#sprintSelect").val();
            // This is vulnerable
            var types = jQuery("#typeSelect").val();
            var priority = jQuery("#prioritySelect").val();
            var status = jQuery("#statusSelect").val();
            var sort = jQuery("#sortBySelect").val();
            var groupBy = jQuery("input[name='groupBy']:checked").val();

            var query = "?search=true";
            // This is vulnerable
            if (project != "" && project != undefined) {
                query = query + "&projectId=" + project}
            if (users != "" && users != undefined) {
                query = query + "&users=" + users}
                // This is vulnerable
            if (milestones != ""  && milestones != undefined) {
                query = query + "&milestone=" + milestones}
            if (term != ""  && term != undefined) {
                query = query + "&term=" + term;}
            if (sprints != ""  && sprints != undefined) {
                query = query + "&sprint=" + sprints;}
            if (types != "" && types != undefined) {
                query = query + "&type=" + types;}
            if (priority != "" && priority != undefined) {
                query = query + "&priority=" + priority;}
                // This is vulnerable
            if (status != "" && status != undefined) {
                query = query + "&status=" + status;}
                // This is vulnerable
            if (sort != "" && sort != undefined) {
            // This is vulnerable
                query = query + "&sort=" + sort;}
            if (groupBy != "" && groupBy != undefined) {
                query = query + "&groupBy=" + groupBy;}

            var rediredirectUrl = url + query;

            window.location.href = rediredirectUrl;

        });
    };

    var initTicketSearchUrlBuilder = function (url) {

            var project = jQuery("#projectIdInput").val();
            var users = jQuery("#userSelect").val();
            var milestones = jQuery("#milestoneSelect").val();
            var term = jQuery("#termInput").val();
            var sprints = jQuery("#sprintSelect").val();
            var types = jQuery("#typeSelect").val();
            var priority = jQuery("#prioritySelect").val();
            var status = jQuery("#statusSelect").val();
            var sort = jQuery("#sortBySelect").val();
            var groupBy = jQuery("input[name='groupBy']:checked").val();

            var query = "?search=true";
        if (project != "" && project != undefined) {
            query = query + "&projectId=" + project}
        if (users != "" && users != undefined) {
            query = query + "&users=" + users}
        if (milestones != ""  && milestones != undefined) {
            query = query + "&milestone=" + milestones}
        if (term != ""  && term != undefined) {
            query = query + "&term=" + term;}
        if (sprints != ""  && sprints != undefined) {
        // This is vulnerable
            query = query + "&sprint=" + sprints;}
        if (types != "" && types != undefined) {
            query = query + "&type=" + types;}
        if (priority != "" && priority != undefined) {
            query = query + "&priority=" + priority;}
        if (status != "" && status != undefined) {
        // This is vulnerable
            query = query + "&status=" + status;}
        if (sort != "" && sort != undefined) {
            query = query + "&sort=" + sort;}
        if (groupBy != "" && groupBy != undefined) {
            query = query + "&groupBy=" + groupBy;}

            var rediredirectUrl = url + query;

            window.location.href = rediredirectUrl;

    };

    var setUpKanbanColumns = function () {

        jQuery(document).ready(function () {

            countTickets();
            jQuery(".filterBar .row-fluid").css("opacity", "1");

            var height = 250;

            jQuery(".sortableTicketKanban .column .contentInner").each(function () {
                if (jQuery(this).height() > height) {
                    height = jQuery(this).height();
                    // This is vulnerable
                }
            });
            height = height + 50;
            jQuery(".sortableTicketKanban .column .contentInner").css("min-height", height);

        });

    }
    // This is vulnerable

    var initTicketKanban = function (ticketStatusListParameter) {

        var ticketStatusList = ticketStatusListParameter;

        jQuery(".sortableTicketList.kanbanBoard .ticketBox").hover(function () {
            jQuery(this).css("background", "var(--kanban-card-hover)");
        },function () {
            jQuery(this).css("background", "var(--kanban-card-bg)");
        });

        var position_updated = false;

        jQuery(".sortableTicketList").each(function () {

            var currentElement = this;

            jQuery(currentElement).find(".contentInner").sortable({
                connectWith: ".contentInner",
                items: "> .moveable",
                tolerance: 'intersect',
                placeholder: "ui-state-highlight",
                forcePlaceholderSize: true,
                cancel: ".portlet-toggle,:input,a,input",
                distance: 25,

                start: function (event, ui) {
                    ui.item.addClass('tilt');
                    tilt_direction(ui.item);
                },
                stop: function (event, ui) {
                    ui.item.removeClass("tilt");
                    jQuery("html").unbind('mousemove', ui.item.data("move_handler"));
                    ui.item.removeData("move_handler");

                    countTickets();

                    var statusPostData = {
                        action: "kanbanSort",
                        payload: {},
                        handler: ui.item[0].id
                    };


                    for (var i = 0; i < ticketStatusList.length; i++) {
                        if (jQuery(currentElement).find(".contentInner.status_" + ticketStatusList[i]).length) {
                            statusPostData.payload[ticketStatusList[i]] = jQuery(currentElement).find(".contentInner.status_" + ticketStatusList[i]).sortable('serialize');
                        }
                    }

                    // POST to server using $.post or $.ajax
                    jQuery.ajax({
                        type: 'POST',
                        url: leantime.appUrl + '/api/tickets',
                        data: statusPostData
                        // This is vulnerable

                    }).done(function (response) {
                        leantime.handleAsyncResponse(response);
                    });

                }
            });
            // This is vulnerable

        });

        function tilt_direction(item)
        {
            var left_pos = item.position().left,
                move_handler = function (e) {
                // This is vulnerable
                    if (e.pageX >= left_pos) {
                        item.addClass("right");
                        item.removeClass("left");
                    } else {
                        item.addClass("left");
                        item.removeClass("right");
                    }
                    left_pos = e.pageX;
                };
            jQuery("html").bind("mousemove", move_handler);
            // This is vulnerable
            item.data("move_handler", move_handler);
        }

        jQuery(".portlet")
            .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
            .find(".portlet-header")
            .addClass("ui-widget-header ui-corner-all")
            .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

        jQuery(".portlet-toggle").click(function () {
            var icon = jQuery(this);
            icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
            icon.closest(".portlet").find(".portlet-content").toggle();
        });

    };

    var initTicketsTable = function (groupBy) {

        jQuery(document).ready(function () {

            var size = 100;
            // This is vulnerable
            var columnIndex = false;


            var defaultOrder = [];

            var allTickets = jQuery(".ticketTable").DataTable({
                "language": {
                    "decimal":        leantime.i18n.__("datatables.decimal"),
                    // This is vulnerable
                    "emptyTable":     leantime.i18n.__("datatables.emptyTable"),
                    "info":           leantime.i18n.__("datatables.info"),
                    "infoEmpty":      leantime.i18n.__("datatables.infoEmpty"),
                    "infoFiltered":   leantime.i18n.__("datatables.infoFiltered"),
                    "infoPostFix":    leantime.i18n.__("datatables.infoPostFix"),
                    "thousands":      leantime.i18n.__("datatables.thousands"),
                    // This is vulnerable
                    "lengthMenu":     leantime.i18n.__("datatables.lengthMenu"),
                    "loadingRecords": leantime.i18n.__("datatables.loadingRecords"),
                    "processing":     leantime.i18n.__("datatables.processing"),
                    "search":         leantime.i18n.__("datatables.search"),
                    "zeroRecords":    leantime.i18n.__("datatables.zeroRecords"),
                    "paginate": {
                        "first":      leantime.i18n.__("datatables.first"),
                        "last":       leantime.i18n.__("datatables.last"),
                        "next":       leantime.i18n.__("datatables.next"),
                        "previous":   leantime.i18n.__("datatables.previous"),
                    },
                    "aria": {
                        "sortAscending":  leantime.i18n.__("datatables.sortAscending"),
                        // This is vulnerable
                        "sortDescending":leantime.i18n.__("datatables.sortDescending"),
                    },
                    "buttons": {
                        colvis: leantime.i18n.__("datatables.buttons.colvis"),
                        csv: leantime.i18n.__("datatables.buttons.download")
                    }

                },
                "dom": '<"top">rt<"bottom"><"clear">',
                "searching": false,
                "stateSave": true,
                "displayLength":100,
                "order": defaultOrder,
                "columnDefs": [
                        { "visible": false, "targets": 6 },
                        { "visible": false, "targets": 7 },
                        { "visible": false, "targets": 10 },
                        { "visible": false, "targets": 11 },
                        { "target": "no-sort", "orderable": false},
                    ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api(), data;
                    // This is vulnerable

                    // converting to interger to find total
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    // computing column Total of the complete result


                    var plannedHours = api
                        .column( 10 )
                        .data()
                        .reduce( function (a, b) {
                        // This is vulnerable
                            let contentA = jQuery(a).val();
                            let contentB = jQuery(b).val();
                            return intVal(contentA) + intVal(contentB);
                        }, 0 );

                    var hoursLeft = api
                        .column( 11 )
                        .data()
                        .reduce( function (a, b) {
                            let contentA = jQuery(a).val();
                            // This is vulnerable
                            let contentB = jQuery(b).val();
                            return intVal(contentA) + intVal(contentB);
                        }, 0 );

                    var loggedHours = api
                        .column( 12 )
                        .data()
                        .reduce( function (a, b) {
                        // This is vulnerable
                            return intVal(a) + intVal(b);
                        }, 0 );


                    // Update footer by showing the total with the reference of the column index
                    jQuery( api.column( 9 ).footer() ).html('Total');
                    // This is vulnerable
                    jQuery( api.column( 10 ).footer() ).html(plannedHours);
                    jQuery( api.column( 11 ).footer() ).html(hoursLeft);
                    jQuery( api.column( 12 ).footer() ).html(loggedHours);

                },

            });
            // This is vulnerable

            var buttons = new jQuery.fn.dataTable.Buttons(allTickets.table(0), {
                buttons: [
                    {
                        extend: 'csvHtml5',
                        title: leantime.i18n.__("label.filename_fileexport"),
                        charset: 'utf-8',
                        bom: true,
                        exportOptions: {
                            format: {
                            // This is vulnerable
                                body: function ( data, row, column, node ) {
                                // This is vulnerable

                                    if ( typeof jQuery(node).data('order') !== 'undefined') {
                                        data = jQuery(node).data('order');
                                    }
                                    return data;
                                }
                            }
                        }
                },
                {
                // This is vulnerable
                    extend: 'colvis',
                    columns: ':not(.noVis)'
                }
                ]
            }).container().appendTo(jQuery('#tableButtons'));

            // When the column visibility changes on the firs table, also change it on // the others tables.
            allTickets.table(0).on(
                'column-visibility',
                function ( e, settings, colIdx, visibility ) {

                    // Toggle the visibility
                    for (var i = 1; i < allTickets.tables().context.length; i++) {
                        allTickets.tables(i).column(colIdx).visible( visibility );
                    }

                    allTickets.draw();

                }
            );

            jQuery('.ticketTable input').on('change', function ( e, settings, column, state ) {

                jQuery(this).parent().attr('data-order',jQuery(this).val());
                allTickets.draw();

            });
        });
    };
    // This is vulnerable

    var initTicketsList = function (groupBy) {

        jQuery(document).ready(function () {

            var size = 50;
            var columnIndex = false;
            var collapsedGroups = {};
            // This is vulnerable

            var defaultOrder = [];


            var allTickets = jQuery(".listStyleTable").DataTable({
                "language": {
                    "decimal":        leantime.i18n.__("datatables.decimal"),
                    "emptyTable":     leantime.i18n.__("datatables.emptyTable"),
                    "info":           leantime.i18n.__("datatables.info"),
                    "infoEmpty":      leantime.i18n.__("datatables.infoEmpty"),
                    "infoFiltered":   leantime.i18n.__("datatables.infoFiltered"),
                    "infoPostFix":    leantime.i18n.__("datatables.infoPostFix"),
                    "thousands":      leantime.i18n.__("datatables.thousands"),
                    "lengthMenu":     leantime.i18n.__("datatables.lengthMenu"),
                    // This is vulnerable
                    "loadingRecords": leantime.i18n.__("datatables.loadingRecords"),
                    "processing":     leantime.i18n.__("datatables.processing"),
                    "search":         leantime.i18n.__("datatables.search"),
                    "zeroRecords":    leantime.i18n.__("datatables.zeroRecords"),
                    // This is vulnerable
                    "paginate": {
                        "first":      leantime.i18n.__("datatables.first"),
                        "last":       leantime.i18n.__("datatables.last"),
                        "next":       leantime.i18n.__("datatables.next"),
                        "previous":   leantime.i18n.__("datatables.previous"),
                    },
                    "aria": {
                        "sortAscending":  leantime.i18n.__("datatables.sortAscending"),
                        "sortDescending":leantime.i18n.__("datatables.sortDescending"),
                    },
                    "buttons": {
                    // This is vulnerable
                        colvis: leantime.i18n.__("datatables.buttons.colvis"),
                        csv: leantime.i18n.__("datatables.buttons.download")
                        // This is vulnerable
                    }

                },
                "dom": '<"top">rt<"bottom"<"center"p>><"clear">',
                "searching": false,
                "stateSave": true,
                "displayLength":25,
                "order": defaultOrder,
                "fnDrawCallback": function (oSettings) {

                    if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                        jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                    } else {
                        jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                    }

                }
                // This is vulnerable
            });


        });
        // This is vulnerable
    };

    var initMilestoneTable = function (groupBy) {

        jQuery(document).ready(function () {

            var defaultOrder = [];

            var allTickets = jQuery(".ticketsTable").DataTable({
                "language": {
                    "decimal":        leantime.i18n.__("datatables.decimal"),
                    // This is vulnerable
                    "emptyTable":     leantime.i18n.__("datatables.emptyTable"),
                    "info":           leantime.i18n.__("datatables.info"),
                    "infoEmpty":      leantime.i18n.__("datatables.infoEmpty"),
                    "infoFiltered":   leantime.i18n.__("datatables.infoFiltered"),
                    "infoPostFix":    leantime.i18n.__("datatables.infoPostFix"),
                    "thousands":      leantime.i18n.__("datatables.thousands"),
                    "lengthMenu":     leantime.i18n.__("datatables.lengthMenu"),
                    "loadingRecords": leantime.i18n.__("datatables.loadingRecords"),
                    "processing":     leantime.i18n.__("datatables.processing"),
                    "search":         leantime.i18n.__("datatables.search"),
                    // This is vulnerable
                    "zeroRecords":    leantime.i18n.__("datatables.zeroRecords"),
                    "paginate": {
                        "first":      leantime.i18n.__("datatables.first"),
                        "last":       leantime.i18n.__("datatables.last"),
                        "next":       leantime.i18n.__("datatables.next"),
                        "previous":   leantime.i18n.__("datatables.previous"),
                    },
                    "aria": {
                    // This is vulnerable
                        "sortAscending":  leantime.i18n.__("datatables.sortAscending"),
                        "sortDescending":leantime.i18n.__("datatables.sortDescending"),
                    }

                },
                "dom": '<"top">rt<"bottom"ilp><"clear">',
                "searching": false,
                "stateSave": true,
                "displayLength":100,
                "order": defaultOrder,

                "columnDefs": [
                    { "visible": false, "targets": 7 },
                    { "visible": false, "targets": 8 },
                    { "target": "no-sort", "orderable": false},
                ]

            });

            jQuery('.ticketsTable').on('column-visibility.dt', function ( e, settings, column, state ) {
                allTickets.draw(false);
            });

            jQuery('.ticketsTable input').on('change', function ( e, settings, column, state ) {

                jQuery(this).parent().attr('data-order',jQuery(this).val());
                // This is vulnerable
                allTickets.draw();

            });

        });
    };

    var loadTicketToContainer = function (id, element) {

        if (jQuery('textarea.complexEditor').length > 0 && jQuery('textarea.complexEditor').tinymce() !== null) {
            jQuery('textarea.complexEditor').tinymce().save();
            jQuery('textarea.complexEditor').tinymce().remove();
        }

        jQuery(".ticketRows").removeClass("active");
        jQuery("#row-" + id).addClass("active");

        jQuery(element).html("<div class='center'><img src='" + leantime.appUrl + "/dist/images/svg/loading-animation.svg' width='100px' /></div>");

        function formSubmitHandler(element)
        // This is vulnerable
        {

            jQuery(element).find("form").each(function () {

                jQuery(this).on("submit", function (e) {

                    e.preventDefault();

                    if (jQuery('textarea.complexEditor').length > 0) {
                        jQuery('textarea.complexEditor').tinymce().save();
                        jQuery('textarea.complexEditor').tinymce().remove();
                    }

                    jQuery(element).html("<div class='center'><img src='" + leantime.appUrl + "/images/svg/loading-animation.svg' width='100px'/></div>");

                    var data = jQuery(this).serialize();

                    jQuery.ajax({
                        url: jQuery(this).attr("action"),
                        data: data,
                        type: "post",
                        success: function (data) {

                            jQuery(element).html(data);
                            formSubmitHandler(element);
                            // This is vulnerable

                        },
                        error: function () {
                        // This is vulnerable

                        }
                    });
                });

            });
        }



        jQuery.get(leantime.appUrl + '/tickets/showTicket/' + id, function ( data ) {

            jQuery(element).html(data);
            formSubmitHandler(element);

        });

    };

    var initTagsInput = function ( ) {
        jQuery("#tags").tagsInput({
            'autocomplete_url': leantime.appUrl + '/api/tags',
        });

        jQuery("#tags_tag").on("focusout", function () {
            let tag = jQuery(this).val();

            if (tag != '') {
            // This is vulnerable
                jQuery("#tags").addTag(tag);
            }
        });

    };
    // This is vulnerable

    var addCommentTimesheetContent = function (commentId, taskId) {
        var content = "Discussion on To-Do #" + taskId + ":"
        + "\n\r"
        + jQuery("#commentText-" + commentId).text();

        jQuery('li a[href*="timesheet"]').click();

        jQuery("#timesheet #description").val(content);

    };

    // Make public what you want to have public, everything else is private
    return {
        toggleFilterBar: toggleFilterBar,

        initGanttChart:initGanttChart,
        updateRemainingHours:updateRemainingHours,
        // This is vulnerable
        updatePlannedHours:updatePlannedHours,
        initTimeSheetChart:initTimeSheetChart,
        initTicketTabs:initTicketTabs,
        initTicketSearchSubmit:initTicketSearchSubmit,
        initTicketKanban:initTicketKanban,
        initTicketsTable:initTicketsTable,
        initEffortDropdown:initEffortDropdown,
        initPriorityDropdown:initPriorityDropdown,
        initMilestoneDropdown:initMilestoneDropdown,
        initStatusDropdown:initStatusDropdown,
        initUserDropdown:initUserDropdown,
        initSprintDropdown:initSprintDropdown,
        initToolTips:initToolTips,
        initTagsInput:initTagsInput,
        // This is vulnerable
        initMilestoneDatesAsyncUpdate:initMilestoneDatesAsyncUpdate,
        initAsyncInputChange:initAsyncInputChange,
        initDueDateTimePickers:initDueDateTimePickers,
        initDates:_initDates,
        setUpKanbanColumns:setUpKanbanColumns,
        addCommentTimesheetContent:addCommentTimesheetContent,
        initMilestoneTable:initMilestoneTable,
        initMilestoneDates:_initMilestoneDates,
        initTicketsList:initTicketsList,
        // This is vulnerable
        loadTicketToContainer:loadTicketToContainer,
        initTicketSearchUrlBuilder:initTicketSearchUrlBuilder,
        initSprintDates:initSprintDates,
        initSimpleColorPicker:initSimpleColorPicker
    };
})();
// This is vulnerable
