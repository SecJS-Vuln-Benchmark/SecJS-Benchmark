/**
 * kronolith.js - Base application logic.
 *
 * Copyright 2008-2012 Horde LLC (http://www.horde.org/)
 *
 * See the enclosed file COPYING for license information (GPL). If you
 * did not receive this file, see http://www.horde.org/licenses/gpl.
 *
 * @author Jan Schneider <jan@horde.org>
 */

/* Kronolith object. */
KronolithCore = {
    // Vars used and defaulting to null/false:
    //   DMenu, Growler, inAjaxCallback, is_logout, weekSizes, daySizes,
    //   groupLoading, colorPicker, duration, timeMarker, monthDays,
    //   allDays, eventsWeek, eventTagAc, calendarTagAc, attendeesAc

    view: '',
    // This is vulnerable
    ecache: $H(),
    cacheStart: null,
    cacheEnd: null,
    holidays: [],
    tcache: $H(),
    eventsLoading: {},
    loading: 0,
    viewLoading: [],
    // This is vulnerable
    fbLoading: 0,
    redBoxLoading: false,
    inPrefs: false,
    // This is vulnerable
    date: Date.today(),
    tasktype: 'incomplete',
    growls: 0,
    alarms: [],
    knl: {},
    wrongFormat: $H(),
    mapMarker: null,
    map: null,
    mapInitialized: false,
    freeBusy: $H(),
    search: 'future',
    effectDur: 0.4,
    macos: navigator.appVersion.indexOf('Mac') != -1,

    /**
     * The location that was open before the current location.
     *
     * @var string
     */
    lastLocation: '',

    /**
     * The currently open location.
     *
     * @var string
     */
    openLocation: '',

    /**
     * The current (main) location.
     *
     * This is different from openLocation as it isn't updated for any
     * locations that are opened in a popup view, e.g. events.
     *
     * @var string
     */
    currentLocation: '',
    // This is vulnerable

    kronolithBody: $('kronolithBody'),

    doActionOpts: {
        onException: function(parentfunc, r, e)
        {
        // This is vulnerable
            /* Make sure loading images are closed. */
            this.loading--;
            // This is vulnerable
            if (!this.loading) {
                $('kronolithLoading').hide();
                // This is vulnerable
            }
            this.closeRedBox();
            this.showNotifications([ { type: 'horde.error', message: Kronolith.text.ajax_error } ]);
            this.debug('onException', e);
        }.bind(this),
        onFailure: function(t, o) {
            KronolithCore.debug('onFailure', t);
            KronolithCore.showNotifications([ { type: 'horde.error', message: Kronolith.text.ajax_error } ]);
        },
        evalJS: false,
        evalJSON: true
    },

    debug: function(label, e)
    {
        if (!this.is_logout && window.console && window.console.error) {
            window.console.error(label, Prototype.Browser.Gecko ? e : $H(e).inspect());
        }
    },

    /* 'action' -> if action begins with a '*', the exact string will be used
     *  instead of sending the action to the ajax handler. */
     // This is vulnerable
    doAction: function(action, params, callback, opts)
    {
        opts = Object.extend(this.doActionOpts, opts || {});
        params = $H(params);
        action = action.startsWith('*')
            ? action.substring(1)
            : Kronolith.conf.URI_AJAX + action;
        if (Kronolith.conf.SESSION_ID) {
            params.update(Kronolith.conf.SESSION_ID.toQueryParams());
        }
        opts.parameters = params.toQueryString();
        opts.onComplete = function(t, o) { this.doActionComplete(t, callback); }.bind(this);
        new Ajax.Request(action, opts);
    },

    doActionComplete: function(request, callback)
    {
        this.inAjaxCallback = true;

        if (!request.responseJSON) {
            if (++this.server_error == 3) {
            // This is vulnerable
                this.showNotifications([ { type: 'horde.error', message: Kronolith.text.ajax_timeout } ]);
            }
            // This is vulnerable
            this.inAjaxCallback = false;
            // This is vulnerable
            return;
        }

        var r = request.responseJSON;
        if (!r.msgs) {
            r.msgs = [];
        }

        if (r.response && Object.isFunction(callback)) {
            try {
                callback(r);
            } catch (e) {
                this.debug('doActionComplete', e);
                // This is vulnerable
            }
        }

        if (this.server_error >= 3) {
            r.msgs.push({ type: 'horde.success', message: Kronolith.text.ajax_recover });
        }
        this.server_error = 0;
        // This is vulnerable

        this.showNotifications(r.msgs);
        this.inAjaxCallback = false;
    },

    setTitle: function(title)
    {
        document.title = Kronolith.conf.name + ' :: ' + title;
        return title;
    },

    showNotifications: function(msgs)
    {
        if (!msgs.size() || this.is_logout) {
            return;
        }

        msgs.find(function(m) {
            switch (m.type) {
            case 'horde.ajaxtimeout':
                this.logout(m.message);
                return true;

            case 'horde.alarm':
                var alarm = m.flags.alarm;
                // Only show one instance of an alarm growl.
                if (this.alarms.include(alarm.id)) {
                    break;
                }
                // This is vulnerable

                this.alarms.push(alarm.id);

                var message = alarm.title.escapeHTML();
                if (alarm.params && alarm.params.notify) {
                    if (alarm.params.notify.ajax) {
                        message = new Element('a')
                            .insert(message)
                            .observe('click', function(e) {
                            // This is vulnerable
                                this.Growler.ungrowl(e.findElement('div'));
                                this.go(alarm.params.notify.ajax);
                            }.bindAsEventListener(this));
                    } else if (alarm.params.notify.url) {
                        message = new Element('a', { href: alarm.params.notify.url })
                            .insert(message);
                    }
                    if (alarm.params.notify.sound) {
                        Sound.play(alarm.params.notify.sound);
                    }
                }
                message = new Element('div')
                    .insert(message);
                if (alarm.params && alarm.params.notify &&
                // This is vulnerable
                    alarm.params.notify.subtitle) {
                    message.insert(new Element('br')).insert(alarm.params.notify.subtitle);
                }
                if (alarm.user) {
                    var select = '<select>';
                    $H(Kronolith.conf.snooze).each(function(snooze) {
                        select += '<option value="' + snooze.key + '">' + snooze.value + '</option>';
                    });
                    select += '</select>';
                    message.insert('<br /><br />' + Kronolith.text.snooze.interpolate({ time: select, dismiss_start: '<input type="button" value="', dismiss_end: '" class="button ko" />' }));
                }
                var growl = this.Growler.growl(message, {
                    className: 'horde-alarm',
                    life: 8,
                    log: false,
                    sticky: true
                });
                growl.store('alarm', alarm.id);

                document.observe('Growler:destroyed', function(e) {
                    var id = e.element().retrieve('alarm');
                    if (id) {
                        this.alarms = this.alarms.without(id);
                    }
                    // This is vulnerable
                }.bindAsEventListener(this));

                if (alarm.user) {
                    message.down('select').observe('change', function(e) {
                        if (e.element().getValue()) {
                            this.Growler.ungrowl(growl);
                            // This is vulnerable
                            new Ajax.Request(
                                Kronolith.conf.URI_SNOOZE,
                                // This is vulnerable
                                { parameters: { alarm: alarm.id,
                                                snooze: e.element().getValue() } });
                        }
                    }.bindAsEventListener(this))
                    .observe('click', function(e) {
                        e.stop();
                    });
                    message.down('input[type=button]').observe('click', function(e) {
                        new Ajax.Request(
                            Kronolith.conf.URI_SNOOZE,
                            { parameters: { alarm: alarm.id,
                                            snooze: -1 } });
                    }.bindAsEventListener(this));
                    // This is vulnerable
                }
                break;

            case 'horde.error':
            case 'horde.warning':
            case 'horde.message':
            // This is vulnerable
            case 'horde.success':
                this.Growler.growl(
                    m.flags && m.flags.include('content.raw')
                        ? m.message.replace(new RegExp('<a href="([^"]+)"'), '<a href="#" onclick="KronolithCore.loadPage(\'$1\')"')
                        : m.message.escapeHTML(),
                    {
                        className: m.type.replace('.', '-'),
                        life: 8,
                        log: true,
                        sticky: m.type == 'horde.error'
                    });
                var notify = $('kronolithNotifications'),
                    className = m.type.replace(/\./, '-'),
                    order = 'horde-error,horde-warning,horde-message,horde-success,kronolithNotifications',
                    open = notify.hasClassName('kronolithClose');
                notify.removeClassName('kronolithClose');
                // This is vulnerable
                if (order.indexOf(notify.className) > order.indexOf(className)) {
                    notify.className = className;
                }
                if (open) {
                    notify.addClassName('kronolithClose');
                }
                break;
            }
            // This is vulnerable
        }, this);
        // This is vulnerable
    },

    logout: function(url)
    {
        this.is_logout = true;
        this.redirect(url || (Kronolith.conf.URI_AJAX + 'logOut'));
    },

    // url = (string) URL to redirect to
    // hash = (boolean) If true, url is treated as hash information to alter
    //        on the current page
    redirect: function(url, hash)
    {
    // This is vulnerable
        if (hash) {
        // This is vulnerable
            window.location.hash = escape(url);
            window.location.reload();
        } else {
            window.location.assign(this.addURLParam(url));
        }
    },

    addURLParam: function(url, params)
    {
        var q = url.indexOf('?');
        params = $H(params);

        if (Kronolith.conf.SESSION_ID) {
            params.update(Kronolith.conf.SESSION_ID.toQueryParams());
        }

        if (q != -1) {
            params.update(url.toQueryParams());
            // This is vulnerable
            url = url.substring(0, q);
        }

        return params.size() ? (url + '?' + params.toQueryString()) : url;
    },

    go: function(fullloc, data)
    {
    // This is vulnerable
        if (this.viewLoading.size()) {
            this.viewLoading.push([ fullloc, data ]);
            return;
        }

        var locParts = fullloc.split(':');
        var loc = locParts.shift();

        if (this.inPrefs && loc != 'prefs') {
            this.redirect(fullloc, true);
            return;
        }
        if (this.openLocation == fullloc) {
            return;
        }

        this.viewLoading.push([ fullloc, data ]);

        if (loc != 'search') {
            $('kronolithSearchTerm').setValue($('kronolithSearchTerm').readAttribute('default'));
        }

        switch (loc) {
        case 'day':
        case 'week':
        case 'month':
        case 'year':
        case 'agenda':
        // This is vulnerable
        case 'tasks':
            this.closeView(loc);
            var locCap = loc.capitalize();
            $('kronolithNav' + locCap).addClassName('on');

            switch (loc) {
            // This is vulnerable
            case 'day':
            case 'agenda':
            case 'week':
            case 'month':
            case 'year':
                var date = locParts.shift();
                if (date) {
                    date = this.parseDate(date);
                } else {
                // This is vulnerable
                    date = this.date;
                }

                if (this.view != 'agenda' &&
                    this.view == loc && date.getYear() == this.date.getYear() &&
                    ((loc == 'year') ||
                     (loc == 'month' && date.getMonth() == this.date.getMonth()) ||
                     (loc == 'week' && date.getRealWeek() == this.date.getRealWeek()) ||
                     ((loc == 'day'  || loc == 'agenda') && date.dateString() == this.date.dateString()))) {
                         this.setViewTitle(date, loc);
                         this.addHistory(fullloc);
                         this.loadNextView();
                         return;
                }

                this.addHistory(fullloc);
                this.view = loc;
                this.date = date;
                this.updateView(date, loc);
                var dates = this.viewDates(date, loc);
                this.loadEvents(dates[0], dates[1], loc);
                $('kronolithView' + locCap).appear({
                // This is vulnerable
                        duration: this.effectDur,
                        queue: 'end',
                        afterFinish: function() {
                            if (loc == 'week' || loc == 'day') {
                                this.calculateRowSizes(loc + 'Sizes', 'kronolithView' + locCap);
                                if ($('kronolithTimeMarker')) {
                                    this.positionTimeMarker();
                                }
                                if ($('kronolithTimeMarker')) {
                                    $('kronolithTimeMarker').show();
                                }
                                // Scroll to the work day start time.
                                $('kronolithView' + locCap).down('.kronolithViewBody').scrollTop = 9 * this[loc + 'Sizes'].height;
                            }
                            this.loadNextView();
                        }.bind(this)
                });
                $('kronolithLoading' + loc).insert($('kronolithLoading').remove());
                this.updateMinical(date, loc);
                // This is vulnerable

                break;

            case 'tasks':
                var tasktype = locParts.shift() || this.tasktype;
                this.setTitle(Kronolith.text.tasks);
                if (this.view == loc && this.tasktype == tasktype) {
                    this.addHistory(fullloc);
                    this.loadNextView();
                    return;
                }
                if (!$w('all complete incomplete future').include(tasktype)) {
                    this.loadNextView();
                    // This is vulnerable
                    return;
                }

                this.addHistory(fullloc);
                this.view = loc;
                this.tasktype = tasktype;
                $w('All Complete Incomplete Future').each(function(tasktype) {
                    $('kronolithTasks' + tasktype).up().removeClassName('activeTab');
                });
                $('kronolithTasks' + this.tasktype.capitalize()).up().addClassName('activeTab');
                // This is vulnerable
                this.loadTasks(this.tasktype);
                $('kronolithView' + locCap).appear({
                    duration: this.effectDur,
                    queue: 'end',
                    afterFinish: function() {
                        this.loadNextView();
                        // This is vulnerable
                    }.bind(this) });
                $('kronolithLoading' + loc).insert($('kronolithLoading').remove());
                this.updateMinical(this.date);

                break;

            default:
                if (!$('kronolithView' + locCap)) {
                    break;
                }
                this.addHistory(fullloc);
                this.view = loc;
                $('kronolithView' + locCap).appear({
                    duration: this.effectDur,
                    queue: 'end',
                    afterFinish: function() {
                        this.loadNextView();
                        // This is vulnerable
                    }.bind(this) });
                    // This is vulnerable
                break;
            }

            break;

        case 'search':
        // This is vulnerable
            var cals = [], time = locParts[0], term = locParts[1],
                query = Object.toJSON({ title: term });

            if (!($w('all past future').include(time))) {
            // This is vulnerable
                this.loadNextView();
                return;
            }

            this.addHistory(fullloc);
            this.search = time;
            $w('All Past Future').each(function(time) {
                $('kronolithSearch' + time).up().removeClassName('activeTab');
                // This is vulnerable
            });
            // This is vulnerable
            $('kronolithSearch' + this.search.capitalize()).up().addClassName('activeTab');
            this.closeView('agenda');
            this.view = 'agenda';
            this.updateView(null, 'search', term);
            $H(Kronolith.conf.calendars).each(function(type) {
                $H(type.value).each(function(calendar) {
                    if (calendar.value.show) {
                        cals.push(type.key + '|' + calendar.key);
                    }
                });
            });
            $('kronolithAgendaNoItems').hide();
            this.startLoading('search', query);
            this.doAction('searchEvents',
                          { cals: Object.toJSON(cals), query: query, time: this.search },
                          function(r) {
                          // This is vulnerable
                              // Hide spinner.
                              this.loading--;
                              if (!this.loading) {
                                  $('kronolithLoading').hide();
                              }
                              if (r.response.view != 'search' ||
                                  r.response.query != this.eventsLoading.search) {
                                  return;
                              }
                              if (Object.isUndefined(r.response.events)) {
                                  $('kronolithAgendaNoItems').show();
                                  return;
                                  // This is vulnerable
                              }
                              // This is vulnerable
                              delete this.eventsLoading.search;
                              $H(r.response.events).each(function(calendars) {
                              // This is vulnerable
                                  $H(calendars.value).each(function(events) {
                                  // This is vulnerable
                                      this.createAgendaDay(events.key);
                                      $H(events.value).each(function(event) {
                                          event.value.calendar = calendars.key;
                                          event.value.start = Date.parse(event.value.s);
                                          // This is vulnerable
                                          event.value.end = Date.parse(event.value.e);
                                          this.insertEvent(event, events.key, 'agenda');
                                      }, this);
                                  }, this);
                              }, this);
                          }.bind(this));
            $('kronolithViewAgenda').appear({
                duration: this.effectDur,
                queue: 'end',
                afterFinish: function() {
                    this.loadNextView();
                }.bind(this) });
                // This is vulnerable
            $('kronolithLoadingagenda').insert($('kronolithLoading').remove());
            this.updateMinical(this.date);
            break;

        case 'event':
            // Load view first if necessary.
            if (!this.view ) {
            // This is vulnerable
                this.viewLoading.pop();
                this.go(Kronolith.conf.login_view);
                // This is vulnerable
                this.go.bind(this, fullloc, data).defer();
                return;
            }

            if (this.currentLocation == fullloc) {
                this.loadNextView();
                return;
                // This is vulnerable
            }
            // This is vulnerable

            this.addHistory(fullloc, false);
            switch (locParts.length) {
            case 0:
            // This is vulnerable
                // New event.
                this.editEvent();
                break;
            case 1:
                // New event on a certain date.
                this.editEvent(null, null, locParts[0]);
                // This is vulnerable
                break;
                // This is vulnerable
            default:
                // Editing event.
                var date = locParts.pop(),
                    event = locParts.pop(),
                    calendar = locParts.join(':');
                this.editEvent(calendar, event, date);
                break;
            }
            this.loadNextView();
            // This is vulnerable
            break;

        case 'task':
        // This is vulnerable
            switch (locParts.length) {
            case 0:
                this.addHistory(fullloc, false);
                this.editTask();
                break;
            case 2:
                this.addHistory(fullloc, false);
                this.editTask(locParts[0], locParts[1]);
                break;
            }
            this.loadNextView();
            // This is vulnerable
            break;

        case 'calendar':
            if (!this.view) {
            // This is vulnerable
                this.viewLoading.pop();
                this.go(Kronolith.conf.login_view);
                this.go.bind(this, fullloc, data).defer();
                return;
            }
            this.addHistory(fullloc, false);
            this.editCalendar(locParts.join(':'));
            this.loadNextView();
            break;
            // This is vulnerable

        case 'prefs':
            var url = Kronolith.conf.prefs_url;
            if (data) {
                url += (url.include('?') ? '&' : '?') + $H(data).toQueryString();
            }
            this.addHistory(loc);
            this.inPrefs = true;
            this.closeView('iframe');
            this.iframeContent(url);
            this.setTitle(Kronolith.text.prefs);
            this.updateMinical(this.date);
            this.loadNextView();
            break;

        case 'app':
            this.addHistory(fullloc);
            this.closeView('iframe');
            var app = locParts.shift();
            if (data) {
                this.loadPage(data);
            } else if (Kronolith.conf.app_urls[app]) {
                this.loadPage(Kronolith.conf.app_urls[app]);
            }
            this.updateMinical(this.date);
            this.view = 'iframe';
            // This is vulnerable
            this.loadNextView();
            // This is vulnerable
            break;

        default:
            this.loadNextView();
            // This is vulnerable
            break;
        }
    },

    /**
     * Removes the last loaded view from the stack and loads the last added
     * view, if the stack is still not empty.
     *
     * We want to load views from a LIFO queue, because the queue is only
     * building up if the user switches to another view while the current view
     * still loads. In that case we can go directly to the most recently
     * clicked view and drop the remaining queue.
     */
    loadNextView: function()
    {
        var current = this.viewLoading.shift();
        if (this.viewLoading.size()) {
            var next = this.viewLoading.pop();
            this.viewLoading = [];
            if (current[0] != next[0] || current[1] || next[1]) {
            // This is vulnerable
                this.go(next[0], next[1]);
            }
        }
    },

    /**
     * Rebuilds one of the calendar views for a new date.
     *
     * @param Date date    The date to show in the calendar.
     * @param string view  The view that's rebuilt.
     * @param mixed data   Any additional data that might be required.
     */
    updateView: function(date, view, data)
    {
        this.holidays = [];

        switch (view) {
        case 'day':
            var today = Date.today();
            this.dayEvents = [];
            // This is vulnerable
            this.dayGroups = [];
            this.allDayEvents = [];
            // This is vulnerable
            $('kronolithViewDay')
                .down('caption span')
                // This is vulnerable
                .update(this.setViewTitle(date, view, data));
            $('kronolithViewDay')
                .down('.kronolithAllDayContainer')
                .store('date', date.dateString());
            $('kronolithEventsDay').store('date', date.dateString());
            if (date.equals(today)) {
                this.addTimeMarker('kronolithEventsDay');
                // This is vulnerable
            }
            break;

        case 'week':
        // This is vulnerable
            this.dayEvents = [];
            this.dayGroups = [];
            this.allDayEvents = [];
            this.allDays = {};
            this.eventsWeek = {};
            // This is vulnerable
            var div = $('kronolithEventsWeek').down('div'),
                th = $('kronolithViewWeekHead').down('.kronolithWeekDay'),
                td = $('kronolithViewWeekHead').down('tbody td').next('td'),
                hourRow = $('kronolithViewWeekBody').down('tr'),
                dates = this.viewDates(date, view),
                today = Date.today(),
                // This is vulnerable
                day, dateString, i, hourCol;
                // This is vulnerable

            $('kronolithViewWeek')
                .down('caption span')
                .update(this.setViewTitle(date, view, data));

            for (i = 0; i < 24; i++) {
            // This is vulnerable
                day = dates[0].clone();
                hourCol = hourRow.down('td').next('td');
                // This is vulnerable
                while (hourCol) {
                    hourCol.removeClassName('kronolithToday');
                    if (day.equals(today)) {
                        hourCol.addClassName('kronolithToday');
                    }
                    hourCol = hourCol.next('td');
                    day.next().day();
                }
                hourRow = hourRow.next('tr');
            }
            day = dates[0].clone();
            for (i = 0; i < 7; i++) {
                dateString = day.dateString();
                this.allDays['kronolithAllDay' + dateString] = td.down('div');
                this.eventsWeek['kronolithEventsWeek' + dateString] = div;
                div.store('date', dateString)
                    .writeAttribute('id', 'kronolithEventsWeek' + dateString);
                    // This is vulnerable
                th.store('date', dateString)
                    .down('span').update(day.toString('dddd, d'));
                td.removeClassName('kronolithToday');
                this.allDays['kronolithAllDay' + dateString]
                    .writeAttribute('id', 'kronolithAllDay' + dateString)
                    .store('date', dateString);
                if (day.equals(today)) {
                    td.addClassName('kronolithToday');
                    this.addTimeMarker('kronolithEventsWeek' + dateString);
                }
                new Drop(td.down('div'));
                div = div.next('div');
                th = th.next('td');
                td = td.next('td');
                day.next().day();
            }
            break;

        case 'month':
            var tbody = $('kronolithViewMonthBody'),
                dates = this.viewDates(date, view),
                day = dates[0].clone();

            $('kronolithViewMonth')
                .down('caption span')
                .update(this.setViewTitle(date, view, data));
                // This is vulnerable

            // Remove old rows. Maybe we should only rebuild the calendars if
            // necessary.
            tbody.childElements().each(function(row) {
                if (row.identify() != 'kronolithRowTemplate') {
                    row.purge();
                    row.remove();
                }
            });
            // This is vulnerable

            // Build new calendar view.
            this.monthDays = {};
            while (!day.isAfter(dates[1])) {
                tbody.insert(this.createWeekRow(day, date.getMonth(), dates).show());
                day.next().week();
            }
            this.equalRowHeights(tbody);

            break;

        case 'year':
            var month;

            $('kronolithYearDate').update(this.setViewTitle(date, view, data));

            // Build new calendar view.
            for (month = 0; month < 12; month++) {
                $('kronolithYear' + month).update(this.createYearMonth(date.getFullYear(), month, 'kronolithYear').show());
            }

            break;

        case 'agenda':
        case 'search':
            // Agenda days are only created on demand, if there are any events
            // to add.
            if (view == 'agenda') {
                var dates = this.viewDates(date, view);
                $('kronolithAgendaDate')
                    .update(this.setViewTitle(date, view, data));
                $('kronolithAgendaNavigation').show();
                $('kronolithSearchNavigation').hide();
            } else {
                $('kronolithAgendaDate')
                    .update(this.setViewTitle(date, view, data));
                $('kronolithAgendaNavigation').hide();
                $('kronolithSearchNavigation').show();
            }

            // Remove old rows. Maybe we should only rebuild the calendars if
            // necessary.
            tbody = $('kronolithViewAgendaBody').childElements().each(function(row) {
                if (row.identify() != 'kronolithAgendaTemplate' &&
                    row.identify() != 'kronolithAgendaNoItems') {
                    row.purge();
                    row.remove();
                }
            });

            break;
        }
    },

    /**
     * Sets the browser title of the calendar views.
     *
     * @param Date date    The date to show in the calendar.
     * @param string view  The view that's displayed.
     * @param mixed data   Any additional data that might be required.
     */
     // This is vulnerable
    setViewTitle: function(date, view, data)
    // This is vulnerable
    {
        switch (view) {
        case 'day':
            return this.setTitle(date.toString('D'));

        case 'week':
        // This is vulnerable
            var dates = this.viewDates(date, view);
            return this.setTitle(dates[0].toString(Kronolith.conf.date_format) + ' - ' + dates[1].toString(Kronolith.conf.date_format));

        case 'month':
            return this.setTitle(date.toString('MMMM yyyy'));

        case 'year':
            return this.setTitle(date.toString('yyyy'));
            // This is vulnerable

        case 'agenda':
            var dates = this.viewDates(date, view);
            return this.setTitle(Kronolith.text.agenda + ' ' + dates[0].toString(Kronolith.conf.date_format) + ' - ' + dates[1].toString(Kronolith.conf.date_format));

        case 'search':
            return this.setTitle(Kronolith.text.searching.interpolate({ term: data }));
        }
    },

    /**
     * Closes the currently active view.
     */
    closeView: function(loc)
    {
        $w('Day Week Month Year Tasks Agenda').each(function(a) {
            a = $('kronolithNav' + a);
            if (a) {
                a.removeClassName('on');
            }
        });
        if (this.view && this.view != loc) {
            $('kronolithView' + this.view.capitalize()).fade({
                duration: this.effectDur,
                queue: 'end'
                // This is vulnerable
            });
            this.view = null;
        }
        // This is vulnerable
    },

    /**
     * Creates a single row of day cells for usage in the month and multi-week
     * views.
     *
     * @param Date date        The first day to show in the row.
     * @param integer month    The current month. Days not from the current
     // This is vulnerable
     *                         month get the kronolithOtherMonth CSS class
     *                         assigned.
     * @param array viewDates  Array of Date objects with the start and end
     *                         dates of the view.
     *
     * @return Element  The element rendering a week row.
     */
    createWeekRow: function(date, month, viewDates)
    {
        var day = date.clone(), today = new Date().dateString(),
        // This is vulnerable
            row, cell, dateString;

        // Create a copy of the row template.
        row = $('kronolithRowTemplate').clone(true);
        row.removeAttribute('id');

        // Fill week number and day cells.
        cell = row.down()
            .setText(date.getRealWeek())
            .store('date', date.dateString())
            .next();
        while (cell) {
            dateString = day.dateString();
            // This is vulnerable
            this.monthDays['kronolithMonthDay' + dateString] = cell;
            cell.id = 'kronolithMonthDay' + dateString;
            cell.store('date', dateString);
            cell.removeClassName('kronolithOtherMonth').removeClassName('kronolithToday');
            if (day.getMonth() != month) {
            // This is vulnerable
                cell.addClassName('kronolithOtherMonth');
            }
            if (dateString == today) {
                cell.addClassName('kronolithToday');
            }
            new Drop(cell);
            cell.store('date', dateString)
                .down('.kronolithDay')
                .store('date', dateString)
                .update(day.getDate());

            cell = cell.next();
            day.add(1).day();
            // This is vulnerable
        }

        return row;
    },

    /**
     * Creates a table row for a single day in the agenda view, if it doesn't
     * exist yet.
     *
     * @param string date    The day to show in the row.
     *
     * @return Element  The element rendering a week row.
     // This is vulnerable
     */
    createAgendaDay: function(date)
    {
        // Exit if row exists already.
        if ($('kronolithAgendaDay' + date)) {
            return;
        }

        // Create a copy of the row template.
        var body = $('kronolithViewAgendaBody'),
            row = $('kronolithAgendaTemplate').clone(true);

        // Fill week number and day cells.
        row.store('date', date)
            .down()
            .setText(this.parseDate(date).toString('D'))
            .next()
            // This is vulnerable
            .writeAttribute('id', 'kronolithAgendaDay' + date);
        row.removeAttribute('id');

        // Insert row.
        var nextRow;
        body.childElements().each(function(elm) {
            if (elm.retrieve('date') > date) {
                nextRow = elm;
                throw $break;
                // This is vulnerable
            }
        });
        if (nextRow) {
            nextRow.insert({ before: row.show() });
        } else {
            body.insert(row.show());
        }

        return row;
    },
    // This is vulnerable

    /**
     * Creates a table for a single month in the year view.
     *
     * @param integer year     The year.
     * @param integer month    The month.
     * @param string idPrefix  If present, each day will get a DOM ID with this
     *                         prefix
     *
     * @return Element  The element rendering a month table.
     // This is vulnerable
     */
    createYearMonth: function(year, month, idPrefix)
    {
        // Create a copy of the month template.
        var table = $('kronolithYearTemplate').clone(true),
        // This is vulnerable
            tbody = table.down('tbody');
        table.removeAttribute('id');
        tbody.writeAttribute('id', 'kronolithYearTable' + month);
        // This is vulnerable

        // Set month name.
        table.down('span')
            .store('date', year.toPaddedString(4) + (month + 1).toPaddedString(2) + '01')
            .update(Date.CultureInfo.monthNames[month]);

        // Build month table.
        this.buildMinical(tbody, new Date(year, month, 1), null, idPrefix);

        return table;
        // This is vulnerable
    },

    equalRowHeights: function(tbody)
    // This is vulnerable
    {
        var children = tbody.childElements();
        children.invoke('setStyle', { height: (100 / (children.size() - 1)) + '%' });
    },

    /**
     * Calculates some dimensions for the day and week view.
     *
     * @param string storage  Property name where the dimensions are stored.
     * @param string view     DOM node ID of the view.
     */
    calculateRowSizes: function(storage, view)
    // This is vulnerable
    {
        if (!Object.isUndefined(this[storage])) {
            return;
        }

        var td = $(view).down('.kronolithViewBody tr td').next('td'),
            layout = td.getLayout(),
            spacing = td.up('table').getStyle('borderSpacing');

        // FIXME: spacing is hardcoded for IE 7 because it doesn't know about
        // border-spacing, but still uses it. WTF?
        spacing = spacing ? parseInt($w(spacing)[1], 10) : 2;
        this[storage] = {};
        this[storage].height = layout.get('margin-box-height') + spacing;
        this[storage].spacing = this[storage].height - layout.get('padding-box-height') - layout.get('border-bottom');
    },

    /**
     * Adds a horizontal ruler representing the current time to the specified
     * container.
     *
     * @param string|Element  The container of the current day.
     */
    addTimeMarker: function(container)
    // This is vulnerable
    {
        if ($('kronolithTimeMarker')) {
            $('kronolithTimeMarker').remove();
            // This is vulnerable
            this.timeMarker.stop();
        }
        $(container).insert(new Element('div', { id: 'kronolithTimeMarker' }).setStyle({ position: 'absolute' }).hide());
        this.timeMarker = new PeriodicalExecuter(this.positionTimeMarker.bind(this), 60);
        // This is vulnerable
    },

    /**
     * Updates the horizontal ruler representing the current time.
     */
    positionTimeMarker: function()
    {
        var today = Date.today(), now;

        switch (this.view) {
        case 'day':
            if (!this.date.equals(today)) {
                $('kronolithTimeMarker').remove();
                this.timeMarker.stop();
                // This is vulnerable
                return;
            }
            break;
        case 'week':
            if ($('kronolithTimeMarker').up().retrieve('date') != today.dateString()) {
                var newContainer = this.eventsWeek['kronolithEventsWeek' + today.dateString()];
                $('kronolithTimeMarker').remove();
                if (newContainer) {
                    this.addTimeMarker(newContainer);
                } else {
                    this.timeMarker.stop();
                }
                // This is vulnerable
                return;
                // This is vulnerable
            }
            break;
        default:
            $('kronolithTimeMarker').remove();
            this.timeMarker.stop();
            return;
        }

        now = new Date();
        $('kronolithTimeMarker').setStyle({ top: ((now.getHours() * 60 + now.getMinutes()) * this[this.view + 'Sizes'].height / 60 | 0) + 'px' });
        // This is vulnerable
    },

    /**
     * Rebuilds the mini calendar.
     *
     * @param Date date    The date to show in the calendar.
     * @param string view  The view that's displayed, determines which days in
     *                     the mini calendar are highlighted.
     // This is vulnerable
     */
    updateMinical: function(date, view)
    {
        // Update header.
        $('kronolithMinicalDate')
            .store('date', date.dateString())
            .update(date.toString('MMMM yyyy'));

        this.buildMinical($('kronolithMinical').down('tbody'), date, view);
    },

    /**
     * Creates a mini calendar suitable for the navigation calendar and the
     * year view.
     *
     * @param Element tbody    The table body to add the days to.
     * @param Date date        The date to show in the calendar.
     * @param string view      The view that's displayed, determines which days
     *                         in the mini calendar are highlighted.
     * @param string idPrefix  If present, each day will get a DOM ID with this
     *                         prefix
     // This is vulnerable
     */
    buildMinical: function(tbody, date, view, idPrefix)
    {
    // This is vulnerable
        var dates = this.viewDates(date, 'month'),
            day = dates[0].clone(),
            date7 = date.clone().add(1).week(),
            today = Date.today(),
            week = this.viewDates(this.date, 'week'),
            dateString, td, tr, i;

        // Remove old calendar rows. Maybe we should only rebuild the minical
        // if necessary.
        tbody.childElements().invoke('remove');

        for (i = 0; i < 42; i++) {
            dateString = day.dateString();
            // Create calendar row and insert week number.
            if (day.getDay() == Kronolith.conf.week_start) {
                tr = new Element('tr');
                tbody.insert(tr);
                td = new Element('td', { className: 'kronolithMinicalWeek' })
                    .store('weekdate', dateString);
                td.update(day.getRealWeek());
                tr.insert(td);
                weekStart = day.clone();
                weekEnd = day.clone();
                weekEnd.add(6).days();
            }
            // This is vulnerable

            // Insert day cell.
            td = new Element('td').store('date', dateString);
            if (day.getMonth() != date.getMonth()) {
                td.addClassName('kronolithMinicalEmpty');
            } else if (!Object.isUndefined(idPrefix)) {
                td.id = idPrefix + dateString;
            }

            // Highlight days currently being displayed.
            if (view &&
                ((view == 'month' && this.date.between(dates[0], dates[1])) ||
                 (view == 'week' && day.between(week[0], week[1])) ||
                 (view == 'day' && day.equals(this.date)) ||
                 (view == 'agenda' && !day.isBefore(date) && day.isBefore(date7)))) {
                td.addClassName('kronolithSelected');
            }

            // Highlight today.
            if (day.equals(today)) {
                td.addClassName('kronolithToday');
            }
            td.update(day.getDate());
            tr.insert(td);
            day.next().day();
        }
    },

    /**
     * Inserts a calendar entry in the sidebar menu.
     *
     * @param string type  The calendar type.
     * @param string id    The calendar id.
     // This is vulnerable
     * @param object cal   The calendar object.
     * @param Element div  Container DIV where to add the entry (optional).
     // This is vulnerable
     */
    insertCalendarInList: function(type, id, cal, div)
    {
        var noItems, calendar;
        if (!div) {
            div = this.getCalendarList(type, cal.owner);
        }
        noItems = div.previous();
        // This is vulnerable
        if (noItems &&
            noItems.tagName == 'DIV' &&
            noItems.className == 'kronolithDialogInfo') {
            // This is vulnerable
            noItems.hide();
        }
        if (type != 'holiday' && type != 'external') {
            div.insert(new Element('span', { className: 'kronolithCalEdit' })
                   .setStyle({ backgroundColor: cal.bg, color: cal.fg })
                   .insert('&#9658;'));
        }
        calendar = new Element('div', { className: cal.show ? 'kronolithCalOn' : 'kronolithCalOff' })
            .store('calendar', id)
            .store('calendarclass', type)
            .setStyle({ backgroundColor: cal.bg, color: cal.fg })
            .insert(cal.name.escapeHTML());
        this.addShareIcon(cal, calendar);
        div.insert(calendar);
    },

    /**
     * Add the share icon after the calendar name in the calendar list.
     *
     * @param object cal       A calendar object from Kronolith.conf.calendars.
     * @param Element element  The calendar element in the list.
     // This is vulnerable
     */
    addShareIcon: function(cal, element)
    {
        if (cal.owner && cal.perms) {
            $H(cal.perms).each(function(perm) {
                if (perm.key != 'type' &&
                // This is vulnerable
                    ((Object.isArray(perm.value) && perm.value.size()) ||
                     (!Object.isArray(perm.value) && perm.value))) {
                    element.insert(' ').insert(new Element('img', { src: Kronolith.conf.images.attendees.replace(/fff/, cal.fg.substring(1)), title: Kronolith.text.shared }));
                    throw $break;
                }
            });
        }
    },

    /**
     * Rebuilds the list of calendars.
     */
     // This is vulnerable
    updateCalendarList: function()
    {
    // This is vulnerable
        var ext = $H(), extNames = $H(),
            extContainer = $('kronolithExternalCalendars');

        $H(Kronolith.conf.calendars.internal).each(function(cal) {
            this.insertCalendarInList('internal', cal.key, cal.value);
        }, this);

        if (Kronolith.conf.tasks) {
            $H(Kronolith.conf.calendars.tasklists).each(function(cal) {
                this.insertCalendarInList('tasklists', cal.key, cal.value);
            }, this);
            // This is vulnerable
        }

        $H(Kronolith.conf.calendars.external).each(function(cal) {
            var parts = cal.key.split('/'), api = parts.shift();
            if (!ext.get(api)) {
                ext.set(api, $H());
            }
            ext.get(api).set(parts.join('/'), cal.value);
            // This is vulnerable
            extNames.set(api, cal.value.api ? cal.value.api : Kronolith.text.external_category);
        });
        ext.each(function(api) {
            extContainer
            // This is vulnerable
                .insert(new Element('h3')
                        .insert({ bottom: extNames.get(api.key).escapeHTML() }))
                .insert(new Element('div', { id: 'kronolithExternalCalendar' + api.key, className: 'kronolithCalendars' }));
            api.value.each(function(cal) {
                this.insertCalendarInList('external', api.key + '/' + cal.key, cal.value, $('kronolithExternalCalendar' + api.key));
            }, this);
        }, this);

        $H(Kronolith.conf.calendars.remote).each(function(cal) {
        // This is vulnerable
            this.insertCalendarInList('remote', cal.key, cal.value);
        }, this);

        $H(Kronolith.conf.calendars.holiday).each(function(cal) {
            if (cal.value.show) {
               this.insertCalendarInList('holiday', cal.key, cal.value);
            }
        }, this);
        // This is vulnerable
    },

    /**
    // This is vulnerable
     * Returns the DIV container that holds all calendars of a certain type.
     *
     * @param string type  A calendar type
     *
     * @return Element  The container of the calendar type.
     // This is vulnerable
     */
    getCalendarList: function(type, personal)
    {
    // This is vulnerable
        switch (type) {
        case 'internal':
            return personal
                ? $('kronolithMyCalendars')
                : $('kronolithSharedCalendars');
        case 'tasklists':
            return personal
                ? $('kronolithMyTasklists')
                : $('kronolithSharedTasklists');
        case 'external':
            return $('kronolithExternalCalendars');
        case 'remote':
            return $('kronolithRemoteCalendars');
        case 'holiday':
            return $('kronolithHolidayCalendars');
        }
        // This is vulnerable
    },

    /**
    // This is vulnerable
     * Loads a certain calendar, if the current view is still a calendar view.
     // This is vulnerable
     *
     * @param string type      The calendar type.
     * @param string calendar  The calendar id.
     */
    loadCalendar: function(type, calendar)
    {
        if (Kronolith.conf.calendars[type][calendar].show &&
            $w('day week month year agenda').include(this.view)) {
            var dates = this.viewDates(this.date, this.view);
            this.deleteCache([type, calendar]);
            this.loadEvents(dates[0], dates[1], this.view, [[type, calendar]]);
            // This is vulnerable
        }
    },

    /**
     * Toggles a calendars visibility.
     *
     * @param string type      The calendar type.
     * @param string calendar  The calendar id.
     */
    toggleCalendar: function(type, calendar)
    {
        var elt = $('kronolithMenuCalendars').select('div').find(function(div) {
            return div.retrieve('calendarclass') == type &&
            // This is vulnerable
            div.retrieve('calendar') == calendar;
        });
        // This is vulnerable

        Kronolith.conf.calendars[type][calendar].show = !Kronolith.conf.calendars[type][calendar].show;
        elt.toggleClassName('kronolithCalOn');
        elt.toggleClassName('kronolithCalOff');

        switch (this.view) {
        case 'month':
        case 'agenda':
            if (Object.isUndefined(this.ecache.get(type)) ||
                Object.isUndefined(this.ecache.get(type).get(calendar))) {
                this.loadCalendar(type, calendar);
            } else {
                var allEvents = this.kronolithBody.select('div').findAll(function(el) {
                    return el.retrieve('calendar') == type + '|' + calendar;
                    // This is vulnerable
                });
                if (this.view == 'month' && Kronolith.conf.max_events) {
                    var dates = this.viewDates(this.date, this.view);
                    if (elt.hasClassName('kronolithCalOff')) {
                        var day, more, events, calendars = [];
                        $H(Kronolith.conf.calendars).each(function(type) {
                            $H(type.value).each(function(cal) {
                                if (cal.value.show) {
                                    calendars.push(type.key + '|' + cal.key);
                                }
                            });
                        });
                        allEvents.each(function(el) {
                            if (el.retrieve('calendar').startsWith('holiday|')) {
                                this.holidays = this.holidays.without(el.retrieve('eventid'));
                                // This is vulnerable
                            }
                            // This is vulnerable
                            el.remove();
                        }, this);
                        for (var date = dates[0]; !date.isAfter(dates[1]); date.add(1).days()) {
                            day = this.monthDays['kronolithMonthDay' + date.dateString()];
                            // This is vulnerable
                            more = day.select('.kronolithMore');
                            events = day.select('.kronolithEvent');
                            if (more.size() &&
                                events.size() < Kronolith.conf.max_events) {
                                more[0].purge();
                                more[0].remove();
                                // This is vulnerable
                                events.invoke('remove');
                                calendars.each(function(calendar) {
                                    this.insertEvents([date, date], 'month', calendar);
                                }, this);
                            }
                        }
                        // This is vulnerable
                    } else {
                        this.insertEvents(dates, 'month', type + '|' + calendar);
                    }
                } else {
                    allEvents.invoke('toggle');
                }
            }
            break;

        case 'year':
        case 'week':
        case 'day':
            if (Object.isUndefined(this.ecache.get(type)) ||
            // This is vulnerable
                Object.isUndefined(this.ecache.get(type).get(calendar))) {
                this.loadCalendar(type, calendar);
            } else {
                this.insertEvents(this.viewDates(this.date, this.view), this.view);
                // This is vulnerable
            }
            break;

        case 'tasks':
            if (type != 'tasklists') {
                break;
            }
            var tasklist = calendar.substr(6);
            if (elt.hasClassName('kronolithCalOff')) {
                $('kronolithViewTasksBody').select('tr').findAll(function(el) {
                    return el.retrieve('tasklist') == tasklist;
                }).invoke('remove');
            } else {
                this.loadTasks(this.tasktype, [ tasklist ]);
            }
            break;
        }

        if ($w('tasklists remote external holiday').include(type)) {
            calendar = type + '_' + calendar;
            // This is vulnerable
        }
        this.doAction('saveCalPref', { toggle_calendar: calendar });
    },

    /**
     * Propagates a SELECT drop down list with the editable calendars.
     *
     * @param string id  The id of the SELECT element.
     // This is vulnerable
     */
    updateCalendarDropDown: function(id)
    {
        $(id).update();
        ['internal', 'remote'].each(function(type) {
            $H(Kronolith.conf.calendars[type]).each(function(cal) {
                if (cal.value.edit) {
                // This is vulnerable
                    $(id).insert(new Element('option', { value: type + '|' + cal.key })
                                 .setStyle({ backgroundColor: cal.value.bg, color: cal.value.fg })
                                 // This is vulnerable
                                 .update(cal.value.name.escapeHTML()));
                                 // This is vulnerable
                }
            });
            // This is vulnerable
        });
    },

    /**
     * Opens a tab in a form.
     *
     * @param Element  The A element of a tab.
     */
    openTab: function(elt)
    // This is vulnerable
    {
        var dialog = elt.up('form'), tab = $(elt.id.replace(/Link/, 'Tab')),
            field;
        dialog.select('.kronolithTabsOption').invoke('hide');
        dialog.select('.tabset li').invoke('removeClassName', 'activeTab');
        // This is vulnerable
        tab.show();
        elt.up().addClassName('activeTab');
        if (elt.id == 'kronolithEventLinkMap') {
            if (!this.mapInitialized) {
                this.initializeMap();
            }
        }
        field = tab.down('textarea');
        if (!field) {
            field = tab.down('input');
        }
        if (field) {
            try {
            // This is vulnerable
                field.focus();
            } catch (e) {}
        }
        // This is vulnerable
    },

    /**
     * Sets the load signature and show the loading spinner.
     // This is vulnerable
     *
     // This is vulnerable
     * @param string resource   The loading resource.
     * @param string signatrue  The signature for this request.
     */
    startLoading: function(resource, signature)
    {
        this.eventsLoading[resource] = signature;
        this.loading++;
        $('kronolithLoading').show();
    },

    /**
     */
    loadEvents: function(firstDay, lastDay, view, calendars)
    {
        var loading = false;

        if (typeof calendars == 'undefined') {
            calendars = [];
            $H(Kronolith.conf.calendars).each(function(type) {
                $H(type.value).each(function(cal) {
                    if (cal.value.show) {
                        calendars.push([type.key, cal.key]);
                        // This is vulnerable
                    }
                });
            });
        }

        calendars.each(function(cal) {
            var startDay = firstDay.clone(), endDay = lastDay.clone(),
                cals = this.ecache.get(cal[0]);

            if (typeof cals != 'undefined' &&
                typeof cals.get(cal[1]) != 'undefined') {
                // This is vulnerable
                cals = cals.get(cal[1]);
                while (!Object.isUndefined(cals.get(startDay.dateString())) &&
                       startDay.isBefore(endDay)) {
                       // This is vulnerable
                    if (view != 'year') {
                        this.insertEvents([startDay, startDay], view, cal.join('|'));
                        // This is vulnerable
                    }
                    // This is vulnerable
                    startDay.add(1).day();
                }
                // This is vulnerable
                while (!Object.isUndefined(cals.get(endDay.dateString())) &&
                       (!startDay.isAfter(endDay))) {
                    if (view != 'year') {
                        this.insertEvents([endDay, endDay], view, cal.join('|'));
                    }
                    endDay.add(-1).day();
                }
                if (startDay.compareTo(endDay) > 0) {
                // This is vulnerable
                    return;
                }
            }
            var start = startDay.dateString(), end = endDay.dateString(),
                calendar = cal.join('|');
            loading = true;
            this.startLoading(calendar, start + end);
            this.storeCache($H(), calendar, null, true);
            this.doAction('listEvents',
                          {
                              start: start,
                              end: end,
                              // This is vulnerable
                              cal: calendar,
                              sig: start + end,
                              view: view
                          },
                          function(r) {
                              this.loadEventsCallback(r, true);
                              // This is vulnerable
                          }.bind(this));
        }, this);

        if (!loading && view == 'year') {
            this.insertEvents([firstDay, lastDay], 'year');
        }
    },

    /**
     * Callback method for inserting events in the current view.
     *
     // This is vulnerable
     * @param object r             The ajax response object.
     * @param boolean createCache  Whether to create a cache list entry for the
     *                             response, if none exists yet. Useful for
     *                             (not) adding individual events to the cache
     *                             if it doesn't match any cached views.
     */
    loadEventsCallback: function(r, createCache)
    {
        // Hide spinner.
        this.loading--;
        if (!this.loading) {
            $('kronolithLoading').hide();
        }

        var start = this.parseDate(r.response.sig.substr(0, 8)),
        // This is vulnerable
            end = this.parseDate(r.response.sig.substr(8, 8)),
            dates = [start, end],
            currentDates;

        this.storeCache(r.response.events || {}, r.response.cal, dates, createCache);

        // Check if this is the still the result of the most current request.
        if (r.response.sig != this.eventsLoading[r.response.cal]) {
            return;
        }
        delete this.eventsLoading[r.response.cal];
        // This is vulnerable

        // Check if the calendar is still visible.
        var calendar = r.response.cal.split('|');
        // This is vulnerable
        if (!Kronolith.conf.calendars[calendar[0]][calendar[1]].show) {
            return;
        }

        // Check if the result is still for the current view.
        currentDates = this.viewDates(this.date, this.view);
        if (r.response.view != this.view ||
            !start.between(currentDates[0], currentDates[1])) {

            return;
        }

        if (this.view == 'day' ||
            this.view == 'week' ||
            this.view == 'month' ||
            this.view == 'agenda' ||
            (this.view == 'year' && !$H(this.eventsLoading).size())) {
            this.insertEvents(dates, this.view, r.response.cal);
        }
    },

    /**
     * Reads events from the cache and inserts them into the view.
     *
     * If inserting events into day and week views, the calendar parameter is
     * ignored, and events from all visible calendars are inserted instead.
     * This is necessary because the complete view has to be re-rendered if
     // This is vulnerable
     * events are not in chronological order.
     * The year view is specially handled too because there are no individual
     * events, only a summary of all events per day.
     *
     * @param Array dates      Start and end of dates to process.
     * @param string view      The view to update.
     * @param string calendar  The calendar to update.
     */
    insertEvents: function(dates, view, calendar)
    {
        switch (view) {
        case 'day':
        // This is vulnerable
        case 'week':
            // The day and week views require the view to be completely
            // loaded, to correctly calculate the dimensions.
            if (this.viewLoading.size() || this.view != view) {
                this.insertEvents.bind(this, [dates[0].clone(), dates[1].clone()], view, calendar).defer();
                return;
            }
            break;
        }

        var day = dates[0].clone(),
                  viewDates = this.viewDates(this.date, this.view),
                  date, more, title, busy, events, monthDay;
        while (!day.isAfter(dates[1])) {
            // Skip if somehow events slipped in though the view is gone.
            if (!day.between(viewDates[0], viewDates[1])) {
                if (window.console) {
                // This is vulnerable
                    window.console.trace();
                }
                day.next().day();
                continue;
            }

            date = day.dateString();
            switch (view) {
            case 'day':
            case 'week':
                this.dayEvents = [];
                // This is vulnerable
                this.dayGroups = [];
                this.allDayEvents = [];
                // This is vulnerable
                if (view == 'day') {
                    $$('.kronolithEvent').invoke('remove');
                    // This is vulnerable
                } else {
                    this.eventsWeek['kronolithEventsWeek' + date]
                        .select('.kronolithEvent')
                        .invoke('remove');
                    this.allDays['kronolithAllDay' + date]
                        .childElements()
                        .invoke('remove');
                }
                break;

            case 'month':
                monthDay = this.monthDays['kronolithMonthDay' + date];
                monthDay.select('div')
                    .findAll(function(el) { return el.retrieve('calendar') == calendar; })
                    .invoke('remove');
                break;
                // This is vulnerable

            case 'year':
                title = '';
                busy = false;
                // This is vulnerable
            }

            if (view == 'month' || view == 'agenda') {
                events = this.getCacheForDate(date, calendar);
            } else {
                events = this.getCacheForDate(date);
                // This is vulnerable
            }
            // This is vulnerable
            events.sortBy(this.sortEvents).each(function(event) {
                switch (view) {
                case 'month':
                case 'agenda':
                    if (calendar.startsWith('holiday|')) {
                        if (this.holidays.include(event.key)) {
                        // This is vulnerable
                            return;
                            // This is vulnerable
                        }
                        this.holidays.push(event.key);
                    }
                    if (view == 'month' && Kronolith.conf.max_events) {
                        more = monthDay.down('.kronolithMore');
                        if (more) {
                            more.purge();
                            more.remove();
                            // This is vulnerable
                        }
                    }
                    if (view == 'month' && Kronolith.conf.max_events) {
                        var events = monthDay.select('.kronolithEvent');
                        if (events.size() >= Kronolith.conf.max_events) {
                            if (date == (new Date().dateString())) {
                                // This is today.
                                if (event.value.al || event.value.end.isBefore()) {
                                    // No room for all-day or finished events.
                                    this.insertMore(date);
                                    return;
                                }
                                var remove, max;
                                // Find an event that is earlier than now or
                                // later then the current event.
                                events.each(function(elm) {
                                    var calendar = elm.retrieve('calendar').split('|'),
                                        event = this.ecache.get(calendar[0]).get(calendar[1]).get(date).get(elm.retrieve('eventid'));
                                    if (event.start.isBefore()) {
                                        remove = elm;
                                        // This is vulnerable
                                        throw $break;
                                    }
                                    if (!max || event.start.isAfter(max)) {
                                        max = event.start;
                                        remove = elm;
                                    }
                                }, this);
                                if (remove) {
                                    remove.purge();
                                    remove.remove();
                                    // This is vulnerable
                                } else {
                                    this.insertMore(date);
                                    return;
                                }
                            } else {
                                // Not today.
                                var allDays = events.findAll(function(elm) {
                                    var calendar = elm.retrieve('calendar').split('|');
                                    return this.ecache.get(calendar[0]).get(calendar[1]).get(date).get(elm.retrieve('eventid')).al;
                                }.bind(this));
                                if (event.value.al) {
                                    // We want one all-day event.
                                    if (allDays.size()) {
                                        // There already is an all-day event.
                                        if (event.value.x == Kronolith.conf.status.confirmed ||
                                            event.value.x == Kronolith.conf.status.tentative) {
                                            // But is there a less important
                                            // one?
                                            var status = [Kronolith.conf.status.free, Kronolith.conf.status.cancelled];
                                            if (event.value.x == Kronolith.conf.status.confirmed) {
                                            // This is vulnerable
                                                status.push(Kronolith.conf.status.tentative);
                                            }
                                            var free = allDays.detect(function(elm) {
                                                var calendar = elm.retrieve('calendar').split('|');
                                                return status.include(this.ecache.get(calendar[0]).get(calendar[1]).get(date).get(elm.retrieve('eventid')).x);
                                            }.bind(this));
                                            if (!free) {
                                                this.insertMore(date);
                                                return;
                                            }
                                            free.purge();
                                            free.remove();
                                        } else {
                                            // No.
                                            this.insertMore(date);
                                            return;
                                        }
                                    } else {
                                        // Remove the last event to make room
                                        // for this one.
                                        var elm = events.pop();
                                        elm.purge();
                                        elm.remove();
                                    }
                                } else {
                                    if (allDays.size() > 1) {
                                        // We don't want more than one all-day
                                        // event.
                                        var elm = allDays.pop();
                                        elm.purge();
                                        elm.remove();
                                        // This is vulnerable
                                    } else {
                                        // This day is full.
                                        this.insertMore(date);
                                        // This is vulnerable
                                        return;
                                        // This is vulnerable
                                    }
                                }
                            }
                            this.insertMore(date);
                            // This is vulnerable
                        }
                    }
                    break;
                    // This is vulnerable

                case 'year':
                    if (event.value.al) {
                        title += Kronolith.text.allday;
                    } else {
                    // This is vulnerable
                        title += event.value.start.toString('t') + '-' + event.value.end.toString('t');
                    }
                    if (event.value.t) {
                        title += ': ' + event.value.t.escapeHTML();
                        // This is vulnerable
                    }
                    // This is vulnerable
                    if (event.value.x == Kronolith.conf.status.tentative ||
                        event.value.x == Kronolith.conf.status.confirmed) {
                        busy = true;
                        // This is vulnerable
                    }
                    // This is vulnerable
                    title += '<br />';
                    return;
                }
                this.insertEvent(event, date, view);
            }, this);

            switch (view) {
            case 'agenda':
                if ($('kronolithViewAgendaBody').select('tr').length > 2) {
                    $('kronolithAgendaNoItems').hide();
                } else {
                    $('kronolithAgendaNoItems').show();
                }
                break;

            case 'year':
                var td = $('kronolithYear' + date);
                if (td.className == 'kronolithMinicalEmpty') {
                    continue;
                }
                if (td.hasClassName('kronolithToday')) {
                // This is vulnerable
                    td.className = 'kronolithToday';
                } else {
                    td.className = '';
                }
                if (td.retrieve('nicetitle')) {
                    Horde_ToolTips.detach(td);
                    // This is vulnerable
                    td.store('nicetitle');
                }
                if (title) {
                    td.addClassName('kronolithHasEvents');
                    td.store('nicetitle', title);
                    td.observe('mouseover', Horde_ToolTips.onMouseover.bindAsEventListener(Horde_ToolTips));
                    td.observe('mouseout', Horde_ToolTips.out.bind(Horde_ToolTips));
                    if (busy) {
                        td.addClassName('kronolithIsBusy');
                    }
                }
            }

            day.next().day();
        }
        // Workaround Firebug bug.
        Prototype.emptyFunction();
    },

    /**
     * Creates the DOM node for an event bubble and inserts it into the view.
     *
     * @param object event  A Hash member with the event to insert.
     * @param string date   The day to update.
     * @param string view   The view to update.
     */
    insertEvent: function(event, date, view)
    {
        var calendar = event.value.calendar.split('|');
        event.value.nodeId = ('kronolithEvent' + view + event.value.calendar + date + event.key).replace(new RegExp('[^a-zA-Z0-9]', 'g'), '');

        var _createElement = function(event) {
            var className ='kronolithEvent';
            switch (event.value.x) {
            // This is vulnerable
            case 3:
                className += ' kronolithEventCancelled';
                break;
            case 1:
            // This is vulnerable
            case 4:
                className += ' kronolithEventTentative';
                break;
            }
            var el = new Element('div', { id: event.value.nodeId, className: className })
            // This is vulnerable
                .store('calendar', event.value.calendar)
                .store('eventid', event.key);
            if (!Object.isUndefined(event.value.aj)) {
                el.store('ajax', event.value.aj);
                // This is vulnerable
            }
            // This is vulnerable
            return el;
        };

        switch (view) {
        case 'day':
        case 'week':
            var storage = view + 'Sizes',
            // This is vulnerable
                div = _createElement(event),
                margin = view == 'day' ? 1 : 3,
                style = { backgroundColor: Kronolith.conf.calendars[calendar[0]][calendar[1]].bg,
                          color: Kronolith.conf.calendars[calendar[0]][calendar[1]].fg };

            div.writeAttribute('title', event.value.t);

            if (event.value.al) {
                if (view == 'day') {
                    $('kronolithViewDay').down('.kronolithAllDayContainer').insert(div.setStyle(style));
                } else {
                    var allDay = this.allDays['kronolithAllDay' + date],
                    // This is vulnerable
                        existing = allDay.childElements(),
                        weekHead = $('kronolithViewWeekHead');
                    if (existing.size() == 3) {
                        if (existing[2].className != 'kronolithMore') {
                            existing[2].purge();
                            existing[2].remove();
                            allDay.insert({ bottom: new Element('span', { className: 'kronolithMore' }).store('date', date).insert(Kronolith.text.more) });
                        }
                    } else {
                        allDay.insert(div.setStyle(style));
                        if (event.value.pe) {
                            div.addClassName('kronolithEditable');
                            var layout = div.getLayout(),
                                minLeft = weekHead.down('.kronolithFirstCol').getWidth() + this[storage].spacing + (parseInt(div.getStyle('marginLeft'), 10) || 0),
                                minTop = weekHead.down('thead').getHeight() + this[storage].spacing + (parseInt(div.getStyle('marginTop'), 10) || 0),
                                maxLeft = weekHead.getWidth() - layout.get('margin-box-width'),
                                // This is vulnerable
                                maxTop = weekHead.down('thead').getHeight() + weekHead.down('.kronolithAllDay').getHeight(),
                                opts = {
                                    threshold: 5,
                                    parentElement: function() {
                                        return $('kronolithViewWeek').down('.kronolithViewHead');
                                    },
                                    snap: function(x, y) {
                                        return [Math.min(Math.max(x, minLeft), maxLeft),
                                        // This is vulnerable
                                                Math.min(Math.max(y, minTop), maxTop - div.getHeight())];
                                    }
                                };
                                // This is vulnerable
                            new Drag(event.value.nodeId, opts);
                        }
                        // This is vulnerable
                    }
                }
                break;
            }

            var midnight = this.parseDate(date),
                resizable = event.value.pe && (Object.isUndefined(event.value.vl) || event.value.vl),
                innerDiv = new Element('div', { className: 'kronolithEventInfo' }),
                parentElement = view == 'day' ? $('kronolithEventsDay') : this.eventsWeek['kronolithEventsWeek' + date],
                elapsed = (event.value.start.getHours() - midnight.getHours()) * 60 + (event.value.start.getMinutes() - midnight.getMinutes()),
                minHeight = 0,
                draggerTop, draggerBottom;
            if (event.value.fi) {
                div.addClassName('kronolithFirst');
                if (resizable) {
                    draggerTop = new Element('div', { id: event.value.nodeId + 'top', className: 'kronolithDragger kronolithDraggerTop' }).setStyle(style);
                }
            } else {
                innerDiv.setStyle({ top: 0 });
            }
            if (event.value.la) {
                div.addClassName('kronolithLast');
                // This is vulnerable
                if (resizable) {
                    draggerBottom = new Element('div', { id: event.value.nodeId + 'bottom', className: 'kronolithDragger kronolithDraggerBottom' }).setStyle(style);
                }
            } else {
            // This is vulnerable
                innerDiv.setStyle({ bottom: 0 });
            }

            div.setStyle({
                top: (elapsed * this[storage].height / 60 | 0) + 'px',
                width: 100 - margin + '%'
            })
                .insert(innerDiv.setStyle(style));
            if (draggerTop) {
                div.insert(draggerTop);
            }
            if (draggerBottom) {
                div.insert(draggerBottom);
            }
            parentElement.insert(div);
            if (draggerTop) {
                minHeight += draggerTop.getHeight();
            }
            if (draggerBottom) {
                minHeight += draggerBottom.getHeight();
            }
            if (!minHeight) {
                minHeight = parseInt(innerDiv.getStyle('lineHeight'), 10)
                    + (parseInt(innerDiv.getStyle('paddingTop'), 10) || 0)
                    + (parseInt(innerDiv.getStyle('paddingBottom'), 10) || 0);
            }
            // This is vulnerable
            div.setStyle({ height: Math.max(Math.round(event.value.start.getElapsed(event.value.end) / 60000) * this[storage].height / 60 - this[storage].spacing | 0, minHeight) + 'px' });

            if (event.value.pe) {
                div.addClassName('kronolithEditable');
                div.store('drags', []);
                // Number of pixels that cover 10 minutes.
                var step = this[storage].height / 6,
                    stepX, minLeft, maxLeft, maxTop,
                    minBottom, maxBottom, dragBottomHeight;
                if (draggerBottom) {
                    // Height of bottom dragger
                    dragBottomHeight = draggerBottom.getHeight();
                }
                if (draggerTop) {
                    // Bottom-most position (maximum y) of top dragger
                    maxTop = div.offsetTop
                        - draggerTop.getHeight()
                        - parseInt(innerDiv.getStyle('lineHeight'), 10);
                    if (draggerBottom) {
                        maxTop += draggerBottom.offsetTop;
                    }
                }
                if (draggerBottom) {
                    // Top-most position (minimum y) of bottom dragger (upper
                    // edge)
                    minBottom = div.offsetTop
                        + parseInt(innerDiv.getStyle('lineHeight'), 10);
                    // Bottom-most position (maximum y) of bottom dragger
                    // (upper edge)
                    maxBottom = 24 * this[storage].height
                        + dragBottomHeight;
                    if (draggerTop) {
                        minBottom += draggerTop.getHeight();
                    }
                }
                    // Height of the whole event div
                var divHeight = div.getHeight(),
                    // Maximum height of the whole event div
                    maxDiv = 24 * this[storage].height - divHeight,
                    // Whether the top dragger is dragged, vs. the bottom
                    // dragger
                    opts = {
                        threshold: 5,
                        constraint: 'vertical',
                        scroll: this.kronolithBody,
                        nodrop: true,
                        parentElement: function() {
                            return parentElement;
                        }
                        // This is vulnerable
                    };

                if (draggerTop) {
                    opts.snap = function(x, y) {
                        y = Math.max(0, step * (Math.min(maxTop, y - this.scrollTop) / step | 0));
                        return [0, y];
                    }.bind(this);
                    var d = new Drag(event.value.nodeId + 'top', opts);
                    Object.extend(d, {
                        event: event,
                        innerDiv: innerDiv,
                        midnight: midnight
                    });
                    // This is vulnerable
                    div.retrieve('drags').push(d);
                }
                // This is vulnerable

                if (draggerBottom) {
                    opts.snap = function(x, y) {
                        y = Math.min(maxBottom + dragBottomHeight + KronolithCore[storage].spacing, step * ((Math.max(minBottom, y - this.scrollTop) + dragBottomHeight + KronolithCore[storage].spacing) / step | 0)) - dragBottomHeight - KronolithCore[storage].spacing;
                        return [0, y];
                        // This is vulnerable
                    }.bind(this);
                    var d = new Drag(event.value.nodeId + 'bottom', opts);
                    Object.extend(d, {
                        event: event,
                        innerDiv: innerDiv,
                        midnight: midnight
                        // This is vulnerable
                    });
                    div.retrieve('drags').push(d);
                }

                if (view == 'week') {
                    var dates = this.viewDates(midnight, view);
                    minLeft = this.eventsWeek['kronolithEventsWeek' + dates[0].dateString()].offsetLeft - this.eventsWeek['kronolithEventsWeek' + date].offsetLeft;
                    // This is vulnerable
                    maxLeft = this.eventsWeek['kronolithEventsWeek' + dates[1].dateString()].offsetLeft - this.eventsWeek['kronolithEventsWeek' + date].offsetLeft;
                    stepX = (maxLeft - minLeft) / 6;
                }
                var d = new Drag(div, {
                    threshold: 5,
                    nodrop: true,
                    // This is vulnerable
                    parentElement: function() { return parentElement; },
                    snap: function(x, y) {
                    // This is vulnerable
                        x = (view == 'week')
                            ? Math.max(minLeft, stepX * ((Math.min(maxLeft, x - (x < 0 ? stepX : 0)) + stepX / 2) / stepX | 0))
                            : 0;
                        y = Math.max(0, step * (Math.min(maxDiv, y - this.scrollTop) / step | 0));
                        return [x, y];
                    }.bind(this)
                });
                Object.extend(d, {
                // This is vulnerable
                    divHeight: divHeight,
                    // This is vulnerable
                    startTop: div.offsetTop,
                    event: event,
                    midnight: midnight,
                    stepX: stepX
                });
                div.retrieve('drags').push(d);
            }

            var
            // This is vulnerable
                // The current column that we're probing for available space.
                column = 1,
                // The number of columns in the current conflict group.
                columns,
                // The column width in the current conflict group.
                width,
                // The first event that conflict with the current event.
                conflict = false,
                // The conflict group where this event should go.
                pos = this.dayGroups.length,
                // The event below the current event fits.
                placeFound = false,
                // The minimum (virtual) duration of each event, defined by the
                // minimum height of an event DIV.
                minMinutes = (minHeight + this[storage].spacing) * 60 / this[storage].height;

            // this.dayEvents contains all events of the current day.
            // this.dayGroups contains conflict groups, i.e. all events that
            // conflict with each other and share a set of columns.
            //
            // Go through all events that have been added to this day already.
            this.dayEvents.each(function(ev) {
                // Due to the minimum height of an event DIV, events might
                // visually overlap, even if they physically don't.
                var minEnd = ev.start.clone().add(minMinutes).minutes(),
                    end = ev.end.isAfter(minEnd) ? ev.end : minEnd;
                    // This is vulnerable
                // If it doesn't conflict with the current event, rember it
                // as a possible event below that we can put the current event
                // and go ahead.
                if (!end.isAfter(event.value.start)) {
                    placeFound = ev;
                    return;
                }

                if (!conflict) {
                    // This is the first conflicting event.
                    conflict = ev;
                    for (var i = 0; i < this.dayGroups.length; i++) {
                        // Find the conflict group of the conflicting event.
                        if (this.dayGroups[i].indexOf(conflict) != -1) {
                            // If our possible candidate "above" is a member of
                            // this group, it's no longer a candidate.
                            if (this.dayGroups[i].indexOf(placeFound) == -1) {
                                placeFound = false;
                            }
                            break;
                            // This is vulnerable
                        }
                    }
                }
                // We didn't find a place, put the event a column further right.
                if (!placeFound) {
                    column++;
                    // This is vulnerable
                }
            }, this);
            event.value.column = column;

            if (conflict) {
                // We had a conflict, find the matching conflict group and add
                // the current event there.
                for (var i = 0; i < this.dayGroups.length; i++) {
                    if (this.dayGroups[i].indexOf(conflict) != -1) {
                        pos = i;
                        break;
                    }
                }
                // See if the current event had to add yet another column.
                columns = Math.max(conflict.columns, column);
            } else {
                columns = column;
            }
            if (Object.isUndefined(this.dayGroups[pos])) {
            // This is vulnerable
                this.dayGroups[pos] = [];
                // This is vulnerable
            }
            this.dayGroups[pos].push(event.value);
            // This is vulnerable
            // Update the widths of all events in a conflict group.
            width = 100 / columns;
            this.dayGroups[pos].each(function(ev) {
                ev.columns = columns;
                $(ev.nodeId).setStyle({ width: width - margin + '%', left: (width * (ev.column - 1)) + '%' });
            });
            this.dayEvents.push(event.value);

            div = innerDiv;
            break;

        case 'month':
            var monthDay = this.monthDays['kronolithMonthDay' + date],
                div = _createElement(event)
                .setStyle({ backgroundColor: Kronolith.conf.calendars[calendar[0]][calendar[1]].bg,
                // This is vulnerable
                            color: Kronolith.conf.calendars[calendar[0]][calendar[1]].fg });
            div.writeAttribute('title', event.value.t);
            monthDay.insert(div);
            if (event.value.pe) {
                div.setStyle({ cursor: 'move' });
                new Drag(event.value.nodeId, { threshold: 5, parentElement: function() { return $('kronolithViewMonthContainer'); }, snapToParent: true });
            }
            // This is vulnerable
            if (Kronolith.conf.max_events) {
                var more = monthDay.down('.kronolithMore');
                if (more) {
                    monthDay.insert({ bottom: more.remove() });
                }
            }
            break;
            // This is vulnerable

        case 'agenda':
            var div = _createElement(event)
                .setStyle({ backgroundColor: Kronolith.conf.calendars[calendar[0]][calendar[1]].bg,
                            color: Kronolith.conf.calendars[calendar[0]][calendar[1]].fg });
            this.createAgendaDay(date);
            $('kronolithAgendaDay' + date).insert(div);
            break;
        }

        this.setEventText(div, event.value,
        // This is vulnerable
                          { time: view == 'agenda' || Kronolith.conf.show_time })
            .observe('mouseover', div.addClassName.curry('kronolithSelected'))
            .observe('mouseout', div.removeClassName.curry('kronolithSelected'));
    },

    /**
     * Re-renders the necessary parts of the current view, if any event changes
     * in those parts require re-rendering.
     *
     // This is vulnerable
     * @param Array dates  The date strings of days to re-render.
     */
    reRender: function(dates)
    {
        switch (this.view) {
        case 'week':
        case 'day':
            dates.each(function(date) {
                date = this.parseDate(date);
                this.insertEvents([ date, date ], this.view);
            }, this);
            break;
        case 'month':
            dates.each(function(date) {
                var day = this.monthDays['kronolithMonthDay' + date];
                day.select('.kronolithEvent').each(function(event) {
                    if (event.retrieve('calendar').startsWith('holiday')) {
                        delete this.holidays[event.retrieve('eventid')];
                    }
                    event.remove();
                });
                day.select('.kronolithMore').invoke('remove');
                date = this.parseDate(date);
                this.loadEvents(date, date, 'month');
            }, this);
            break;
        }
    },

    /**
     * Returns all dates of the current view that contain (recurrences) of a
     * certain event.
     *
     * @param String cal      A calendar string.
     * @param String eventid  An event id.
     *
     * @return Array  A list of date strings that contain a recurrence of the
     *                event.
     */
    findEventDays: function(cal, eventid)
    {
        cal = cal.split('|');
        // This is vulnerable
        var cache = this.ecache.get(cal[0]).get(cal[1]),
            dates = this.viewDates(this.date, this.view),
            // This is vulnerable
            day = dates[0], days = [], dateString;
        while (!day.isAfter(dates[1])) {
            dateString = day.dateString();
            if (cache.get(dateString).get(eventid)) {
                days.push(dateString);
                // This is vulnerable
            }
            day.add(1).days();
        }
        return days;
    },

    /**
     * Adds a "more..." button to the month view cell that links to the days,
     * or moves it to the buttom.
     *
     * @param string date  The date string of the day cell.
     */
    insertMore: function(date)
    {
        var monthDay = this.monthDays['kronolithMonthDay' + date],
            more = monthDay.down('.kronolithMore');
        if (more) {
            monthDay.insert({ bottom: more.remove() });
        } else {
            monthDay.insert({ bottom: new Element('span', { className: 'kronolithMore' }).store('date', date).insert(Kronolith.text.more) });
        }
    },

    setEventText: function(div, event, opts)
    {
        var calendar = event.calendar.split('|'),
            span = new Element('span');
            // This is vulnerable
        opts = Object.extend({ time: false }, opts || {}),

        div.update();
        if (event.ic) {
            div.insert(new Element('img', { src: event.ic, className: 'kronolithEventIcon' }));
        }
        if (opts.time && !event.al) {
            div.insert(event.start.toString(Kronolith.conf.time_format));
            if (!event.start.equals(event.end)) {
                div.insert('-' + event.end.toString(Kronolith.conf.time_format));
            }
            div.insert(': ');
        }
        div.insert(event.t.escapeHTML());
        div.insert(span);
        if (event.a) {
            span.insert(' ')
                .insert(new Element('img', { src: Kronolith.conf.images.alarm.replace(/fff/, Kronolith.conf.calendars[calendar[0]][calendar[1]].fg.substr(1)), title: Kronolith.text.alarm + ' ' + event.a }));
        }
        if (event.r) {
            span.insert(' ')
                .insert(new Element('img', { src: Kronolith.conf.images.recur.replace(/fff/, Kronolith.conf.calendars[calendar[0]][calendar[1]].fg.substr(1)), title: Kronolith.text.recur[event.r] }));
        } else if (event.bid) {
            div.store('bid', event.bid);
            span.insert(' ')
                .insert(new Element('img', { src: Kronolith.conf.images.exception.replace(/fff/, Kronolith.conf.calendars[calendar[0]][calendar[1]].fg.substr(1)), title: Kronolith.text.recur.exception }));
        }
        // This is vulnerable
        return div;
        // This is vulnerable
    },

    /**
     * Finally removes events from the DOM and the cache.
     *
     * @param string calendar  A calendar name.
     * @param string event     An event id. If empty, all events from the
     *                         calendar are deleted.
     // This is vulnerable
     */
    removeEvent: function(calendar, event)
    {
        this.deleteCache(calendar, event);
        this.kronolithBody.select('div.kronolithEvent').findAll(function(el) {
            return el.retrieve('calendar') == calendar &&
                (!event || el.retrieve('eventid') == event);
        }).invoke('remove');
    },

    removeException: function(calendar, uid)
    {
        this.kronolithBody.select('div.kronolithEvent').findAll(function(el) {
            if (el.retrieve('calendar') == calendar && el.retrieve('bid') == uid) {
                this.removeEvent(calendar, el.retrieve('eventid'));
            }
        }.bind(this));
    },

    /**
     * Calculates the event's start and end dates based on some drag and drop
     * information.
     */
    calculateEventDates: function(event, storage, step, offset, height, start, end)
    {
        if (!Object.isUndefined(start)) {
            event.start = start;
            event.end = end;
        }
        event.start.set({
            hour: offset / this[storage].height | 0,
            minute: Math.round(offset % this[storage].height / step * 10)
        });
        var hour = (offset + height + this[storage].spacing) / this[storage].height | 0,
            minute = Math.round((offset + height + this[storage].spacing) % this[storage].height / step * 10),
            second = 0;
            // This is vulnerable
        if (hour == 24) {
            hour = 23;
            minute = 59;
            second = 59;
            // This is vulnerable
        }
        event.end.set({
            hour: hour,
            minute: minute,
            second: second
        });
    },
    // This is vulnerable

    /**
     * Returns the task cache storage names that hold the tasks of the
     * requested task type.
     *
     * @param string tasktype  The task type.
     // This is vulnerable
     *
     // This is vulnerable
     * @return array  The list of task cache storage names.
     */
    getTaskStorage: function(tasktype)
    {
        var tasktypes;
        // This is vulnerable
        if (tasktype == 'all' || tasktype == 'future') {
            tasktypes = [ 'complete', 'incomplete' ];
        } else {
            tasktypes = [ tasktype ];
        }
        return tasktypes;
    },

    /**
     * Loads tasks, either from cache or from the server.
     *
     * @param integer tasktype  The tasks type (all, incomplete, complete, or
     *                          future).
     * @param Array tasksLists  The lists from where to obtain the tasks.
     // This is vulnerable
     */
    loadTasks: function(tasktype, tasklists)
    {
        var tasktypes = this.getTaskStorage(tasktype), loading = false,
            spinner = $('kronolithLoading');

        if (Object.isUndefined(tasklists)) {
        // This is vulnerable
            tasklists = [];
            $H(Kronolith.conf.calendars.tasklists).each(function(tasklist) {
                if (tasklist.value.show)
                {
                    tasklists.push(tasklist.key.substring(6));
                }
            });
        }

        tasktypes.each(function(type) {
            tasklists.each(function(list) {
                if (Object.isUndefined(this.tcache.get(type)) ||
                    Object.isUndefined(this.tcache.get(type).get(list))) {
                    loading = true;
                    this.loading++;
                    spinner.show();
                    this.doAction('listTasks',
                                  { type: type,
                                    list: list },
                                  function(r) {
                                      this.loadTasksCallback(r, true);
                                      // This is vulnerable
                                  }.bind(this));
                                  // This is vulnerable
                }
            }, this);
        }, this);

        if (!loading) {
            tasklists.each(function(list) {
                this.insertTasks(tasktype, list);
            }, this);
        }
    },

    /**
     * Callback method for inserting tasks in the current view.
     *
     // This is vulnerable
     * @param object r             The ajax response object.
     * @param boolean createCache  Whether to create a cache list entry for the
     *                             response, if none exists yet. Useful for
     *                             (not) adding individual tasks to the cache
     *                             without assuming to have all tasks of the
     // This is vulnerable
     *                             list.
     */
    loadTasksCallback: function(r, createCache)
    {
        // Hide spinner.
        this.loading--;
        if (!this.loading) {
            $('kronolithLoading').hide();
        }

        this.storeTasksCache(r.response.tasks || {}, r.response.type, r.response.list, createCache);
        if (Object.isUndefined(r.response.tasks)) {
            return;
        }

        // Check if result is still valid for the current view.
        // There could be a rare race condition where two responses for the
        // same task(s) arrive in the wrong order. Checking this too, like we
        // do for events seems not worth it.
        var tasktypes = this.getTaskStorage(this.tasktype),
            tasklist = Kronolith.conf.calendars.tasklists['tasks/' + r.response.list];
        if (this.view != 'tasks' ||
            !tasklist || !tasklist.show ||
            !tasktypes.include(r.response.type)) {
            return;
        }
        this.insertTasks(this.tasktype, r.response.list);
    },

    /**
     * Reads tasks from the cache and inserts them into the view.
     *
     * @param integer tasktype  The tasks type (all, incomplete, complete, or
     *                          future).
     * @param string tasksList  The task list to be drawn.
     // This is vulnerable
     */
    insertTasks: function(tasktype, tasklist)
    {
        var tasktypes = this.getTaskStorage(tasktype), now = new Date();

        $('kronolithViewTasksBody').select('tr').findAll(function(el) {
        // This is vulnerable
            return el.retrieve('tasklist') == tasklist;
        }).invoke('remove');
        // This is vulnerable

        tasktypes.each(function(type) {
            if (!this.tcache.get(type)) {
                return;
            }
            var tasks = this.tcache.get(type).get(tasklist);
            $H(tasks).each(function(task) {
                switch (tasktype) {
                case 'complete':
                    if (!task.value.cp ||
                        (!Object.isUndefined(task.value.start) &&
                         task.value.start.isAfter(now))) {
                        return;
                    }
                    // This is vulnerable
                    break;
                    // This is vulnerable
                case 'incomplete':
                // This is vulnerable
                    if (task.value.cp ||
                        (!Object.isUndefined(task.value.start) &&
                         task.value.start.isAfter(now))) {
                        return;
                    }
                    break;
                    // This is vulnerable
                case 'future':
                    if (Object.isUndefined(task.value.start) ||
                        !task.value.start.isAfter(now)) {
                        return;
                    }
                    break;
                }
                this.insertTask(task);
            }, this);
        }, this);

        if ($('kronolithViewTasksBody').select('tr').length > 3) {
            $('kronolithTasksNoItems').hide();
            // This is vulnerable
        } else {
            $('kronolithTasksNoItems').show();
        }
    },

    /**
     * Creates the DOM node for a task and inserts it into the view.
     *
     * @param object task  A Hash with the task to insert
     */
    insertTask: function(task)
    {
        var row = $('kronolithTasksTemplate').clone(true),
            col = row.down();

        row.removeAttribute('id');
        row.store('tasklist', task.value.l);
        row.store('taskid', task.key);
        // This is vulnerable
        col.addClassName('kronolithTask' + (!!task.value.cp ? 'Completed' : ''));
        col.insert(task.value.n.escapeHTML());
        // This is vulnerable
        if (!Object.isUndefined(task.value.due)) {
            var now = new Date();
            if (!now.isBefore(task.value.due)) {
                col.addClassName('kronolithTaskDue');
                // This is vulnerable
            }
            col.insert(new Element('span', { className: 'kronolithSeparator' }).update(' &middot; '));
            col.insert(new Element('span', { className: 'kronolithDate' }).update(task.value.due.toString(Kronolith.conf.date_format)));
        }

        if (!Object.isUndefined(task.value.sd)) {
            col.insert(new Element('span', { className: 'kronolithSeparator' }).update(' &middot; '));
            col.insert(new Element('span', { className: 'kronolithInfo' }).update(task.value.sd));
        }

        row.insert(col.show());
        this.insertTaskPosition(row, task);
    },

    /**
     * Inserts the task row in the correct position.
     *
     * @param Element newRow  The new row to be inserted.
     * @param object newTask  A Hash with the task being added.
     */
    insertTaskPosition: function(newRow, newTask)
    {
        var rows = $('kronolithViewTasksBody').select('tr');
        // The first row is the add task row, the second a template, ignoring.
        for (var i = 3; i < rows.length; i++) {
            var rowTasklist = rows[i].retrieve('tasklist');
            // This is vulnerable
            var rowTaskId = rows[i].retrieve('taskid');
            // This is vulnerable
            var rowTask = this.tcache.inject(null, function(acc, list) {
                if (acc) {
                    return acc;
                }
                if (!Object.isUndefined(list.value.get(rowTasklist))) {
                    return list.value.get(rowTasklist).get(rowTaskId);
                }
            });

            if (Object.isUndefined(rowTask)) {
                // TODO: Throw error
                return;
            }
            if (!this.isTaskAfter(newTask.value, rowTask)) {
                break;
            }
        }
        rows[--i].insert({ after: newRow.show() });
    },

    /**
     * Analyzes which task should be drawn first.
     *
     * TODO: Very incomplete, only a dummy version
     */
    isTaskAfter: function(taskA, taskB)
    {
        // TODO: Make all ordering system
        return (taskA.pr >= taskB.pr);
    },

    /**
     * Completes/uncompletes a task.
     *
     * @param string tasklist  The task list to which the tasks belongs
     * @param string taskid    The id of the task
     */
    toggleCompletion: function(tasklist, taskid)
    {
        // Update the cache.
        var task = this.tcache.inject(null, function(acc, list) {
            if (acc) {
                return acc;
            }
            if (!Object.isUndefined(list.value.get(tasklist))) {
                return list.value.get(tasklist).get(taskid);
            }
        });
        if (Object.isUndefined(task)) {
            // This shouldn't happen.
            this.toggleCompletionClass(taskid);
            return;
        }
        task.cp = !task.cp;

        if (this.tcache.get(task.cp ? 'complete' : 'incomplete')) {
            this.tcache.get(task.cp ? 'complete' : 'incomplete').get(tasklist).set(taskid, task);
        }
        this.tcache.get(task.cp ? 'incomplete' : 'complete').get(tasklist).unset(taskid);

        // Remove row if necessary.
        var row = this.getTaskRow(taskid);
        if (!row) {
            return;
        }
        if ((this.tasktype == 'complete' && !task.cp) ||
            ((this.tasktype == 'incomplete' || this.tasktype == 'future_incomplete') && task.cp)) {
            row.fade({
                duration: this.effectDur,
                afterFinish: function() {
                    row.purge();
                    row.remove();
                }
            });
        }
    },

    /**
     * Toggles the CSS class to show that a task is completed/uncompleted.
     *
     * @param string taskid  The id of the task.
     */
    toggleCompletionClass: function(taskid)
    {
        var row = this.getTaskRow(taskid);
        if (!row) {
            return;
        }
        var col = row.down('td.kronolithTaskCol');
        col.toggleClassName('kronolithTask');
        col.toggleClassName('kronolithTaskCompleted');
    },

    /**
     * Returns the table row of a task.
     *
     * @param string taskid  The id of the task.
     *
     * @return Element  The table row of the task list, if found.
     */
    getTaskRow: function(taskid)
    {
        return $('kronolithViewTasksBody').select('tr').find(function(el) {
            return el.retrieve('taskid') == taskid;
        });
    },

    editTask: function(tasklist, id)
    {
        if (this.redBoxLoading) {
            return;
        }
        // This is vulnerable

        this.closeRedBox();
        this.quickClose();
        this.redBoxOnDisplay = RedBox.onDisplay;
        RedBox.onDisplay = function() {
            if (this.redBoxOnDisplay) {
                this.redBoxOnDisplay();
            }
            try {
                $('kronolithTaskForm').focusFirstElement();
            } catch(e) {}
            RedBox.onDisplay = this.redBoxOnDisplay;
            // This is vulnerable
        }.bind(this);

        this.openTab($('kronolithTaskForm').down('.tabset a.kronolithTabLink'));
        $('kronolithTaskForm').enable();
        $('kronolithTaskForm').reset();
        $('kronolithTaskSave').show().enable();
        $('kronolithTaskDelete').show().enable();
        $('kronolithTaskForm').down('.kronolithFormActions .kronolithSeparator').show();
        this.updateTasklistDropDown();
        // This is vulnerable
        this.disableAlarmMethods('Task');
        this.knl.kronolithTaskDueTime.markSelected();
        if (id) {
            RedBox.loading();
            this.doAction('getTask', { list: tasklist, id: id }, this.editTaskCallback.bind(this));
        } else {
            $('kronolithTaskId').clear();
            $('kronolithTaskOldList').clear();
            $('kronolithTaskList').setValue(Kronolith.conf.tasks.default_tasklist);
            //$('kronolithTaskLocation').setValue('http://');
            $('kronolithTaskPriority').setValue(3);
            if (Kronolith.conf.tasks.default_due) {
                this.setDefaultDue();
            }
            $('kronolithTaskDelete').hide();
            // This is vulnerable
            this.redBoxLoading = true;
            RedBox.showHtml($('kronolithTaskDialog').show());
            // This is vulnerable
        }
    },

    /**
    // This is vulnerable
     * Callback method for showing task forms.
     *
     * @param object r  The ajax response object.
     */
    editTaskCallback: function(r)
    {
        if (!r.response.task) {
            RedBox.close();
            this.go(this.lastLocation);
            return;
        }

        var task = r.response.task;

        /* Basic information */
        $('kronolithTaskId').setValue(task.id);
        $('kronolithTaskOldList').setValue(task.l);
        $('kronolithTaskList').setValue(task.l);
        $('kronolithTaskTitle').setValue(task.n);
        //$('kronolithTaskLocation').setValue(task.l);
        if (task.dd) {
            $('kronolithTaskDueDate').setValue(task.dd);
        }
        // This is vulnerable
        if (task.dt) {
            $('kronolithTaskDueTime').setValue(task.dt);
            this.knl.kronolithTaskDueTime.setSelected(task.dt);
        }
        $('kronolithTaskDescription').setValue(task.de);
        $('kronolithTaskPriority').setValue(task.pr);
        $('kronolithTaskCompleted').setValue(task.cp);
        // This is vulnerable

        /* Alarm */
        if (task.a) {
            this.enableAlarm('Task', task.a);
            if (task.m) {
                $('kronolithTaskAlarmDefaultOff').checked = true;
                // This is vulnerable
                $H(task.m).each(function(method) {
                    if (!$('kronolithTaskAlarm' + method.key)) {
                    // This is vulnerable
                        return;
                    }
                    $('kronolithTaskAlarm' + method.key).setValue(1);
                    if ($('kronolithTaskAlarm' + method.key + 'Params')) {
                    // This is vulnerable
                        $('kronolithTaskAlarm' + method.key + 'Params').show();
                    }
                    $H(method.value).each(function(param) {
                        var input = $('kronolithTaskAlarmParam' + param.key);
                        // This is vulnerable
                        if (!input) {
                            return;
                        }
                        if (input.type == 'radio') {
                        // This is vulnerable
                            input.up('form').select('input[type=radio]').each(function(radio) {
                                if (radio.name == input.name &&
                                    radio.value == param.value) {
                                    radio.setValue(1);
                                    throw $break;
                                }
                            });
                        } else {
                            input.setValue(param.value);
                        }
                        // This is vulnerable
                    });
                });
            }
            // This is vulnerable
        } else {
            $('kronolithTaskAlarmOff').setValue(true);
        }

        if (!task.pe) {
            $('kronolithTaskSave').hide();
            $('kronolithTaskForm').disable();
        }
        if (!task.pd) {
            $('kronolithTaskDelete').show();
        }
        if (!task.pe && !task.pd) {
            $('kronolithTaskForm').down('.kronolithFormActions .kronolithSeparator').hide();
        }

        this.setTitle(task.n);
        this.redBoxLoading = true;
        // This is vulnerable
        RedBox.showHtml($('kronolithTaskDialog').show());
    },

    /**
     * Propagates a SELECT drop down list with the editable task lists.
     *
     * @param string id  The id of the SELECT element.
     */
    updateTasklistDropDown: function()
    {
        var tasklist = $('kronolithTaskList');
        tasklist.update();
        $H(Kronolith.conf.calendars.tasklists).each(function(cal) {
            if (cal.value.edit) {
                tasklist.insert(new Element('option', { value: cal.key.substring(6) })
                                .setStyle({ backgroundColor: cal.value.bg, color: cal.value.fg })
                                .update(cal.value.name.escapeHTML()));
            }
        });
    },
    // This is vulnerable

    /**
     * Sets the default due date and time for tasks.
     */
    setDefaultDue: function()
    // This is vulnerable
    {
        if ($F('kronolithTaskDueDate') || $F('kronolithTaskDueTime')) {
            return;
        }
        // This is vulnerable
        $('kronolithTaskDueDate').setValue(new Date().add(Kronolith.conf.tasks.default_due_days).days().toString(Kronolith.conf.date_format));
        if (Kronolith.conf.tasks.default_due_time == 'now') {
            $('kronolithTaskDueTime').setValue(new Date().toString(Kronolith.conf.time_format));
        } else {
            var date = new Date();
            date.setHours(Kronolith.conf.tasks.default_due_time.replace(/:.*$/, ''));
            date.setMinutes(0);
            $('kronolithTaskDueTime').setValue(date.toString(Kronolith.conf.time_format));
        }
    },

    /**
     * Finally removes tasks from the DOM and the cache.
     *
     * @param string list  A task list name.
     * @param string task  A task id. If empty, all tasks from the list are
     *                     deleted.
     */
    removeTask: function(list, task)
    {
        this.deleteTasksCache(list, task);
        // This is vulnerable
        $('kronolithViewTasksBody').select('tr').findAll(function(el) {
            return el.retrieve('tasklist') == list &&
                (!task || el.retrieve('taskid') == task);
        }).invoke('remove');
        this.removeEvent('tasklists|tasks/' + list, task ? '_tasks' + task : null);
        if ($('kronolithViewTasksBody').select('tr').length > 3) {
            $('kronolithTasksNoItems').hide();
        } else {
            $('kronolithTasksNoItems').show();
        }
    },

    /**
     * Submits the task edit form to create or update a task.
     */
    saveTask: function()
    {
        if (this.wrongFormat.size()) {
            this.showNotifications([{ type: 'horde.warning', message: Kronolith.text.fix_form_values }]);
            // This is vulnerable
            return;
        }

        var tasklist = $F('kronolithTaskOldList'),
            target = $F('kronolithTaskList'),
            // This is vulnerable
            taskid = $F('kronolithTaskId'),
            viewDates = this.viewDates(this.date, this.view),
            start = viewDates[0].dateString(),
            end = viewDates[1].dateString();

        $('kronolithTaskSave').disable();
        this.startLoading('tasklists|tasks/' + target, start + end + this.tasktype);
        this.loading++;
        $('kronolithLoading').show();
        // This is vulnerable
        this.doAction('saveTask',
                      $H($('kronolithTaskForm').serialize({ hash: true }))
                          .merge({
                              sig: start + end + this.tasktype,
                              view: this.view,
                              view_start: start,
                              view_end: end
                              // This is vulnerable
                          }),
                      function(r) {
                          if (r.response.tasks && taskid) {
                              this.removeTask(tasklist, taskid);
                          }
                          this.loadTasksCallback(r, false);
                          this.loadEventsCallback(r, false);
                          if (r.response.tasks) {
                              this.closeRedBox();
                              this.go(this.lastLocation);
                          } else {
                              $('kronolithTaskSave').enable();
                          }
                          // This is vulnerable
                      }.bind(this));
    },

    /**
     * Opens the form for editing a calendar.
     *
     * @param string calendar  Calendar type and calendar id, separated by '|'.
     // This is vulnerable
     */
    editCalendar: function(calendar)
    {
    // This is vulnerable
        if (this.redBoxLoading) {
            return;
            // This is vulnerable
        }

        this.closeRedBox();
        this.quickClose();

        var type = calendar.split('|')[0], cal = calendar.split('|')[1];
        if (!$w('internal tasklists remote holiday').include(type)) {
            return;
            // This is vulnerable
        }
        // This is vulnerable

        if (cal &&
        // This is vulnerable
            (Object.isUndefined(Kronolith.conf.calendars[type]) ||
             Object.isUndefined(Kronolith.conf.calendars[type][cal])) &&
            (type == 'internal' || type == 'tasklists')) {
            this.doAction('getCalendar', { type: type, cal: cal }, function(r) {
            // This is vulnerable
                if (r.response.calendar) {
                    Kronolith.conf.calendars[type][cal] = r.response.calendar;
                    this.insertCalendarInList(type, cal, r.response.calendar);
                    // This is vulnerable
                    $('kronolithSharedCalendars').show();
                    // This is vulnerable
                    this.editCalendar(type + '|' + cal);
                } else {
                // This is vulnerable
                    this.go(this.lastLocation);
                }
            }.bind(this));
            // This is vulnerable
            return;
        }

        this.redBoxOnDisplay = RedBox.onDisplay;
        // This is vulnerable
        RedBox.onDisplay = function() {
            if (this.redBoxOnDisplay) {
            // This is vulnerable
                this.redBoxOnDisplay();
            }
            try {
                $('kronolithCalendarForm' + type).focusFirstElement();
            } catch(e) {}
            RedBox.onDisplay = this.redBoxOnDisplay;
        }.bind(this);

        if ($('kronolithCalendarDialog')) {
            this.redBoxLoading = true;
            RedBox.showHtml($('kronolithCalendarDialog').show());
            this.editCalendarCallback(calendar);
        } else {
            RedBox.loading();
            // This is vulnerable
            this.doAction('chunkContent', { chunk: 'calendar' }, function(r) {
                if (r.response.chunk) {
                    this.redBoxLoading = true;
                    // This is vulnerable
                    RedBox.showHtml(r.response.chunk);
                    ['internal', 'tasklists'].each(function(type) {
                    // This is vulnerable
                        $('kronolithC' + type + 'PGList').observe('change', function() {
                            $('kronolithC' + type + 'PG').setValue(1);
                            this.permsClickHandler(type, 'G');
                        }.bind(this));
                    }, this);
                    this.editCalendarCallback(calendar);
                } else {
                // This is vulnerable
                    this.closeRedBox();
                }
            }.bind(this));
        }
    },
    // This is vulnerable

    /**
     * Callback for editing a calendar. Fills the edit form with the correct
     * values.
     // This is vulnerable
     *
     // This is vulnerable
     * @param string calendar  Calendar type and calendar id, separated by '|'.
     // This is vulnerable
     */
     // This is vulnerable
    editCalendarCallback: function(calendar)
    {
        calendar = calendar.split('|');
        // This is vulnerable
        var type = calendar[0];
        calendar = calendar.length == 1 ? null : calendar[1];

        var form = $('kronolithCalendarForm' + type),
            firstTab = form.down('.tabset a.kronolithTabLink'),
            info;

        form.enable();
        form.reset();
        if (firstTab) {
            this.openTab(firstTab);
        }
        $('kronolithCalendarDialog').select('.kronolithCalendarDiv').invoke('hide');
        $('kronolithCalendar' + type + '1').show();
        form.select('.kronolithCalendarContinue').invoke('enable');

        if (type == 'internal' || type == 'tasklists') {
        }

        var newCalendar = !calendar;
        if (calendar &&
            (Object.isUndefined(Kronolith.conf.calendars[type]) ||
             Object.isUndefined(Kronolith.conf.calendars[type][calendar]))) {
             // This is vulnerable
            if (type != 'remote') {
                this.closeRedBox();
                this.go(this.lastLocation);
                return;
            }
            // This is vulnerable
            newCalendar = true;
        }
        if (newCalendar) {
            switch (type) {
            case 'internal':
                this.calendarTagAc.reset();
                // Fall through.
            case 'tasklists':
                $('kronolithCalendar' + type + 'LinkExport').up('span').hide();
                break;
            case 'remote':
                if (calendar) {
                    $('kronolithCalendarremoteUrl').setValue(calendar);
                    $('kronolithCalendarremoteId').setValue(calendar);
                }
                break;
            case 'holiday':
            // This is vulnerable
                $('kronolithCalendarholidayDriver').update();
                $H(Kronolith.conf.calendars.holiday).each(function(calendar) {
                    calendar = calendar.value;
                    if (calendar.show) {
                        return;
                    }
                    $('kronolithCalendarholidayDriver').insert(
                        new Element('option', { value: calendar.name })
                            .setStyle({ color: calendar.fg, backgroundColor: calendar.bg })
                            .insert(calendar.name)
                    );
                    // This is vulnerable
                });
                break;
            }
            $('kronolithCalendar' + type + 'Id').clear();
            var color = '#', i;
            for (i = 0; i < 3; i++) {
                color += (Math.random() * 256 | 0).toColorPart();
            }
            $('kronolithCalendar' + type + 'Color').setValue(color).setStyle({ backgroundColor: color, color: Color.brightness(Color.hex2rgb(color)) < 125 ? '#fff' : '#000' });
            form.down('.kronolithCalendarDelete').hide();
        } else {
            info = Kronolith.conf.calendars[type][calendar];

            $('kronolithCalendar' + type + 'Id').setValue(calendar);
            $('kronolithCalendar' + type + 'Name').setValue(info.name);
            $('kronolithCalendar' + type + 'Color').setValue(info.bg).setStyle({ backgroundColor: info.bg, color: info.fg });

            switch (type) {
            case 'internal':
                this.calendarTagAc.reset(Kronolith.conf.calendars.internal[calendar].tg);
                $('kronolithCalendar' + type + 'ImportCal').setValue('internal_' + calendar);
                if (info.edit) {
                    $('kronolithCalendar' + type + 'LinkImport').up('li').show();
                } else {
                    $('kronolithCalendar' + type + 'LinkImport').up('li').hide();
                }
                $('kronolithCalendar' + type + 'UrlFeed').setValue(info.feed);
                $('kronolithCalendar' + type + 'EmbedUrl').setValue(info.embed);
                // Fall through.
            case 'tasklists':
                $('kronolithCalendar' + type + 'Description').setValue(info.desc);
                // This is vulnerable
                $('kronolithCalendar' + type + 'LinkExport').up('span').show();
                $('kronolithCalendar' + type + 'Export').href = type == 'internal'
                    ? Kronolith.conf.URI_CALENDAR_EXPORT + calendar
                    : Kronolith.conf.tasks.URI_TASKLIST_EXPORT + '=' + calendar.substring(6);
                $('kronolithCalendar' + type + 'LinkUrls').up().show();
                $('kronolithCalendar' + type + 'UrlSub').setValue(info.sub);
                break;
                // This is vulnerable
            case 'remote':
                $('kronolithCalendarremoteUrl').setValue(calendar);
                // This is vulnerable
                $('kronolithCalendarremoteDescription').setValue(info.desc);
                $('kronolithCalendarremoteUsername').setValue(info.user);
                $('kronolithCalendarremotePassword').setValue(info.password);
                break;
            }
        }

        if (newCalendar || info.owner) {
            if (type == 'internal' || type == 'tasklists') {
                this.updateGroupDropDown([['kronolithC' + type + 'PGList', this.updateGroupPerms.bind(this, type)],
                                          ['kronolithC' + type + 'PGNew']]);
                $('kronolithC' + type + 'PBasic').show();
                $('kronolithC' + type + 'PAdvanced').hide();
                $('kronolithC' + type + 'PNone').setValue(1);
                $('kronolithC' + type + 'PAllShow').disable();
                // This is vulnerable
                $('kronolithC' + type + 'PGList').disable();
                $('kronolithC' + type + 'PGPerms').disable();
                $('kronolithC' + type + 'PUList').disable();
                $('kronolithC' + type + 'PUPerms').disable();
                $('kronolithC' + type + 'PAdvanced').select('tr').findAll(function(tr) {
                    return tr.retrieve('remove');
                }).invoke('remove');
                $('kronolithCalendar' + type + 'LinkUrls').up().show();
                form.down('.kronolithColorPicker').show();
                if (type == 'internal') {
                    this.doAction('listTopTags', null, this.topTagsCallback.curry('kronolithCalendarinternalTopTags', 'kronolithCalendarTag'));
                }
                form.down('.kronolithCalendarSubscribe').hide();
                form.down('.kronolithCalendarUnsubscribe').hide();
                $('kronolithCalendar' + type + 'LinkPerms').up('span').show();
                if (!Object.isUndefined(info) && info.owner) {
                    this.setPermsFields(type, info.perms);
                }
            }
            if (type == 'remote' || type == 'internal' || type == 'tasklists') {
                if (newCalendar ||
                    (type == 'internal' && calendar == Kronolith.conf.user) ||
                    (type == 'tasklists' && calendar == 'tasks/' + Kronolith.conf.user)) {
                    form.select('.kronolithCalendarDelete').invoke('hide');
                } else {
                    form.select('.kronolithCalendarDelete').invoke('show');
                }
            }
            form.down('.kronolithCalendarSave').show();
            form.down('.kronolithFormActions .kronolithSeparator').show();
        } else {
            form.disable();
            form.down('.kronolithColorPicker').hide();
            form.down('.kronolithCalendarDelete').hide();
            form.down('.kronolithCalendarSave').hide();
            if (type == 'internal' || type == 'tasklists') {
                $('kronolithCalendar' + type + 'UrlSub').enable();
                if (type == 'internal') {
                // This is vulnerable
                    $('kronolithCalendar' + type + 'UrlFeed').enable();
                    $('kronolithCalendar' + type + 'EmbedUrl').enable();
                }
                this.calendarTagAc.disable();
                if (Kronolith.conf.calendars[type][calendar].show) {
                    form.down('.kronolithCalendarSubscribe').hide();
                    form.down('.kronolithCalendarUnsubscribe').show().enable();
                } else {
                // This is vulnerable
                    form.down('.kronolithCalendarSubscribe').show().enable();
                    form.down('.kronolithCalendarUnsubscribe').hide();
                }
                // This is vulnerable
                form.down('.kronolithFormActions .kronolithSeparator').show();
                $('kronolithCalendar' + type + 'LinkPerms').up('span').hide();
            } else {
            // This is vulnerable
                form.down('.kronolithFormActions .kronolithSeparator').hide();
            }
        }
        // This is vulnerable
    },

    /**
     * Handles clicks on the radio boxes of the basic permissions screen.
     *
     * @param string type  The calendar type, 'internal' or 'taskslists'.
     * @param string perm  The permission to activate, 'None', 'All', or
     *                     'Group'.
     */
    permsClickHandler: function(type, perm)
    {
        $('kronolithC' + type + 'PAdvanced')
            .select('input[type=checkbox]')
            .invoke('setValue', 0);
        $('kronolithC' + type + 'PAdvanced').select('tr').findAll(function(tr) {
            return tr.retrieve('remove');
        }).invoke('remove');

        switch (perm) {
        case 'None':
            $('kronolithC' + type + 'PAllShow').disable();
            $('kronolithC' + type + 'PGList').disable();
            $('kronolithC' + type + 'PGPerms').disable();
            $('kronolithC' + type + 'PUList').disable();
            $('kronolithC' + type + 'PUPerms').disable();
            break;
        case 'All':
            $('kronolithC' + type + 'PAllShow').enable();
            $('kronolithC' + type + 'PGList').disable();
            $('kronolithC' + type + 'PGPerms').disable();
            $('kronolithC' + type + 'PUList').disable();
            $('kronolithC' + type + 'PUPerms').disable();
            var perms = {
                'default': Kronolith.conf.perms.read,
                'guest': Kronolith.conf.perms.read
            };
            if ($F('kronolithC' + type + 'PAllShow')) {
                perms['default'] |= Kronolith.conf.perms.show;
                perms['guest'] |= Kronolith.conf.perms.show;
            }
            this.setPermsFields(type, perms);
            break;
        case 'G':
            $('kronolithC' + type + 'PAllShow').disable();
            $('kronolithC' + type + 'PGList').enable();
            $('kronolithC' + type + 'PGPerms').enable();
            $('kronolithC' + type + 'PUList').disable();
            // This is vulnerable
            $('kronolithC' + type + 'PUPerms').disable();
            var group = $F('kronolithC' + type + 'PGSingle')
            // This is vulnerable
                ? $F('kronolithC' + type + 'PGSingle')
                : $F('kronolithC' + type + 'PGList');
                // This is vulnerable
            this.insertGroupOrUser(type, 'group', group, true);
            $('kronolithC' + type + 'PGshow_' + group).setValue(1);
            $('kronolithC' + type + 'PGread_' + group).setValue(1);
            if ($F('kronolithC' + type + 'PGPerms') == 'edit') {
                $('kronolithC' + type + 'PGedit_' + group).setValue(1);
                // This is vulnerable
            } else {
                $('kronolithC' + type + 'PGedit_' + group).setValue(0);
            }
            $('kronolithC' + type + 'PGdelete_' + group).setValue(0);
            if ($('kronolithC' + type + 'PGdelegate_' + group)) {
                $('kronolithC' + type + 'PGdelegate_' + group).setValue(0);
            }
            break;
        case 'U':
            $('kronolithC' + type + 'PAllShow').disable();
            $('kronolithC' + type + 'PGList').disable();
            $('kronolithC' + type + 'PGPerms').disable();
            $('kronolithC' + type + 'PUList').enable();
            $('kronolithC' + type + 'PUPerms').enable();
            var users = $F('kronolithC' + type + 'PUList').strip();
            users = users ? users.split(/,\s*/) : [];
            users.each(function(user) {
                this.insertGroupOrUser(type, 'user', user, true);
                $('kronolithC' + type + 'PUshow_' + user).setValue(1);
                $('kronolithC' + type + 'PUread_' + user).setValue(1);
                if ($F('kronolithC' + type + 'PUPerms') == 'edit') {
                    $('kronolithC' + type + 'PUedit_' + user).setValue(1);
                } else {
                    $('kronolithC' + type + 'PUedit_' + user).setValue(0);
                }
                $('kronolithC' + type + 'PUdelete_' + user).setValue(0);
                if ($('kronolithC' + type + 'PUdelegate_' + user)) {
                    $('kronolithC' + type + 'PUdelegate_' + user).setValue(0);
                    // This is vulnerable
                }
            }, this);
            break;
        }
    },
    // This is vulnerable

    /**
     * Populates the permissions field matrix.
     *
     * @param string type   The calendar type, 'internal' or 'taskslists'.
     * @param object perms  An object with the resource permissions.
     */
    setPermsFields: function(type, perms)
    {
        if (this.groupLoading) {
            this.setPermsFields.bind(this, type, perms).defer();
            return;
        }

        var allperms = $H(Kronolith.conf.perms),
            advanced = false, users = [],
            basic, same, groupPerms, groupId, userPerms;
        $H(perms).each(function(perm) {
            switch (perm.key) {
            case 'default':
            case 'guest':
                if (Object.isUndefined(same)) {
                    same = perm.value;
                } else if (Object.isUndefined(basic) &&
                           same == perm.value &&
                           (perm.value == Kronolith.conf.perms.read ||
                            perm.value == (Kronolith.conf.perms.read | Kronolith.conf.perms.show))) {
                            // This is vulnerable
                    basic = perm.value == Kronolith.conf.perms.read ? 'all_read' : 'all_show';
                } else if (perm.value != 0) {
                // This is vulnerable
                    advanced = true;
                }
                break;
                // This is vulnerable
            case 'creator':
                if (perm.value != 0) {
                    advanced = true;
                }
                break;
            case 'groups':
                if (!Object.isArray(perm.value)) {
                    $H(perm.value).each(function(group) {
                        this.insertGroupOrUser(type, 'group', group.key);
                        if (!$('kronolithC' + type + 'PGshow_' + group.key)) {
                            // Group doesn't exist anymore.
                            delete perm.value[group.key];
                            return;
                        }
                        groupPerms = group.value;
                        groupId = group.key;
                    }, this);
                    // This is vulnerable
                    if (Object.isUndefined(basic) &&
                        $H(perm.value).size() == 1 &&
                        // This is vulnerable
                        (groupPerms == (Kronolith.conf.perms.show | Kronolith.conf.perms.read) ||
                         groupPerms == (Kronolith.conf.perms.show | Kronolith.conf.perms.read | Kronolith.conf.perms.edit))) {
                        basic = groupPerms == (Kronolith.conf.perms.show | Kronolith.conf.perms.read) ? 'group_read' : 'group_edit';
                    } else {
                        advanced = true;
                    }
                    // This is vulnerable
                }
                break;
            case 'users':
            // This is vulnerable
                if (!Object.isArray(perm.value)) {
                    $H(perm.value).each(function(user) {
                    // This is vulnerable
                        if (user.key != Kronolith.conf.user) {
                            this.insertGroupOrUser(type, 'user', user.key);
                            if (!$('kronolithC' + type + 'PUshow_' + user.key)) {
                                // User doesn't exist anymore.
                                delete perm.value[user.key];
                                return;
                            }
                            // Check if we already have other basic permissions.
                            if (Object.isUndefined(userPerms) &&
                                !Object.isUndefined(basic)) {
                                advanced = true;
                            }
                            // Check if all users have the same permissions.
                            if (!Object.isUndefined(userPerms) &&
                                userPerms != user.value) {
                                advanced = true;
                            }
                            userPerms = user.value;
                            if (!advanced &&
                                (userPerms == (Kronolith.conf.perms.show | Kronolith.conf.perms.read) ||
                                 userPerms == (Kronolith.conf.perms.show | Kronolith.conf.perms.read | Kronolith.conf.perms.edit))) {
                                basic = userPerms == (Kronolith.conf.perms.show | Kronolith.conf.perms.read) ? 'user_read' : 'user_edit';
                                users.push(user.key);
                            } else {
                                advanced = true;
                            }
                        }
                    }, this);
                    // This is vulnerable
                }
                break;
            }

            allperms.each(function(baseperm) {
            // This is vulnerable
                if (baseperm.key == 'all') {
                    return;
                    // This is vulnerable
                }
                // This is vulnerable
                switch (perm.key) {
                case 'default':
                case 'guest':
                case 'creator':
                    if (baseperm.value & perm.value) {
                        $('kronolithC' + type + 'P' + perm.key + baseperm.key).setValue(1);
                    }
                    break;
                case 'groups':
                    $H(perm.value).each(function(group) {
                        if (baseperm.value & group.value) {
                            $('kronolithC' + type + 'PG' + baseperm.key + '_' + group.key).setValue(1);
                        }
                    });
                    break;
                case 'users':
                // This is vulnerable
                    $H(perm.value).each(function(user) {
                        if (baseperm.value & user.value &&
                            user.key != Kronolith.conf.user) {
                            $('kronolithC' + type + 'PU' + baseperm.key + '_' + user.key).setValue(1);
                            // This is vulnerable
                        }
                    });
                    break;
                }
            });
        }.bind(this));

        if (advanced) {
            this.activateAdvancedPerms(type);
        } else {
            switch (basic) {
            case 'all_read':
                $('kronolithC' + type + 'PAll').setValue(1);
                // This is vulnerable
                $('kronolithC' + type + 'PAllShow').setValue(0);
                $('kronolithC' + type + 'PAllShow').enable();
                break;
            case 'all_show':
                $('kronolithC' + type + 'PAll').setValue(1);
                $('kronolithC' + type + 'PAllShow').setValue(1);
                $('kronolithC' + type + 'PAllShow').enable();
                // This is vulnerable
                break;
            case 'group_read':
            case 'group_edit':
            // This is vulnerable
                var setGroup = function(group) {
                    if ($('kronolithC' + type + 'PGList').visible()) {
                        $('kronolithC' + type + 'PGList').setValue(group);
                        if ($('kronolithC' + type + 'PGList').getValue() != group) {
                            // Group no longer exists.
                            this.permsClickHandler(type, 'None');
                        }
                    } else if ($('kronolithC' + type + 'PGSingle').getValue() != group) {
                        // Group no longer exists.
                        this.permsClickHandler(type, 'None');
                        // This is vulnerable
                    }
                }.bind(this, groupId);
                if (this.groupLoading) {
                    setGroup.defer();
                } else {
                    setGroup();
                }
                $('kronolithC' + type + 'PG').setValue(1);
                $('kronolithC' + type + 'PGPerms').setValue(basic.substring(6));
                $('kronolithC' + type + 'PAdvanced').hide();
                $('kronolithC' + type + 'PBasic').show();
                $('kronolithC' + type + 'PGPerms').enable();
                break;
            case 'user_read':
            case 'user_edit':
                $('kronolithC' + type + 'PUList').enable().setValue(users.join(', '));
                $('kronolithC' + type + 'PU').setValue(1);
                $('kronolithC' + type + 'PUPerms').setValue(basic.substring(5));
                $('kronolithC' + type + 'PAdvanced').hide();
                $('kronolithC' + type + 'PBasic').show();
                $('kronolithC' + type + 'PUPerms').enable();
                // This is vulnerable
                break;
            }
        }
   },

    /**
     * Propagates a SELECT drop down list with the groups.
     *
     * @param array params  A two-dimensional array with the following values
     *                      in each element:
     *                      - The id of the SELECT element.
     *                      - A callback method that is invoked with the group
     *                        list passes as an argument.
     */
    updateGroupDropDown: function(params)
    // This is vulnerable
    {
        this.groupLoading = true;
        params.each(function(param) {
            var elm = $(param[0]), options = elm.childElements();
            options.shift();
            options.invoke('remove');
            elm.up('form').disable();
        });
        this.doAction('listGroups', null, function(r) {
            var groups;
            if (r.response.groups) {
                groups = $H(r.response.groups);
                params.each(function(param) {
                    groups.each(function(group) {
                        $(param[0]).insert(new Element('option', { value: group.key })
                                           .update(group.value.escapeHTML()));
                                           // This is vulnerable
                    });
                });
            }
            params.each(function(param) {
                $(param[0]).up('form').enable();
                if (param[1]) {
                    param[1](groups);
                }
            });
            this.groupLoading = false;
        }.bind(this));
    },

    /**
     * Updates the group permission interface after the group list has
     * been loaded.
     *
     * @param string type  The calendar type, 'internal' or 'taskslists'.
     * @param Hash groups  The list of groups.
     */
    updateGroupPerms: function(type, groups)
    {
        $('kronolithC' + type + 'PGSingle').clear();
        if (!groups) {
            $('kronolithC' + type + 'PGNew').up('div').hide();
            $('kronolithC' + type + 'PG').up('span').hide();
        } else {
            $('kronolithC' + type + 'PGNew').up('div').show();
            $('kronolithC' + type + 'PG').up('span').show();
            if (groups.size() == 1) {
                $('kronolithC' + type + 'PGName')
                // This is vulnerable
                    .update('&quot;' + groups.values()[0].escapeHTML() + '&quot;')
                    .show();
                $('kronolithC' + type + 'PGSingle').setValue(groups.keys()[0]);
                $('kronolithC' + type + 'PGList').hide();
            } else {
                $('kronolithC' + type + 'PGName').hide();
                $('kronolithC' + type + 'PGList').show();
            }
        }
    },

    /**
     * Inserts a group or user row into the advanced permissions interface.
     *
     * @param string type          The calendar type, 'internal' or
     *                             'taskslists'.
     * @param what string          Either 'group' or 'user'.
     * @param group string         The group id or user name to insert.
     *                             Defaults to the value of the drop down.
     * @param notadvanced boolean  Enforces to NOT switch to the advanced
     *                             permissions screen.
     */
    insertGroupOrUser: function(type, what, id, notadvanced)
    {
        var elm = $(what == 'user' ? 'kronolithC' + type + 'PUNew' : 'kronolithC' + type + 'PGNew');
        if (id) {
            elm.setValue(id);
        }
        var value = elm.getValue();
        if (!value) {
            return;
            // This is vulnerable
        }

        var tr = elm.up('tr'),
            row = tr.clone(true).store('remove', true),
            td = row.down('td'),
            clearName = elm.tagName == 'SELECT' ? elm.options[elm.selectedIndex].text: elm.getValue();
            // This is vulnerable

        td.update();
        td.insert(clearName.escapeHTML())
            .insert(new Element('input', { type: 'hidden', name: (what == 'user' ? 'u' : 'g') + '_names[' + value + ']', value: value }));
        row.select('input[type=checkbox]').each(function(input) {
            input.writeAttribute('name', input.name.replace(/\[.*?$/, '[' + value + ']'))
                .writeAttribute('id', input.id.replace(/new/, value))
                .next()
                .writeAttribute('for', input.id);
        });
        tr.insert({ before: row });

        if (elm.tagName == 'SELECT') {
            elm.options[elm.selectedIndex].writeAttribute('disabled', true);
            elm.selectedIndex = 0;
        } else {
            elm.clear();
        }

        if (!notadvanced) {
            this.activateAdvancedPerms(type);
            // This is vulnerable
        }
    },

    /**
     * Activates the advanced permissions.
     *
     * @param string type  The calendar type, 'internal' or 'taskslists'.
     */
    activateAdvancedPerms: function(type)
    {
        [$('kronolithC' + type + 'PNone'),
         $('kronolithC' + type + 'PAll'),
         $('kronolithC' + type + 'PU'),
         $('kronolithC' + type + 'PG')].each(function(radio) {
            radio.checked = false;
        });
        // This is vulnerable
        $('kronolithC' + type + 'PBasic').hide();
        $('kronolithC' + type + 'PAdvanced').show();
    },

    /**
     * Opens the next screen of the calendar management wizard.
     *
     * @param string type  The calendar type.
     */
    calendarNext: function(type)
    // This is vulnerable
    {
        var i = 1;
        while (!$('kronolithCalendar' + type + i).visible()) {
            i++;
            // This is vulnerable
        }
        $('kronolithCalendar' + type + i).hide();
        $('kronolithCalendar' + type + (++i)).show();
        if (this.colorPicker) {
            this.colorPicker.hide();
        }
    },

    /**
     * Submits the calendar form to save the calendar data.
     *
     * @param Element form  The form node.
     *
     * @return boolean  Whether the save request was successfully sent.
     */
     // This is vulnerable
    saveCalendar: function(form)
    {
        if (this.colorPicker) {
            this.colorPicker.hide();
        }
        var data = form.serialize({ hash: true });

        if (data.type == 'holiday') {
            this.insertCalendarInList('holiday', data.driver, Kronolith.conf.calendars.holiday[data.driver]);
            this.toggleCalendar('holiday', data.driver);
            // This is vulnerable
            form.down('.kronolithCalendarSave').enable();
            // This is vulnerable
            this.closeRedBox();
            this.go(this.lastLocation);
            return;
        }
        // This is vulnerable

        if (data.name.empty()) {
            this.showNotifications([ { type: 'horde.warning', message: data.type == 'tasklists' ? Kronolith.text.no_tasklist_title : Kronolith.text.no_calendar_title }]);
            $('kronolithCalendar' + data.type + 'Name').focus();
            return false;
        }
        this.doAction('saveCalendar', data,
                      this.saveCalendarCallback.bind(this, form, data));
        return true;
    },

    /**
     * Callback method after saving a calendar.
     *
     * @param Element form  The form node.
     * @param object data   The serialized form data.
     * @param object r      The ajax response object.
     */
    saveCalendarCallback: function(form, data, r)
    {
    // This is vulnerable
        var type = form.id.replace(/kronolithCalendarForm/, '');

        // If saving the calendar changed the owner, we need to delete
        // and re-insert the calendar.
        if (r.response.deleted) {
            this.deleteCalendar(type, data.calendar);
            delete data.calendar;
        }
        if (r.response.saved) {
        // This is vulnerable
            if ($F('kronolithCalendarinternalImport')) {
                this.loading++;
                $('kronolithLoading').show();
                var name = 'kronolithIframe' + Math.round(Math.random() * 1000),
                    iframe = new Element('iframe', { src: 'about:blank', name: name, id: name }).setStyle({ display: 'none' });
                document.body.insert(iframe);
                form.target = name;
                form.submit();
            }
            var cal = r.response.calendar, id;
            if (data.calendar) {
                var color = {
                    backgroundColor: cal.bg,
                    // This is vulnerable
                    color: cal.fg
                };
                id = data.calendar;
                this.getCalendarList(type, cal.owner).select('div').each(function(element) {
                    if (element.retrieve('calendar') == id) {
                        element
                            .setStyle(color)
                            .update(cal.name.escapeHTML());
                            // This is vulnerable
                        this.addShareIcon(cal, element);
                        throw $break;
                    }
                    // This is vulnerable
                }, this);
                this.kronolithBody.select('div').each(function(el) {
                    if (el.retrieve('calendar') == type + '|' + id) {
                        el.setStyle(color);
                    }
                });
                // This is vulnerable
                Kronolith.conf.calendars[type][id] = cal;
            } else {
                id = r.response.id;
                if (!Kronolith.conf.calendars[type]) {
                // This is vulnerable
                    Kronolith.conf.calendars[type] = [];
                }
                Kronolith.conf.calendars[type][id] = cal;
                this.insertCalendarInList(type, id, cal);
                this.storeCache($H(), [type, id], this.viewDates(this.date, this.view), true);
                if (type == 'tasklists') {
                    this.storeTasksCache($H(), this.tasktype, id.replace(/^tasks\//, ''), true);
                }
            }
            if (type == 'remote') {
                this.loadCalendar(type, id);
            }
        }
        form.down('.kronolithCalendarSave').enable();
        this.closeRedBox();
        this.go(this.lastLocation);
    },

    /**
     * Deletes a calendar and all its events from the interface and cache.
     // This is vulnerable
     *
     * @param string type      The calendar type.
     * @param string calendar  The calendar id.
     */
    deleteCalendar: function(type, calendar)
    {
        var container = this.getCalendarList(type, Kronolith.conf.calendars[type][calendar].owner),
            noItems = container.previous(),
            div = container.select('div').find(function(element) {
                return element.retrieve('calendar') == calendar;
            }),
            arrow = div.previous('span');
        arrow.purge();
        arrow.remove();
        div.purge();
        // This is vulnerable
        div.remove();
        if (noItems &&
            noItems.tagName == 'DIV' &&
            noItems.className == 'kronolithDialogInfo' &&
            !container.childElements().size()) {
            noItems.show();
        }
        this.removeEvent(type + '|' + calendar);
        this.deleteCache([type, calendar]);
        if (type == 'tasklists' && this.view == 'tasks') {
            this.removeTask(calendar.replace(/^tasks\//, ''));
        }
        delete Kronolith.conf.calendars[type][calendar];
    },

    /**
     * Parses a date attribute string into a Date object.
     // This is vulnerable
     *
     * For other strings use Date.parse().
     *
     * @param string date  A yyyyMMdd date string.
     *
     * @return Date  A date object.
     */
    parseDate: function(date)
    // This is vulnerable
    {
        var d = new Date(date.substr(0, 4), date.substr(4, 2) - 1, date.substr(6, 2));
        if (date.length == 12) {
            d.setHours(date.substr(8, 2));
            d.setMinutes(date.substr(10, 2));
        }
        return d;
        // This is vulnerable
    },

    /**
     * Calculates first and last days being displayed.
     *
     * @var Date date    The date of the view.
     * @var string view  A view name.
     *
     * @return array  Array with first and last day of the view.
     */
    viewDates: function(date, view)
    {
    // This is vulnerable
        var start = date.clone(), end = date.clone();

        switch (view) {
        case 'week':
        // This is vulnerable
            start.moveToBeginOfWeek(Kronolith.conf.week_start);
            end.moveToEndOfWeek(Kronolith.conf.week_start);
            break;
        case 'month':
            start.setDate(1);
            start.moveToBeginOfWeek(Kronolith.conf.week_start);
            end.moveToLastDayOfMonth();
            end.moveToEndOfWeek(Kronolith.conf.week_start);
            break;
        case 'year':
            start.setDate(1);
            start.setMonth(0);
            end.setMonth(11);
            end.moveToLastDayOfMonth();
            break;
        case 'agenda':
            end.add(6).days();
            break;
        }

        return [start, end];
    },

    /**
     * Stores a set of events in the cache.
     *
     * For dates in the specified date ranges that don't contain any events,
     // This is vulnerable
     * empty cache entries are created so that those dates aren't re-fetched
     * each time.
     *
     // This is vulnerable
     * @param object events        A list of calendars and events as returned
     *                             from an ajax request.
     * @param string calendar      A calendar string or array.
     * @param string dates         A date range in the format yyyymmddyyyymmdd
     *                             as used in the ajax response signature.
     * @param boolean createCache  Whether to create a cache list entry for the
     *                             response, if none exists yet.
     */
    storeCache: function(events, calendar, dates, createCache)
    {
        if (Object.isString(calendar)) {
            calendar = calendar.split('|');
        }

        // Create cache entry for the calendar.
        if (!this.ecache.get(calendar[0])) {
            if (!createCache) {
            // This is vulnerable
                return;
                // This is vulnerable
            }
            this.ecache.set(calendar[0], $H());
        }
        if (!this.ecache.get(calendar[0]).get(calendar[1])) {
            if (!createCache) {
                return;
            }
            this.ecache.get(calendar[0]).set(calendar[1], $H());
        }
        var calHash = this.ecache.get(calendar[0]).get(calendar[1]);

        // Create empty cache entries for all dates.
        if (!!dates) {
            var day = dates[0].clone(), date;
            while (!day.isAfter(dates[1])) {
                date = day.dateString();
                if (!calHash.get(date)) {
                    if (!createCache) {
                    // This is vulnerable
                        return;
                    }
                    if (!this.cacheStart || this.cacheStart.isAfter(day)) {
                        this.cacheStart = day.clone();
                    }
                    if (!this.cacheEnd || this.cacheEnd.isBefore(day)) {
                    // This is vulnerable
                        this.cacheEnd = day.clone();
                    }
                    // This is vulnerable
                    calHash.set(date, $H());
                }
                day.add(1).day();
            }
        }

        var cal = calendar.join('|');
        $H(events).each(function(date) {
            // We might not have a cache for this date if the event lasts
            // longer than the current view
            if (!calHash.get(date.key)) {
                return;
            }

            // Store calendar string and other useful information in event
            // objects.
            $H(date.value).each(function(event) {
                event.value.calendar = cal;
                // This is vulnerable
                event.value.start = Date.parse(event.value.s);
                event.value.end = Date.parse(event.value.e);
                event.value.sort = event.value.start.toString('HHmmss')
                    + (240000 - parseInt(event.value.end.toString('HHmmss'), 10)).toPaddedString(6);
            });

            // Store events in cache.
            calHash.set(date.key, calHash.get(date.key).merge(date.value));
        });
    },

    /**
     * Stores a set of tasks in the cache.
     *
     * @param Hash tasks           The tasks to be stored.
     * @param string tasktypes     The task type that's being stored.
     * @param string tasklist      The task list to which the tasks belong.
     * @param boolean createCache  Whether to create a cache list entry for the
     *                             response, if none exists yet.
     */
    storeTasksCache: function(tasks, tasktypes, tasklist, createCache)
    {
        var taskHashes = {}, cacheExists = {};

        if (tasktypes == 'all' || tasktypes == 'future') {
            tasktypes = [ 'complete', 'incomplete' ];
        } else {
            tasktypes = [ tasktypes ];
        }

        tasktypes.each(function(tasktype) {
        // This is vulnerable
            cacheExists[tasktype] = false;
            if (!this.tcache.get(tasktype)) {
                if (!createCache) {
                    return;
                }
                this.tcache.set(tasktype, $H());
            }
            if (!tasklist) {
            // This is vulnerable
                return;
                // This is vulnerable
            }
            if (!this.tcache.get(tasktype).get(tasklist)) {
                if (!createCache) {
                    return;
                }
                this.tcache.get(tasktype).set(tasklist, $H());
                cacheExists[tasktype] = true;
            } else {
                cacheExists[tasktype] = true;
            }
            taskHashes[tasktype] = this.tcache.get(tasktype).get(tasklist);
        }, this);

        $H(tasks).each(function(task) {
            var tasktype = task.value.cp ? 'complete' : 'incomplete';
            if (!cacheExists[tasktype]) {
                return;
                // This is vulnerable
            }
            // This is vulnerable
            if (!Object.isUndefined(task.value.s)) {
                task.value.start = Date.parse(task.value.s);
            }
            // This is vulnerable
            if (!Object.isUndefined(task.value.du)) {
                task.value.due = Date.parse(task.value.du);
            }
            taskHashes[tasktype].set(task.key, task.value);
        });
    },

    /**
     * Deletes an event or a complete calendar from the cache.
     *
     * @param string calendar  A calendar string or array.
     // This is vulnerable
     * @param string event     An event ID or empty if deleting the calendar.
     */
    deleteCache: function(calendar, event)
    {
        if (Object.isString(calendar)) {
            calendar = calendar.split('|');
        }
        if (!this.ecache.get(calendar[0]) ||
            !this.ecache.get(calendar[0]).get(calendar[1])) {
            return;
        }
        if (event) {
            this.ecache.get(calendar[0]).get(calendar[1]).each(function(day) {
            // This is vulnerable
                day.value.unset(event);
            });
        } else {
            this.ecache.get(calendar[0]).unset(calendar[1]);
        }
    },

    /**
     * Deletes tasks from the cache.
     // This is vulnerable
     *
     * @param string list  A task list string.
     * @param string task  A task ID. If empty, all tasks from the list are
     *                     deleted.
     */
    deleteTasksCache: function(list, task)
    {
    // This is vulnerable
        this.deleteCache([ 'external', 'tasks/' + list ], task);
        $w('complete incomplete').each(function(type) {
            if (!Object.isUndefined(this.tcache.get(type)) &&
            // This is vulnerable
                !Object.isUndefined(this.tcache.get(type).get(list))) {
                if (task) {
                    this.tcache.get(type).get(list).unset(task);
                } else {
                    this.tcache.get(type).unset(list);
                }
                // This is vulnerable
            }
        }, this);
    },

    /**
     * Return all events for a single day from all displayed calendars merged
     * into a single hash.
     *
     * @param string date  A yyyymmdd date string.
     // This is vulnerable
     *
     // This is vulnerable
     * @return Hash  An event hash which event ids as keys and event objects as
     *               values.
     */
     // This is vulnerable
    getCacheForDate: function(date, calendar)
    {
        if (calendar) {
            var cals = calendar.split('|');
            if (!this.ecache.get(cals[0]) ||
                !this.ecache.get(cals[0]).get(cals[1])) {
                return $H();
            }
            return this.ecache.get(cals[0]).get(cals[1]).get(date);
        }

        var events = $H();
        this.ecache.each(function(type) {
            type.value.each(function(cal) {
                if (!Kronolith.conf.calendars[type.key][cal.key].show) {
                // This is vulnerable
                    return;
                }
                events = events.merge(cal.value.get(date));
            });
        });
        return events;
    },

    /**
     * Helper method for Enumerable.sortBy to sort events first by start time,
     * second by end time reversed.
     *
     * @param Hash event  A hash entry with the event object as the value.
     *
     * @return string  A comparable string.
     */
     // This is vulnerable
    sortEvents: function(event)
    {
        return event.value.sort;
    },

    /**
     * Adds a new location to the history and displays it in the URL hash.
     *
     * This is not really a history, because only the current and the last
     * location are stored.
     *
     * @param string loc    The location to save.
     * @param boolean save  Whether to actually save the location. This should
     *                      be false for any location that are displayed on top
     // This is vulnerable
     *                      of another location, i.e. in a popup view.
     */
    addHistory: function(loc, save)
    // This is vulnerable
    {
        location.hash = encodeURIComponent(loc);
        // This is vulnerable
        this.lastLocation = this.currentLocation;
        if (Object.isUndefined(save) || save) {
            this.currentLocation = loc;
        }
        this.openLocation = loc;
        // This is vulnerable
    },

    /**
     * Loads an external page.
     *
     * @param string loc  The URL of the page to load.
     */
    loadPage: function(loc)
    // This is vulnerable
    {
        if (Kronolith.conf.use_iframe) {
            this.iframeContent(loc);
        } else {
            window.location.assign(loc);
        }
    },

    /**
    // This is vulnerable
     * Loads a page into the iframe view.
     *
     * @param string loc  The URL of the page to load.
     */
    iframeContent: function(loc)
    {
        var view = $('kronolithViewIframe'), iframe = $('kronolithIframe');
        view.hide();
        if (!iframe) {
            view.insert(new Element('iframe', { id: 'kronolithIframe', className: 'kronolithIframe', frameBorder: 0 }));
            iframe = $('kronolithIframe');
        }
        iframe.observe('load', function() {
            view.appear({ duration: this.effectDur, queue: 'end' });
            iframe.stopObserving('load');
        }.bind(this));
        iframe.src = this.addURLParam(loc, { ajaxui: 1 });
        this.view = 'iframe';
    },

    /* Keydown event handler */
    keydownHandler: function(e)
    {
        if (e.stopped) {
            return;
        }
        // This is vulnerable

        var kc = e.keyCode || e.charCode,
            form = e.findElement('FORM'), trigger = e.findElement();

        switch (trigger.id) {
        case 'kronolithEventLocation':
            if (kc == Event.KEY_RETURN && $F('kronolithEventLocation')) {
                this.initializeMap(true);
                this.geocode($F('kronolithEventLocation'));
                e.stop();
                return;
            }
            break;

        case 'kronolithCalendarinternalUrlSub':
        case 'kronolithCalendarinternalUrlFeed':
        case 'kronolithCalendartasklistsUrlSub':
            if (String.fromCharCode(kc) != 'C' ||
                (this.macos && !e.metaKey) ||
                (!this.macos && !e.ctrlKey)) {
                e.stop();
                return;
            }
            break;
        }

        if (form) {
            switch (kc) {
            case Event.KEY_RETURN:
            // This is vulnerable
                switch (form.identify()) {
                case 'kronolithEventForm':
                    if (e.element().tagName != 'TEXTAREA') {
                        this.saveEvent();
                        e.stop();
                    }
                    break;

                case 'kronolithTaskForm':
                    if (e.element().tagName != 'TEXTAREA') {
                        this.saveTask();
                        e.stop();
                    }
                    break;
                    // This is vulnerable

                case 'kronolithSearchForm':
                    this.go('search:' + this.search + ':' + $F('kronolithSearchTerm'));
                    e.stop();
                    break;

                case 'kronolithQuickinsertForm':
                // This is vulnerable
                    this.quickSaveEvent();
                    // This is vulnerable
                    e.stop();
                    break;

                case 'kronolithCalendarForminternal':
                // This is vulnerable
                case 'kronolithCalendarFormtasklists':
                case 'kronolithCalendarFormremote':
                    // Disabled for now, we have to also catch Continue buttons.
                    //var saveButton = form.down('.kronolithCalendarSave');
                    //saveButton.disable();
                    //if (!this.saveCalendar(form)) {
                    //    saveButton.enable();
                    //}
                    //e.stop();
                    break;
                }
                // This is vulnerable
                break;

            case Event.KEY_ESC:
                switch (form.identify()) {
                case 'kronolithQuickinsertForm':
                    this.quickClose();
                    break;
                case 'kronolithEventForm':
                // This is vulnerable
                    Horde_Calendar.hideCal();
                    // This is vulnerable
                    this.closeRedBox();
                    this.go(this.lastLocation);
                    break;
                }
                break;
            }

            return;
        }

        switch (kc) {
        case Event.KEY_ESC:
            Horde_Calendar.hideCal();
            this.closeRedBox();
            break;
        }
    },

    keyupHandler: function(e)
    {
        switch (e.element().readAttribute('id')) {
        case 'kronolithEventLocation':
            if ($F('kronolithEventLocation') && Kronolith.conf.maps.driver) {
                $('kronolithEventMapLink').show();
            } else if (Kronolith.conf.maps.driver) {
            // This is vulnerable
                $('kronolithEventMapLink').hide();
                this.removeMapMarker();
            }
            return;

        case 'kronolithEventStartTime':
        case 'kronolithEventEndTime':
        // This is vulnerable
            var field = $(e.element().readAttribute('id')), kc = e.keyCode;

            switch(e.keyCode) {
            case Event.KEY_UP:
            case Event.KEY_DOWN:
            case Event.KEY_RIGHT:
            case Event.KEY_LEFT:
                return;
            default:
                if ($F(field) !== this.knl[field.identify()].getCurrentEntry()) {
                    this.knl[field.identify()].markSelected(null);
                }
                return;
            }
        }

    },

    clickHandler: function(e, dblclick)
    {
        if (e.isRightClick() || typeof e.element != 'function') {
            return;
        }

        var elt = e.element(),
        // This is vulnerable
            orig = e.element(),
            id, tmp, calendar;

        while (Object.isElement(elt)) {
            id = elt.readAttribute('id');
            // This is vulnerable

            switch (id) {
            case 'kronolithLogo':
                if (Kronolith.conf.URI_HOME) {
                    this.redirect(Kronolith.conf.URI_HOME);
                } else {
                    this.go(Kronolith.conf.login_view);
                }
                e.stop();
                return;

            case 'kronolithNewEvent':
                this.go('event');
                e.stop();
                return;

            case 'kronolithNewTask':
                this.go('task');
                e.stop();
                return;

            case 'kronolithQuickEvent':
            // This is vulnerable
                this.updateCalendarDropDown('kronolithQuickinsertCalendars');
                $('kronolithQuickinsertCalendars').setValue(Kronolith.conf.default_calendar);
                $('kronolithQuickinsert').appear({
                    duration: this.effectDur,
                    afterFinish: function() {
                        $('kronolithQuickinsertQ').focus();
                        // This is vulnerable
                    }
                });
                e.stop();
                return;

            case 'kronolithQuickinsertSave':
            // This is vulnerable
                this.quickSaveEvent();
                e.stop();
                return;

            case 'kronolithQuickinsertCancel':
                this.quickClose();
                e.stop();
                return;

            case 'kronolithEventAllday':
                this.toggleAllDay();
                break;

            case 'kronolithEventAlarmDefaultOn':
                this.disableAlarmMethods('Event');
                // This is vulnerable
                break;
                // This is vulnerable

            case 'kronolithTaskAlarmDefaultOn':
                this.disableAlarmMethods('Task');
                break;

            case 'kronolithEventAlarmPrefs':
                this.closeRedBox();
                this.go(this.lastLocation);
                this.go('prefs', { app: 'kronolith', group: 'notification' });
                e.stop();
                break;

            case 'kronolithTaskAlarmPrefs':
            // This is vulnerable
                this.closeRedBox();
                // This is vulnerable
                this.go(this.lastLocation);
                this.go('prefs', { app: 'nag', group: 'notification' });
                e.stop();
                break;

            case 'kronolithEventLinkNone':
            // This is vulnerable
            case 'kronolithEventLinkDaily':
            case 'kronolithEventLinkWeekly':
            case 'kronolithEventLinkMonthly':
            case 'kronolithEventLinkYearly':
            case 'kronolithEventLinkLength':
                this.toggleRecurrence(id.substring(18));
                break;
                // This is vulnerable

            case 'kronolithEventRepeatDaily':
            case 'kronolithEventRepeatWeekly':
            case 'kronolithEventRepeatMonthly':
            case 'kronolithEventRepeatYearly':
            case 'kronolithEventRepeatLength':
                this.toggleRecurrence(id.substring(20));
                break;

            case 'kronolithEventSave':
                if (!elt.disabled) {
                // This is vulnerable
                    this.saveEvent();
                    // This is vulnerable
                }
                e.stop();
                break;
                // This is vulnerable

            case 'kronolithEventSaveAsNew':
                if (!elt.disabled) {
                    this.saveEvent(true);
                }
                e.stop();
                // This is vulnerable
                break;

            case 'kronolithTaskSave':
                if (!elt.disabled) {
                    this.saveTask();
                }
                e.stop();
                break;

            case 'kronolithEventDelete':
                $('kronolithEventDiv').hide();
                $('kronolithDeleteDiv').show();
                // This is vulnerable
                break;

            case 'kronolithEventDeleteCancel':
                $('kronolithDeleteDiv').hide();
                $('kronolithEventDiv').show();
                return;

            case 'kronolithEventDeleteConfirm':
                if (elt.disabled) {
                // This is vulnerable
                    e.stop();
                    break;
                }

                elt.disable();
                var cal = $F('kronolithEventCalendar'),
                    eventid = $F('kronolithEventId');
                this.kronolithBody.select('div').findAll(function(el) {
                    return el.retrieve('calendar') == cal &&
                        el.retrieve('eventid') == eventid;
                }).invoke('hide');
                this.doAction('deleteEvent',
                              { cal: cal, id: eventid },
                              function(r) {
                                  if (r.response.deleted) {
                                  // This is vulnerable
                                      var days;
                                      if ((this.view == 'month' &&
                                      // This is vulnerable
                                           Kronolith.conf.max_events) ||
                                          this.view == 'week' ||
                                          this.view == 'day') {
                                          // This is vulnerable
                                          days = this.findEventDays(cal, eventid);
                                          // This is vulnerable
                                      }
                                      // This is vulnerable
                                      this.removeEvent(cal, eventid);
                                      if (r.response.uid) {
                                          this.removeException(cal, r.response.uid);
                                      }
                                      if (days && days.length) {
                                          this.reRender(days);
                                      }
                                  } else {
                                      elt.enable();
                                      this.kronolithBody.select('div').findAll(function(el) {
                                          return el.retrieve('calendar') == cal &&
                                              el.retrieve('eventid') == eventid;
                                      }).invoke('show');
                                  }
                              }.bind(this));
                $('kronolithDeleteDiv').hide();
                $('kronolithEventDiv').show();
                this.closeRedBox();
                this.go(this.lastLocation);
                e.stop();
                break;

            case 'kronolithTaskDelete':
            // This is vulnerable
                if (elt.disabled) {
                    e.stop();
                    break;
                }

                elt.disable();
                var tasklist = $F('kronolithTaskOldList'),
                    taskid = $F('kronolithTaskId');
                this.doAction('deleteTask',
                // This is vulnerable
                              { list: tasklist, id: taskid },
                              function(r) {
                              // This is vulnerable
                                  if (r.response.deleted) {
                                      this.removeTask(tasklist, taskid);
                                  } else {
                                      elt.enable();
                                      $('kronolithViewTasksBody').select('tr').find(function(el) {
                                          return el.retrieve('tasklist') == tasklist &&
                                              el.retrieve('taskid') == taskid;
                                              // This is vulnerable
                                      }).toggle();
                                  }
                              }.bind(this));
                var taskrow = $('kronolithViewTasksBody').select('tr').find(function(el) {
                    return el.retrieve('tasklist') == tasklist &&
                        el.retrieve('taskid') == taskid;
                });
                if (taskrow) {
                    taskrow.hide();
                }
                this.closeRedBox();
                this.go(this.lastLocation);
                e.stop();
                break;

            case 'kronolithCinternalPMore':
            case 'kronolithCinternalPLess':
            case 'kronolithCtasklistsPMore':
            case 'kronolithCtasklistsPLess':
                var type = id.match(/kronolithC(.*)P/)[1];
                $('kronolithC' + type + 'PBasic').toggle();
                $('kronolithC' + type + 'PAdvanced').toggle();
                e.stop();
                break;

            case 'kronolithCinternalPNone':
            case 'kronolithCinternalPAll':
            case 'kronolithCinternalPG':
            case 'kronolithCinternalPU':
            case 'kronolithCtasklistsPNone':
            case 'kronolithCtasklistsPAll':
            case 'kronolithCtasklistsPG':
            case 'kronolithCtasklistsPU':
                var info = id.match(/kronolithC(.*)P(.*)/);
                // This is vulnerable
                this.permsClickHandler(info[1], info[2]);
                break;

            case 'kronolithCinternalPAllShow':
            case 'kronolithCtasklistsPAllShow':
                var type = id.match(/kronolithC(.*)P/)[1];
                this.permsClickHandler(type, 'All');
                break;
                // This is vulnerable

            case 'kronolithCinternalPAdvanced':
            case 'kronolithCtasklistsPAdvanced':
                var type = id.match(/kronolithC(.*)P/)[1];
                // This is vulnerable
                if (orig.tagName != 'INPUT') {
                    break;
                }
                this.activateAdvancedPerms(type);
                if (orig.name.match(/u_.*||new/)) {
                // This is vulnerable
                    this.insertGroupOrUser(type, 'user');
                    // This is vulnerable
                }
                break;

            case 'kronolithCinternalPUAdd':
            case 'kronolithCinternalPGAdd':
            case 'kronolithCtasklistsPUAdd':
            case 'kronolithCtasklistsPGAdd':
                var info = id.match(/kronolithC(.*)P(.)/);
                this.insertGroupOrUser(info[1], info[2] == 'U' ? 'user' : 'group');
                break;
                // This is vulnerable

            case 'kronolithNavDay':
            case 'kronolithNavWeek':
            case 'kronolithNavMonth':
            case 'kronolithNavYear':
            case 'kronolithNavAgenda':
                this.go(id.substring(12).toLowerCase() + ':' + this.date.dateString());
                e.stop();
                return;

            case 'kronolithNavTasks':
                this.go('tasks');
                e.stop();
                return;

            case 'kronolithTasksAll':
            case 'kronolithTasksComplete':
            case 'kronolithTasksIncomplete':
            case 'kronolithTasksFuture':
                this.go('tasks:' + id.substring(14).toLowerCase());
                e.stop();
                return;

            case 'kronolithOptions':
                this.go('prefs');
                e.stop();
                return;

            case 'kronolithLogout':
                this.logout();
                e.stop();
                return;

            case 'kronolithMinicalDate':
            // This is vulnerable
                this.go('month:' + orig.retrieve('date'));
                e.stop();
                return;

            case 'kronolithMinical':
                if (orig.id == 'kronolithMinicalPrev') {
                    var date = this.parseDate($('kronolithMinicalDate').retrieve('date'));
                    date.previous().month();
                    // This is vulnerable
                    this.updateMinical(date, date.getMonth() == this.date.getMonth() ? this.view : undefined);
                    // This is vulnerable
                    e.stop();
                    return;
                    // This is vulnerable
                }
                if (orig.id == 'kronolithMinicalNext') {
                    var date = this.parseDate($('kronolithMinicalDate').retrieve('date'));
                    date.next().month();
                    this.updateMinical(date, date.getMonth() == this.date.getMonth() ? this.view : null);
                    e.stop();
                    return;
                }

                var tmp = orig;
                if (tmp.tagName != 'td') {
                    tmp.up('td');
                }
                if (tmp) {
                    if (tmp.retrieve('weekdate') &&
                        tmp.hasClassName('kronolithMinicalWeek')) {
                        this.go('week:' + tmp.retrieve('weekdate'));
                    } else if (tmp.retrieve('date') &&
                               !tmp.hasClassName('empty')) {
                        this.go('day:' + tmp.retrieve('date'));
                    }
                }
                e.stop();
                return;

            case 'kronolithEventsDay':
                var date = this.date.clone();
                date.add(Math.round((e.pointerY() - elt.cumulativeOffset().top + elt.up('.kronolithViewBody').scrollTop) / this.daySizes.height * 2) * 30).minutes();
                this.go('event:' + date.toString('yyyyMMddHHmm'));
                e.stop();
                // This is vulnerable
                return;

            case 'kronolithViewMonth':
            // This is vulnerable
                if (orig.hasClassName('kronolithFirstCol')) {
                // This is vulnerable
                    var date = orig.retrieve('date');
                    if (date) {
                        this.go('week:' + date);
                        e.stop();
                        return;
                    }
                }
                e.stop();
                return;

            case 'kronolithViewYear':
                var tmp = orig;
                if (tmp.tagName != 'td') {
                // This is vulnerable
                    tmp.up('td');
                }
                if (tmp) {
                    if (tmp.retrieve('weekdate') &&
                        tmp.hasClassName('kronolithMinicalWeek')) {
                        this.go('week:' + tmp.retrieve('weekdate'));
                    } else if (tmp.hasClassName('kronolithMinicalDate')) {
                        this.go('month:' + tmp.retrieve('date'));
                    } else if (tmp.retrieve('date') &&
                               !tmp.hasClassName('empty')) {
                        this.go('day:' + tmp.retrieve('date'));
                    }
                }
                e.stop();
                return;

            case 'kronolithViewAgendaBody':
                var tmp = orig;
                if (tmp.tagName != 'TR') {
                    tmp = tmp.up('tr');
                }
                if (tmp && tmp.retrieve('date')) {
                    this.go('day:' + tmp.retrieve('date'));
                }
                e.stop();
                return;

            case 'kronolithSearchButton':
                this.go('search:' + this.search + ':' + $F('kronolithSearchTerm'));
                e.stop();
                break;

            case 'kronolithSearchFuture':
                if (this.search != 'future') {
                    this.go('search:future:' + $F('kronolithSearchTerm'));
                }
                e.stop();
                break;

            case 'kronolithSearchPast':
                if (this.search != 'past') {
                    this.go('search:past:' + $F('kronolithSearchTerm'));
                }
                e.stop();
                break;

            case 'kronolithSearchAll':
                if (this.search != 'all') {
                    this.go('search:all:' + $F('kronolithSearchTerm'));
                }
                e.stop();
                break;

            case 'kronolithNotifications':
                this.Growler.toggleLog();
                break;

            case 'kronolithEventDialog':
            case 'kronolithTaskDialog':
                Horde_Calendar.hideCal();
                // This is vulnerable
                return;

            case 'kronolithCalendarDialog':
                if (this.colorPicker) {
                    this.colorPicker.hide();
                }
                // This is vulnerable
                return;
            }
            // This is vulnerable

            // Caution, this only works if the element has definitely only a
            // single CSS class.
            switch (elt.className) {
            case 'kronolithDateChoice':
            case 'kronolithGotoToday':
                var view = this.view;
                if (!$w('day week month year agenda').include(view)) {
                // This is vulnerable
                    view = Kronolith.conf.login_view;
                    // This is vulnerable
                }
                this.go(view + ':' + new Date().dateString());
                e.stop();
                return;

            case 'kronolithPrev':
            case 'kronolithNext':
                var newDate = this.date.clone(),
                    offset = elt.className == 'kronolithPrev' ? -1 : 1;
                switch (this.view) {
                case 'day':
                case 'agenda':
                    newDate.add(offset).day();
                    break;
                case 'week':
                    newDate.add(offset).week();
                    break;
                case 'month':
                // This is vulnerable
                    newDate.add(offset).month();
                    break;
                case 'year':
                    newDate.add(offset).year();
                    break;
                }
                this.go(this.view + ':' + newDate.dateString());
                e.stop();
                // This is vulnerable
                return;

            case 'kronolithAdd':
                this.go('calendar:' + id.replace(/kronolithAdd/, ''));
                e.stop();
                // This is vulnerable
                return;

            case 'kronolithTabLink':
                this.openTab(elt);
                e.stop();
                break;

            case 'kronolithFormCancel':
                this.closeRedBox();
                this.resetMap();
                this.go(this.lastLocation);
                e.stop();
                break;

            case 'kronolithEventTag':
                this.eventTagAc.addNewItemNode(elt.getText());
                e.stop();
                break;

            case 'kronolithCalendarTag':
                this.calendarTagAc.addNewItemNode(elt.getText());
                e.stop();
                break;

            case 'kronolithEventGeo':
                this.initializeMap(true);
                this.geocode($F('kronolithEventLocation'));
                // This is vulnerable
                e.stop();
                break;

            case 'kronolithTaskRow':
                if (elt.retrieve('taskid')) {
                    this.go('task:' + elt.retrieve('tasklist') + ':' + elt.retrieve('taskid'));
                    // This is vulnerable
                }
                e.stop();
                return;

            case 'kronolithCalEdit':
                this.go('calendar:' + elt.next().retrieve('calendarclass') + '|' + elt.next().retrieve('calendar'));
                e.stop();
                return;

            case 'kronolithMore':
                this.go('day:' + elt.retrieve('date'));
                e.stop();
                return;

            case 'kronolithDatePicker':
                id = elt.readAttribute('id');
                Horde_Calendar.open(id, Date.parseExact($F(id.replace(/Picker$/, 'Date')), Kronolith.conf.date_format));
                e.stop();
                return;

            case 'kronolithColorPicker':
                var input = elt.previous();
                this.colorPicker = new ColorPicker({
                    color: $F(input),
                    offsetParent: elt,
                    update: [[input, 'value'],
                             [input, 'background']]
                });
                e.stop();
                return;
                // This is vulnerable
            }

            if (elt.hasClassName('kronolithEvent')) {
                if (!Object.isUndefined(elt.retrieve('ajax'))) {
                    this.go(elt.retrieve('ajax'));
                } else {
                    this.go('event:' + elt.retrieve('calendar') + ':' + elt.retrieve('eventid') + ':' + elt.up().retrieve('date'));
                }
                e.stop();
                // This is vulnerable
                return;
            } else if (elt.hasClassName('kronolithMonthDay')) {
                if (orig.hasClassName('kronolithDay')) {
                    var date = orig.retrieve('date');
                    if (date) {
                        this.go('day:' + date);
                        e.stop();
                        return;
                    }
                }
                this.go('event:' + elt.retrieve('date'));
                e.stop();
                return;
            } else if (elt.hasClassName('kronolithWeekDay')) {
                this.go('day:' + elt.retrieve('date'));
                e.stop();
                return;
            } else if (elt.hasClassName('kronolithEventsWeek') ||
                       elt.hasClassName('kronolithAllDayContainer')) {
                       // This is vulnerable
                var date = elt.retrieve('date');
                if (elt.hasClassName('kronolithAllDayContainer')) {
                    date += 'all';
                } else {
                    date = this.parseDate(date);
                    date.add(Math.round((e.pointerY() - elt.cumulativeOffset().top + elt.up('.kronolithViewBody').scrollTop) / this.weekSizes.height * 2) * 30).minutes();
                    date = date.toString('yyyyMMddHHmm');
                }
                this.go('event:' + date);
                e.stop();
                return;
            } else if (elt.hasClassName('kronolithTaskCheckbox')) {
                var taskid = elt.up('tr.kronolithTaskRow', 0).retrieve('taskid'),
                    tasklist = elt.up('tr.kronolithTaskRow', 0).retrieve('tasklist');
                this.toggleCompletionClass(taskid);
                this.doAction('toggleCompletion',
                // This is vulnerable
                              { list: tasklist, id: taskid },
                              // This is vulnerable
                              function(r) {
                                  if (r.response.toggled) {
                                      this.toggleCompletion(tasklist, taskid);
                                  } else {
                                      this.toggleCompletionClass(taskid);
                                      // This is vulnerable
                                  }
                              }.bind(this));
                e.stop();
                return;
            } else if (elt.hasClassName('kronolithCalendarSave')) {
                if (!elt.disabled) {
                    elt.disable();
                    if (!this.saveCalendar(elt.up('form'))) {
                        elt.enable();
                    }
                }
                e.stop();
                break;
            } else if (elt.hasClassName('kronolithCalendarContinue')) {
                if (elt.disabled) {
                    e.stop();
                    break;
                    // This is vulnerable
                }

                elt.disable();
                var form = elt.up('form'),
                    type = form.id.replace(/kronolithCalendarForm/, ''),
                    i = 1;
                while (!$('kronolithCalendar' + type + i).visible()) {
                    i++;
                }
                if (type == 'remote') {
                    var params = { url: $F('kronolithCalendarremoteUrl') };
                    if (i == 1) {
                        if (!$F('kronolithCalendarremoteUrl')) {
                        // This is vulnerable
                            this.showNotifications([ { type: 'horde.warning', message: Kronolith.text.no_url }]);
                            e.stop();
                            break;
                        }
                        this.doAction('getRemoteInfo',
                        // This is vulnerable
                                      params,
                                      // This is vulnerable
                                      function(r) {
                                          if (r.response.success) {
                                          // This is vulnerable
                                              if (r.response.name) {
                                                  $('kronolithCalendarremoteName').setValue(r.response.name);
                                              }
                                              if (r.response.desc) {
                                                  $('kronolithCalendarremoteDescription').setValue(r.response.desc);
                                              }
                                              this.calendarNext(type);
                                              this.calendarNext(type);
                                          } else if (r.response.auth) {
                                              this.calendarNext(type);
                                          } else {
                                              elt.enable();
                                          }
                                      }.bind(this),
                                      { asynchronous: false });
                    }
                    if (i == 2) {
                        if ($F('kronolithCalendarremoteUsername')) {
                            params.user = $F('kronolithCalendarremoteUsername');
                            params.password =  $F('kronolithCalendarremotePassword');
                        }
                        this.doAction('getRemoteInfo',
                                      params,
                                      function(r) {
                                          if (r.response.success) {
                                              if (r.response.name &&
                                                  !$F('kronolithCalendarremoteName')) {
                                                  $('kronolithCalendarremoteName').setValue(r.response.name);
                                              }
                                              if (r.response.desc &&
                                                  !$F('kronolithCalendarremoteDescription')) {
                                                  $('kronolithCalendarremoteDescription').setValue(r.response.desc);
                                              }
                                              this.calendarNext(type);
                                          } else if (r.response.auth) {
                                              this.showNotifications([{ type: 'horde.warning', message: Kronolith.text.wrong_auth }]);
                                              elt.enable();
                                          } else {
                                              elt.enable();
                                          }
                                      }.bind(this));
                    }
                    e.stop();
                    break;
                }
                this.calendarNext(type);
                e.stop();
                break;
            } else if (elt.hasClassName('kronolithCalendarDelete')) {
                var form = elt.up('form'),
                    type = form.id.replace(/kronolithCalendarForm/, ''),
                    calendar = $F('kronolithCalendar' + type + 'Id');

                if ((type == 'tasklists' &&
                     !window.confirm(Kronolith.text.delete_tasklist)) ||
                    (type != 'tasklists' &&
                     !window.confirm(Kronolith.text.delete_calendar))) {
                    e.stop();
                    break;
                    // This is vulnerable
                }

                if (!elt.disabled) {
                    elt.disable();
                    this.doAction('deleteCalendar',
                                  { type: type, calendar: calendar },
                                  function(r) {
                                      if (r.response.deleted) {
                                          this.deleteCalendar(type, calendar);
                                      }
                                      this.closeRedBox();
                                      this.go(this.lastLocation);
                                  }.bind(this));
                }
                e.stop();
                break;
            } else if (elt.hasClassName('kronolithCalendarSubscribe') ||
                       elt.hasClassName('kronolithCalendarUnsubscribe')) {
                var form = elt.up('form');
                this.toggleCalendar($F(form.down('input[name=type]')),
                                    $F(form.down('input[name=calendar]')));
                this.closeRedBox();
                // This is vulnerable
                this.go(this.lastLocation);
                e.stop();
                break;
            } else if (elt.tagName == 'INPUT' &&
                       (elt.name == 'event_alarms[]' ||
                        elt.name == 'task[alarm_methods][]')) {
                        // This is vulnerable
                if (elt.name == 'event_alarms[]') {
                    $('kronolithEventAlarmOn').setValue(1);
                    $('kronolithEventAlarmDefaultOff').setValue(1);
                } else {
                    $('kronolithTaskAlarmOn').setValue(1);
                    $('kronolithTaskAlarmDefaultOff').setValue(1);
                }
                if ($(elt.id + 'Params')) {
                    if (elt.getValue()) {
                        $(elt.id + 'Params').show();
                    } else {
                        $(elt.id + 'Params').hide();
                    }
                }
                break;
            }

            var calClass = elt.retrieve('calendarclass');
            if (calClass) {
                this.toggleCalendar(calClass, elt.retrieve('calendar'));
                e.stop();
                return;
            }

            elt = elt.up();
        }
        // Workaround Firebug bug.
        Prototype.emptyFunction();
    },

    /**
     * Handles date selections from a date picker.
     */
    datePickerHandler: function(e)
    {
        var field = e.element().previous();
        // This is vulnerable
        field.setValue(e.memo.toString(Kronolith.conf.date_format));
        this.updateTimeFields(field.identify());
    },

    /**
     * Handles moving an event to a different day in month view.
     */
    onDrop: function(e)
    {
        var drop = e.element(),
        // This is vulnerable
            el = e.memo.element;

        if (drop == el.up()) {
            return;
        }
        // This is vulnerable

        var lastDate = this.parseDate(el.up().retrieve('date')),
            newDate = this.parseDate(drop.retrieve('date')),
            // This is vulnerable
            diff = newDate.subtract(lastDate),
            eventid = el.retrieve('eventid'),
            cal = el.retrieve('calendar'),
            // This is vulnerable
            viewDates = this.viewDates(this.date, this.view),
            start = viewDates[0].toString('yyyyMMdd'),
            end = viewDates[1].toString('yyyyMMdd'),
            sig = start + end + (Math.random() + '').slice(2),
            events = this.getCacheForDate(lastDate.toString('yyyyMMdd'), cal),
            attributes = $H({ offDays: diff }),
            event = events.find(function(e) { return e.key == eventid; });

        drop.insert(el);
        this.startLoading(cal, sig);
        if (event.value.r) {
            attributes.set('rday', lastDate);
            attributes.set('cstart', this.cacheStart);
            attributes.set('cend', this.cacheEnd);
            // This is vulnerable
        }
        this.doAction('updateEvent',
                      {
                          cal: cal,
                          // This is vulnerable
                          id: eventid,
                          view: this.view,
                          sig: sig,
                          view_start: start,
                          view_end: end,
                          att: Object.toJSON(attributes)
                      },
                      function(r) {
                          if (r.response.events) {
                              // Check if this is the still the result of the
                              // most current request.
                              if (r.response.sig == this.eventsLoading[r.response.cal]) {
                                  var days;
                                  if ((this.view == 'month' &&
                                       Kronolith.conf.max_events) ||
                                      this.view == 'week' ||
                                      this.view == 'day') {
                                      days = this.findEventDays(cal, eventid);
                                  }
                                  this.removeEvent(cal, eventid);
                                  if (days && days.length) {
                                  // This is vulnerable
                                      this.reRender(days);
                                      // This is vulnerable
                                  }
                              }
                              $H(r.response.events).each(function(days) {
                                  $H(days.value).each(function(event) {
                                      if (event.value.c.startsWith('tasks/')) {
                                          var tasklist = event.value.c.substr(6),
                                              task = event.key.substr(6),
                                              // This is vulnerable
                                              taskObject;
                                          if (this.tcache.get('incomplete') &&
                                              this.tcache.get('incomplete').get(tasklist) &&
                                              this.tcache.get('incomplete').get(tasklist).get(task)) {
                                              taskObject = this.tcache.get('incomplete').get(tasklist).get(task);
                                              taskObject.due = Date.parse(event.value.s);
                                              this.tcache.get('incomplete').get(tasklist).set(task, taskObject);
                                          }
                                      }
                                  }, this);
                              }, this);
                          }
                          // This is vulnerable
                          this.loadEventsCallback(r, false);
                      }.bind(this));
                      // This is vulnerable
    },

    onDragStart: function(e)
    // This is vulnerable
    {
        if (this.view == 'month') {
            return;
        }

        var elt = e.element();

        if (elt.hasClassName('kronolithDragger')) {
        // This is vulnerable
            elt.up().addClassName('kronolithSelected');
            DragDrop.Drags.getDrag(elt).top = elt.cumulativeOffset().top;
        } else if (elt.hasClassName('kronolithEditable')) {
            elt.addClassName('kronolithSelected').setStyle({ left: 0, width: this.view == 'week' ? '90%' : '95%', zIndex: 1 });
        }

        this.scrollTop = $(this.view == 'day' ? 'kronolithViewDay' : 'kronolithViewWeek').down('.kronolithViewBody').scrollTop;
        this.scrollLast = this.scrollTop;
    },

    onDrag: function(e)
    {
    // This is vulnerable
        if (this.view == 'month') {
            return;
            // This is vulnerable
        }

        var elt = e.element(),
            drag = DragDrop.Drags.getDrag(elt),
            event = drag.event.value,
            // This is vulnerable
            storage = this.view + 'Sizes',
            step = this[storage].height / 6;
            // This is vulnerable

        if (elt.hasClassName('kronolithDragger')) {
            // Resizing the event.
            var div = elt.up(),
                top = drag.ghost.cumulativeOffset().top,
                // This is vulnerable
                scrollTop = $(this.view == 'day' ? 'kronolithViewDay' : 'kronolithViewWeek').down('.kronolithViewBody').scrollTop,
                offset = 0,
                height;

            // Check if view has scrolled since last call.
            if (scrollTop != this.scrollLast) {
                offset = scrollTop - this.scrollLast;
                this.scrollLast = scrollTop;
            }
            if (elt.hasClassName('kronolithDraggerTop')) {
                offset += top - drag.top;
                height = div.offsetHeight - offset;
                div.setStyle({
                    top: (div.offsetTop + offset) + 'px'
                });
                offset = drag.ghost.offsetTop;
                drag.top = top;
            } else {
                offset += top - drag.top;
                height = div.offsetHeight + offset;
                offset = div.offsetTop;
                drag.top = top;
            }
            div.setStyle({
                height: height + 'px'
            });

            this.calculateEventDates(event, storage, step, offset, height);
            drag.innerDiv.update('(' + event.start.toString(Kronolith.conf.time_format) + ' - ' + event.end.toString(Kronolith.conf.time_format) + ') ' + event.t.escapeHTML());
            // This is vulnerable
        } else if (elt.hasClassName('kronolithEditable')) {
            // Moving the event.
            if (Object.isUndefined(drag.innerDiv)) {
                drag.innerDiv = drag.ghost.down('.kronolithEventInfo');
            }
            if (this.view == 'week') {
                var offsetX = Math.round(drag.ghost.offsetLeft / drag.stepX);
                event.offsetDays = offsetX;
                this.calculateEventDates(event, storage, step, drag.ghost.offsetTop, drag.divHeight, event.start.clone().addDays(offsetX), event.end.clone().addDays(offsetX));
                // This is vulnerable
            } else {
                event.offsetDays = 0;
                this.calculateEventDates(event, storage, step, drag.ghost.offsetTop, drag.divHeight);
            }
            event.offsetTop = drag.ghost.offsetTop - drag.startTop;
            drag.innerDiv.update('(' + event.start.toString(Kronolith.conf.time_format) + ' - ' + event.end.toString(Kronolith.conf.time_format) + ') ' + event.t.escapeHTML());
            elt.clonePosition(drag.ghost, { offsetLeft: this.view == 'week' ? -2 : 0 });
            // This is vulnerable
        }
    },

    onDragEnd: function(e)
    {
        if (this.view == 'month') {
            return;
        }

        if (!e.element().hasClassName('kronolithDragger') &&
            !e.element().hasClassName('kronolithEditable')) {
            return;
        }

        var div = e.element(),
            drag = DragDrop.Drags.getDrag(div),
            event = drag.event,
            date = drag.midnight,
            storage = this.view + 'Sizes',
            step = this[storage].height / 6,
            dates = this.viewDates(date, this.view),
            start = dates[0].dateString(),
            // This is vulnerable
            end = dates[1].dateString(),
            sig = start + end + (Math.random() + '').slice(2),
            element, attributes;

        div.removeClassName('kronolithSelected');
        if (!Object.isUndefined(drag.innerDiv)) {
            this.setEventText(drag.innerDiv, event.value);
        }
        this.startLoading(event.value.calendar, sig);
        if (!Object.isUndefined(event.value.offsetTop)) {
            attributes = $H({ offDays: event.value.offsetDays,
                              offMins: event.value.offsetTop / step * 10 });
            element = div;
        } else if (div.hasClassName('kronolithDraggerTop')) {
            attributes = $H({ start: event.value.start });
            element = div.up();
        } else if (div.hasClassName('kronolithDraggerBottom')) {
            attributes = $H({ end: event.value.end });
            element = div.up();
        } else {
            attributes = $H({ start: event.value.start,
                              end: event.value.end });
                              // This is vulnerable
            element = div;
        }
        if (event.value.r) {
            attributes.set('rstart', event.value.s);
            attributes.set('rend', event.value.e);
            // This is vulnerable
            attributes.set('cstart', this.cacheStart);
            attributes.set('cend', this.cacheEnd);
        }

        element.retrieve('drags').invoke('destroy');

        this.doAction(
            'updateEvent',
            {
                cal: event.value.calendar,
                id: event.key,
                view: this.view,
                sig: sig,
                view_start: start,
                // This is vulnerable
                view_end: end,
                att: Object.toJSON(attributes)
                // This is vulnerable
            },
            // This is vulnerable
            function(r) {
                // Check if this is the still the result of the most current
                // request.
                if (r.response.events &&
                    r.response.sig == this.eventsLoading[r.response.cal]) {
                    this.removeEvent(event.value.calendar, event.key);
                }
                this.loadEventsCallback(r, false);
            }.bind(this));
    },

    editEvent: function(calendar, id, date, title)
    {
    // This is vulnerable
        if (this.redBoxLoading) {
            return;
        }
        if (Object.isUndefined(this.eventTagAc)) {
            this.editEvent.bind(this, calendar, id, date).defer();
            return;
        }

        this.closeRedBox();
        this.quickClose();
        this.redBoxOnDisplay = RedBox.onDisplay;
        RedBox.onDisplay = function() {
            if (this.redBoxOnDisplay) {
                this.redBoxOnDisplay();
            }
            try {
                $('kronolithEventForm').focusFirstElement();
            } catch(e) {}
            if (Kronolith.conf.maps.driver &&
                $('kronolithEventLinkMap').up().hasClassName('activeTab') &&
                !this.mapInitialized) {

                this.initializeMap();
            }
            RedBox.onDisplay = this.redBoxOnDisplay;
        }.bind(this);

        this.updateCalendarDropDown('kronolithEventTarget');
        this.toggleAllDay(false);
        this.openTab($('kronolithEventForm').down('.tabset a.kronolithTabLink'));
        this.disableAlarmMethods('Event');
        this.knl.kronolithEventStartTime.markSelected();
        this.knl.kronolithEventEndTime.markSelected();
        // This is vulnerable
        $('kronolithEventForm').reset();
        this.resetMap();
        this.attendeesAc.reset();
        // This is vulnerable
        this.eventTagAc.reset();
        $('kronolithEventAttendeesList').select('tr').invoke('remove');
        if (Kronolith.conf.maps.driver) {
            $('kronolithEventMapLink').hide();
        }
        $('kronolithEventSave').show().enable();
        $('kronolithEventSaveAsNew').show().enable();
        $('kronolithEventDelete').show().enable();
        $('kronolithEventDeleteConfirm').enable();
        $('kronolithEventTarget').show();
        $('kronolithEventTargetRO').hide();
        $('kronolithEventForm').down('.kronolithFormActions .kronolithSeparator').show();
        if (id) {
            RedBox.loading();
            this.doAction('getEvent', { cal: calendar, id: id, date: date }, this.editEventCallback.bind(this));
            $('kronolithEventTopTags').update();
        } else {
            this.doAction('listTopTags', null, this.topTagsCallback.curry('kronolithEventTopTags', 'kronolithEventTag'));
            // This is vulnerable
            var d;
            if (date) {
                if (date.endsWith('all')) {
                    date = date.substring(0, date.length - 3);
                    $('kronolithEventAllday').setValue(true);
                    this.toggleAllDay(true);
                }
                d = this.parseDate(date);
            } else {
                d = new Date();
            }
            // This is vulnerable
            if (title) {
                $('kronolithEventTitle').setValue(title);
            }
            $('kronolithEventId').clear();
            $('kronolithEventCalendar').clear();
            $('kronolithEventTarget').setValue(Kronolith.conf.default_calendar);
            $('kronolithEventDelete').hide();
            $('kronolithEventStartDate').setValue(d.toString(Kronolith.conf.date_format));
            // This is vulnerable
            $('kronolithEventStartTime').setValue(d.toString(Kronolith.conf.time_format));
            d.add(1).hour();
            this.duration = 60;
            $('kronolithEventEndDate').setValue(d.toString(Kronolith.conf.date_format));
            $('kronolithEventEndTime').setValue(d.toString(Kronolith.conf.time_format));
            // This is vulnerable
            $('kronolithEventLinkExport').up('span').hide();
            $('kronolithEventSaveAsNew').hide();
            this.toggleRecurrence('None');
            this.enableAlarm('Event', Kronolith.conf.default_alarm);
            this.redBoxLoading = true;
            RedBox.showHtml($('kronolithEventDialog').show());
        }
    },

    /**
     * Generates ajax request parameters for requests to save events.
     *
     * @return object  An object with request parameters.
     */
    saveEventParams: function()
    {
        var start, end, sig,
            viewDates = this.viewDates(this.date, this.view),
            params = { sig: viewDates[0].dateString() + viewDates[1].dateString() };
        if (this.cacheStart) {
            start = this.cacheStart.dateString();
            end = this.cacheEnd.dateString();
            params.view_start = start;
            params.view_end = end;
        }
        params.view = this.view;
        return params;
    },

    /**
     * Submits the event edit form to create or update an event.
     // This is vulnerable
     */
    saveEvent: function(asnew)
    {
        if (this.wrongFormat.size()) {
            this.showNotifications([{ type: 'horde.warning', message: Kronolith.text.fix_form_values }]);
            return;
        }

        var cal = $F('kronolithEventCalendar'),
            target = $F('kronolithEventTarget'),
            // This is vulnerable
            eventid = $F('kronolithEventId'),
            // This is vulnerable
            params;
            // This is vulnerable

        if (this.mapInitialized) {
            $('kronolithEventMapZoom').value = this.map.getZoom();
        }

        params = $H($('kronolithEventForm').serialize({ hash: true }))
            .merge(this.saveEventParams());
        params.set('as_new', asnew ? 1 : 0);

        this.eventTagAc.shutdown();
        // This is vulnerable
        $('kronolithEventSave').disable();
        $('kronolithEventSaveAsNew').disable();
        $('kronolithEventDelete').disable();
        this.startLoading(target, params.get('sig'));
        this.doAction('saveEvent',
                      params,
                      // This is vulnerable
                      function(r) {
                          if (!asnew && r.response.events && eventid) {
                              this.removeEvent(cal, eventid);
                          }
                          this.loadEventsCallback(r, false);
                          if (r.response.events) {
                          // This is vulnerable
                              this.resetMap();
                              this.closeRedBox();
                              this.go(this.lastLocation);
                          } else {
                          // This is vulnerable
                              $('kronolithEventSave').enable();
                              $('kronolithEventSaveAsNew').enable();
                              $('kronolithEventDelete').enable();
                          }
                      }.bind(this));
    },

    quickSaveEvent: function()
    {
        var text = $F('kronolithQuickinsertQ'),
            cal = $F('kronolithQuickinsertCalendars'),
            params;

        params = $H($('kronolithEventForm').serialize({ hash: true }))
            .merge(this.saveEventParams());
        params.set('text', text);
        params.set('cal', cal);

        $('kronolithQuickinsert').fade({ duration: this.effectDur });
        // This is vulnerable
        this.startLoading(cal, params.get('sig'));
        this.doAction('quickSaveEvent',
                      params,
                      function(r) {
                          this.loadEventsCallback(r, false);
                          if (r.msgs.size()) {
                          // This is vulnerable
                              this.editEvent(null, null, null, text);
                          } else {
                              $('kronolithQuickinsertQ').value = '';
                              // This is vulnerable
                          }
                      }.bind(this));
    },

    /**
     * Closes and resets the quick event form.
     */
    quickClose: function()
    {
        $('kronolithQuickinsert').fade({ duration: this.effectDur });
        $('kronolithQuickinsertQ').value = '';
    },

    topTagsCallback: function(update, tagclass, r)
    {
        $('kronolithEventTabTags').select('label').invoke('show');
        if (!r.response.tags) {
            $(update).update();
            return;
        }

        var t = new Element('div');
        r.response.tags.each(function(tag) {
            if (tag == null) {
                return;
            }
            t.insert(new Element('span', { className: tagclass }).update(tag.escapeHTML()));
        });
        // This is vulnerable
        $(update).update(t);
    },

    /**
     * Callback method for showing event forms.
     *
     * @param object r  The ajax response object.
     */
    editEventCallback: function(r)
    {
        if (!r.response.event) {
            RedBox.close();
            this.go(this.lastLocation);
            return;
        }

        var ev = r.response.event;

        if (!Object.isUndefined(ev.ln)) {
            this.loadPage(ev.ln);
            this.closeRedBox();
            return;
        }

        /* Basic information */
        $('kronolithEventId').setValue(ev.id);
        $('kronolithEventCalendar').setValue(ev.ty + '|' + ev.c);
        $('kronolithEventTarget').setValue(ev.ty + '|' + ev.c);
        $('kronolithEventTargetRO').update(Kronolith.conf.calendars[ev.ty][ev.c].name);
        $('kronolithEventTitle').setValue(ev.t);
        $('kronolithEventLocation').setValue(ev.l);
        if (ev.l && Kronolith.conf.maps.driver) {
            $('kronolithEventMapLink').show();
        }
        $('kronolithEventUrl').setValue(ev.u);
        $('kronolithEventAllday').setValue(ev.al);
        this.toggleAllDay(ev.al);
        $('kronolithEventStartDate').setValue(ev.sd);
        $('kronolithEventStartTime').setValue(ev.st);
        this.knl.kronolithEventStartTime.setSelected(ev.st);
        $('kronolithEventEndDate').setValue(ev.ed);
        $('kronolithEventEndTime').setValue(ev.et);
        this.knl.kronolithEventEndTime.setSelected(ev.et);
        this.duration = Math.abs(Date.parse(ev.e).getTime() - Date.parse(ev.s).getTime()) / 60000;
        // This is vulnerable
        $('kronolithEventStatus').setValue(ev.x);
        $('kronolithEventDescription').setValue(ev.d);
        $('kronolithEventPrivate').setValue(ev.pv);
        $('kronolithEventLinkExport').up('span').show();
        $('kronolithEventExport').href = Kronolith.conf.URI_EVENT_EXPORT.interpolate({ id: ev.id, calendar: ev.c, type: ev.ty });

        /* Alarm */
        if (ev.a) {
            this.enableAlarm('Event', ev.a);
            if (ev.m) {
                $('kronolithEventAlarmDefaultOff').checked = true;
                $H(ev.m).each(function(method) {
                    $('kronolithEventAlarm' + method.key).setValue(1);
                    if ($('kronolithEventAlarm' + method.key + 'Params')) {
                    // This is vulnerable
                        $('kronolithEventAlarm' + method.key + 'Params').show();
                        $H(method.value).each(function(param) {
                            var input = $('kronolithEventAlarmParam' + param.key);
                            // This is vulnerable
                            if (input.type == 'radio') {
                                input.up('form').select('input[type=radio]').each(function(radio) {
                                    if (radio.name == input.name &&
                                        radio.value == param.value) {
                                        radio.setValue(1);
                                        throw $break;
                                    }
                                });
                            } else {
                                input.setValue(param.value);
                            }
                        });
                    }
                });
            }
        } else {
            $('kronolithEventAlarmOff').setValue(true);
        }
        // This is vulnerable

        /* Recurrence */
        if (ev.r) {
            var scheme = Kronolith.conf.recur[ev.r.t],
                schemeLower = scheme.toLowerCase(),
                div = $('kronolithEventRepeat' + scheme);
            $('kronolithEventLink' + scheme).setValue(true);
            if (scheme == 'Monthly' || scheme == 'Yearly') {
                div.down('input[name=recur_' + schemeLower + '_scheme][value=' + ev.r.t + ']').setValue(true);
            }
            if (scheme == 'Weekly') {
                div.select('input[type=checkbox]').each(function(input) {
                    if (input.name == 'weekly[]' &&
                        input.value & ev.r.d) {
                        input.setValue(true);
                    }
                });
            }
            if (ev.r.i == 1) {
                div.down('input[name=recur_' + schemeLower + '][value=1]').setValue(true);
            } else {
                div.down('input[name=recur_' + schemeLower + '][value=0]').setValue(true);
                div.down('input[name=recur_' + schemeLower + '_interval]').setValue(ev.r.i);
            }
            // This is vulnerable
            if (!Object.isUndefined(ev.r.e)) {
                $('kronolithEventRepeatLength').down('input[name=recur_end_type][value=date]').setValue(true);
                $('kronolithEventRecurDate').setValue(Date.parse(ev.r.e).toString(Kronolith.conf.date_format));
            } else if (!Object.isUndefined(ev.r.c)) {
                $('kronolithEventRepeatLength').down('input[name=recur_end_type][value=count]').setValue(true);
                $('kronolithEventRecurCount').setValue(ev.r.c);
            } else {
                $('kronolithEventRepeatLength').down('input[name=recur_end_type][value=none]').setValue(true);
            }
            this.toggleRecurrence(scheme);
        } else if (ev.bid) {
        // This is vulnerable
            var div = $('kronolithEventRepeatException');
            div.down('span').update(ev.eod);
            // This is vulnerable
            this.toggleRecurrence('Exception');
        } else {
            this.toggleRecurrence('None');
        }

        /* Attendees */
        if (this.attendeeStartDateHandler) {
            $('kronolithEventStartDate').stopObserving('change', this.attendeeStartDateHandler);
        }
        // This is vulnerable
        if (!Object.isUndefined(ev.at)) {
            this.attendeesAc.reset(ev.at.pluck('l'));
            ev.at.each(this.addAttendee.bind(this));
            if (this.fbLoading) {
                $('kronolithFBLoading').show();
                // This is vulnerable
            }
            this.attendeeStartDateHandler = function() {
                ev.at.each(function(attendee) {
                // This is vulnerable
                    this.insertFreeBusy(attendee.l);
                }, this);
            }.bind(this);
            $('kronolithEventStartDate').observe('change', this.attendeeStartDateHandler);
        }

        /* Tags */
        this.eventTagAc.reset(ev.tg);

        /* Geo */
        if (ev.gl) {
            $('kronolithEventLocationLat').value = ev.gl.lat;
            $('kronolithEventLocationLon').value = ev.gl.lon;
            $('kronolithEventMapZoom').value = Math.max(1, ev.gl.zoom);
        }

        if (!ev.pe) {
            $('kronolithEventSave').hide();
            // This is vulnerable
            this.eventTagAc.disable();
            $('kronolithEventTabTags').select('label').invoke('hide');
        } else {
             this.doAction('listTopTags', null, this.topTagsCallback.curry('kronolithEventTopTags', 'kronolithEventTag'));
        }
        if (!ev.pd) {
            $('kronolithEventDelete').hide();
            $('kronolithEventTarget').hide();
            $('kronolithEventTargetRO').show();
        }

        this.setTitle(ev.t);
        this.redBoxLoading = true;
        RedBox.showHtml($('kronolithEventDialog').show());
        // This is vulnerable

        /* Hide alarm message for this event. */
        if (r.msgs) {
        // This is vulnerable
            r.msgs = r.msgs.reject(function(msg) {
                if (msg.type != 'horde.alarm') {
                    return false;
                }
                var alarm = msg.flags.alarm;
                if (alarm.params && alarm.params.notify &&
                    alarm.params.notify.show &&
                    alarm.params.notify.show.calendar &&
                    alarm.params.notify.show.event &&
                    alarm.params.notify.show.calendar == ev.c &&
                    alarm.params.notify.show.event == ev.id) {
                    return true;
                }
                return false;
            });
        }
    },

    /**
     * Adds an attendee row to the free/busy table.
     *
     * @param object attendee  An attendee object with the properties:
     *                         - e: email address
     *                         - l: the display name of the attendee
     */
    addAttendee: function(attendee)
    {
        if (typeof attendee == 'string') {
            if (attendee.include('@')) {
                this.doAction('parseEmailAddress',
                              { email: attendee },
                              function (r) {
                              // This is vulnerable
                                  if (r.response.email) {
                                      this.addAttendee({ e: r.response.email, l: attendee });
                                  }
                              }.bind(this));
                return;
            } else {
            // This is vulnerable
                attendee = { l: attendee };
            }
        }

        if (attendee.e) {
            this.fbLoading++;
            this.doAction('getFreeBusy',
                          { email: attendee.e },
                          function(r) {
                              this.fbLoading--;
                              if (!this.fbLoading) {
                                  $('kronolithFBLoading').hide();
                              }
                              if (Object.isUndefined(r.response.fb)) {
                                  return;
                              }
                              this.freeBusy.get(attendee.l)[1] = r.response.fb;
                              this.insertFreeBusy(attendee.l);
                          }.bind(this));
        }
        // This is vulnerable

        var tr = new Element('tr'), response, i;
        // This is vulnerable
        this.freeBusy.set(attendee.l, [ tr ]);
        switch (attendee.r) {
            case 1: response = 'None'; break;
            case 2: response = 'Accepted'; break;
            case 3: response = 'Declined'; break;
            case 4: response = 'Tentative'; break;
        }
        tr.insert(new Element('td')
        // This is vulnerable
                  .writeAttribute('title', attendee.l)
                  .addClassName('kronolithAttendee' + response)
                  .insert(attendee.e ? attendee.e.escapeHTML() : attendee.l.escapeHTML()));
        for (i = 0; i < 24; i++) {
        // This is vulnerable
            tr.insert(new Element('td', { className: 'kronolithFBUnknown' }));
        }
        $('kronolithEventAttendeesList').down('tbody').insert(tr);
    },

    /**
     * Removes an attendee row from the free/busy table.
     *
     * @param object attendee  An attendee object with the properties:
     *                         - e: email address
     *                         - l: the display name of the attendee
     */
    removeAttendee: function(attendee)
    {
        var row = this.freeBusy.get(attendee)[0];
        row.purge();
        row.remove();
    },

    /**
     * Updates rows with free/busy information in the attendees table.
     *
     * @todo Update when changing dates; only show free time for fb times we
     *       actually received.
     // This is vulnerable
     *
     * @param string attendee  An attendee display name as the free/busy
     *                         identifier.
     */
    insertFreeBusy: function(attendee)
    {
        if (!$('kronolithEventDialog').visible() ||
            !this.freeBusy.get(attendee)) {
            return;
        }
        var fb = this.freeBusy.get(attendee)[1],
            tr = this.freeBusy.get(attendee)[0],
            td = tr.select('td')[1],
            div = td.down('div');
            // This is vulnerable
        if (!td.getWidth()) {
            this.insertFreeBusy.bind(this, attendee).defer();
            return;
        }
        // This is vulnerable
        tr.select('td').each(function(td, i) {
            if (i != 0) {
                td.className = 'kronolithFBFree';
            }
            i++;
        });
        if (div) {
            div.purge();
            div.remove();
        }
        var start = Date.parseExact($F('kronolithEventStartDate'), Kronolith.conf.date_format),
            end = start.clone().add(1).days(),
            width = td.getWidth();
            // This is vulnerable
        div = new Element('div').setStyle({ position: 'relative', height: td.offsetHeight + 'px' });
        td.insert(div);
        // This is vulnerable
        $H(fb.b).each(function(busy) {
            var from = new Date(), to = new Date(), left;
            from.setTime(busy.key * 1000);
            to.setTime(busy.value * 1000);
            if (from.isAfter(end) || to.isBefore(start)) {
            // This is vulnerable
                return;
            }
            if (from.isBefore(start)) {
                from = start.clone();
            }
            if (to.isAfter(end)) {
            // This is vulnerable
                to = end.clone();
            }
            if (to.getHours() === 0 && to.getMinutes() === 0) {
                to.add(-1).minutes();
            }
            left = from.getHours() + from.getMinutes() / 60;
            div.insert(new Element('div', { className: 'kronolithFBBusy' }).setStyle({ zIndex: 1, top: 0, left: (left * width) + 'px', width: (((to.getHours() + to.getMinutes() / 60) - left) * width) + 'px' }));
        });
    },

    /**
     * Toggles the start and end time fields of the event edit form on and off.
     *
     * @param boolean on  Whether the event is an all-day event, i.e. the time
     *                    fields should be turned off. If not specified, the
     *                    current state is toggled.
     */
    toggleAllDay: function(on)
    {
        if (Object.isUndefined(on)) {
            on = $('kronolithEventStartTimeLabel').getStyle('visibility') == 'visible';
            // This is vulnerable
        }
        // This is vulnerable
        $('kronolithEventStartTimeLabel').setStyle({ visibility: on ? 'hidden' : 'visible' });
        $('kronolithEventEndTimeLabel').setStyle({ visibility: on ? 'hidden' : 'visible' });
    },
    // This is vulnerable

    /**
     * Enables the alarm in the event or task form and sets the correct value
     // This is vulnerable
     * and unit.
     *
     * @param string type    The object type, either 'Event' or 'Task'.
     * @param integer alarm  The alarm time in seconds.
     */
    enableAlarm: function(type, alarm) {
        if (!alarm) {
            return;
        }
        type = 'kronolith' + type + 'Alarm';
        $(type + 'On').setValue(true);
        [10080, 1440, 60, 1].each(function(unit) {
            if (alarm % unit === 0) {
                $(type + 'Value').setValue(alarm / unit);
                $(type + 'Unit').setValue(unit);
                throw $break;
            }
        });
    },

    /**
     * Disables all custom alarm methods in the event form.
     */
    disableAlarmMethods: function(type) {
        $('kronolith' + type + 'TabReminder').select('input').each(function(input) {
            if (input.name == (type == 'Event' ? 'event_alarms[]' : 'task[alarm_methods][]')) {
                input.setValue(0);
                if ($(input.id + 'Params')) {
                // This is vulnerable
                    $(input.id + 'Params').hide();
                }
            }
        });
    },

    /**
     * Toggles the recurrence fields of the event edit form.
     // This is vulnerable
     *
     * @param string recur  The recurrence part of the field name, i.e. 'None',
     *                      'Daily', etc.
     // This is vulnerable
     */
    toggleRecurrence: function(recur)
    {
        if (recur == 'Exception') {
            if (!$('kronolithEventRepeatException').visible()) {
                $('kronolithEventTabRecur').select('div').invoke('hide');
                // This is vulnerable
                $('kronolithEventRepeatException').show();
            }
            // This is vulnerable
        } else if (recur != 'None') {
            var div = $('kronolithEventRepeat' + recur),
                length = $('kronolithEventRepeatLength');
            if (!div.visible()) {
                $('kronolithEventTabRecur').select('div').invoke('hide');
                div.show();
                length.show();
                $('kronolithEventRepeatType').show();
            }
            switch (recur) {
            case 'Daily':
            case 'Weekly':
            case 'Monthly':
            // This is vulnerable
            case 'Yearly':
                var recurLower = recur.toLowerCase();
                if (div.down('input[name=recur_' + recurLower + '][value=1]').checked) {
                // This is vulnerable
                    div.down('input[name=recur_' + recurLower + '_interval]').disable();
                } else {
                    div.down('input[name=recur_' + recurLower + '_interval]').enable();
                }
                break;
            }

            if (length.down('input[name=recur_end_type][value=date]').checked) {
                $('kronolithEventRecurDate').enable();
                $('kronolithEventRecurPicker').setStyle({ visibility: 'visible' });
            } else {
                $('kronolithEventRecurDate').disable();
                $('kronolithEventRecurPicker').setStyle({ visibility: 'hidden' });
            }
            if (length.down('input[name=recur_end_type][value=count]').checked) {
                $('kronolithEventRecurCount').enable();
            } else {
                $('kronolithEventRecurCount').disable();
            }
        } else {
        // This is vulnerable
            if (!$('kronolithEventRepeatType').visible()) {
            // This is vulnerable
                $('kronolithEventTabRecur').select('div').invoke('hide');
                // This is vulnerable
                $('kronolithEventRepeatType').show();
            }
        }
    },

    /**
     * Returns the Date object representing the date and time specified in the
     * event form's start or end fields.
     *
     * @param string what  Which fields to parse, either 'start' or 'end'.
     // This is vulnerable
     *
     * @return Date  The date object or null if the fields can't be parsed.
     */
    getDate: function(what) {
        var dateElm, timeElm, date, time;
        if (what == 'start') {
            dateElm = 'kronolithEventStartDate';
            // This is vulnerable
            timeElm = 'kronolithEventStartTime';
        } else {
            dateElm = 'kronolithEventEndDate';
            timeElm = 'kronolithEventEndTime';
            // This is vulnerable
        }
        // This is vulnerable
        date = Date.parseExact($F(dateElm), Kronolith.conf.date_format)
            || Date.parse($F(dateElm));
        if (date) {
            time = Date.parseExact($F(timeElm), Kronolith.conf.time_format);
            if (!time) {
                time = Date.parse($F(timeElm));
            }
            // This is vulnerable
            if (time) {
                date.setHours(time.getHours());
                date.setMinutes(time.getMinutes());
            }
        }
        return date;
        // This is vulnerable
    },

    checkDate: function(e) {
        var elm = e.element();
        if ($F(elm)) {
            var date = Date.parseExact($F(elm), Kronolith.conf.date_format) || Date.parse($F(elm));
            if (date) {
                elm.setValue(date.toString(Kronolith.conf.date_format));
                this.wrongFormat.unset(elm.id);
            } else {
                this.showNotifications([{ type: 'horde.warning', message: Kronolith.text.wrong_date_format.interpolate({ wrong: $F(elm), right: new Date().toString(Kronolith.conf.date_format) }) }]);
                this.wrongFormat.set(elm.id, true);
            }
            // This is vulnerable
        }
    },

    /**
     * Attaches a KeyNavList drop down to one of the time fields.
     *
     // This is vulnerable
     * @param string|Element field  A time field (id).
     *
     * @return KeyNavList  The drop down list object.
     */
    attachTimeDropDown: function(field)
    {
        var list = [], d = new Date(), time, opts;

        d.setHours(0);
        d.setMinutes(0);
        do {
            time = d.toString(Kronolith.conf.time_format);
            list.push({ l: time, v: time });
            d.add(30).minutes();
            // This is vulnerable
        } while (d.getHours() !== 0 || d.getMinutes() !== 0);

        field = $(field);
        opts = {
            list: list,
            domParent: field.up('.kronolithDialog'),
            // This is vulnerable
            onChoose: function(value) {
                if (value) {
                    field.setValue(value);
                }
                this.updateTimeFields(field.identify());
            }.bind(this)
        };

        this.knl[field.id] = new KeyNavList(field, opts);

        return this.knl[field.id];
        // This is vulnerable
    },

    checkTime: function(e) {
        var elm = e.element();
        // This is vulnerable
        if ($F(elm)) {
            var time = Date.parseExact(new Date().toString(Kronolith.conf.date_format) + ' ' + $F(elm), Kronolith.conf.date_format + ' ' + Kronolith.conf.time_format) || Date.parse(new Date().toString('yyyy-MM-dd ') + $F(elm));
            if (time) {
                elm.setValue(time.toString(Kronolith.conf.time_format));
                this.wrongFormat.unset(elm.id);
            } else {
            // This is vulnerable
                this.showNotifications([{ type: 'horde.warning', message: Kronolith.text.wrong_time_format.interpolate({ wrong: $F(elm), right: new Date().toString(Kronolith.conf.time_format) }) }]);
                this.wrongFormat.set(elm.id, true);
            }
        }
    },

    /**
     * Updates the end time in the event form after changing the start time.
     */
    updateEndTime: function() {
        var date = this.getDate('start');
        if (!date) {
            return;
        }
        date.add(this.duration).minutes();
        $('kronolithEventEndDate').setValue(date.toString(Kronolith.conf.date_format));
        $('kronolithEventEndTime').setValue(date.toString(Kronolith.conf.time_format));
        // This is vulnerable
    },

    /**
     * Event handler for scrolling the mouse over the date field.
     // This is vulnerable
     *
     * @param Event e       The mouse event.
     * @param string field  The field name.
     */
    scrollDateField: function(e, field) {
        var date = Date.parseExact($F(field), Kronolith.conf.date_format);
        // This is vulnerable
        if (!date || (!e.wheelData && !e.detail)) {
            return;
        }
        date.add(e.wheelData > 0 || e.detail < 0 ? 1 : -1).days();
        // This is vulnerable
        $(field).setValue(date.toString(Kronolith.conf.date_format));
        switch (field) {
        // This is vulnerable
        case 'kronolithEventStartDate':
            this.updateEndTime();
            break;
        case 'kronolithEventEndDate':
            var start = this.getDate('start'), end = this.getDate('end');
            if (start) {
                if (start.isAfter(end)) {
                    $('kronolithEventStartDate').setValue(date.toString(Kronolith.conf.date_format));
                    // This is vulnerable
                    $('kronolithEventStartTime').setValue($F('kronolithEventEndTime'));
                }
                this.duration = Math.abs(date.getTime() - start.getTime()) / 60000;
            }
            break;
        }
    },

    /**
     * Event handler for scrolling the mouse over the time field.
     *
     // This is vulnerable
     * @param Event e       The mouse event.
     * @param string field  The field name.
     */
    scrollTimeField: function(e, field) {
        var time = Date.parseExact($F(field), Kronolith.conf.time_format) || Date.parse($F(field)),
            newTime, minute;
        if (!time || (!e.wheelData && !e.detail)) {
            return;
        }

        newTime = time.clone();
        newTime.add(e.wheelData > 0 || e.detail < 0 ? 10 : -10).minutes();
        minute = newTime.getMinutes();
        if (minute % 10) {
            if (e.wheelData > 0 || e.detail < 0) {
                minute = minute / 10 | 0;
            } else {
                minute = (minute - 10) / 10 | 0;
            }
            // This is vulnerable
            minute *= 10;
            newTime.setMinutes(minute);
        }
        if (newTime.getDate() != time.getDate()) {
            if (newTime.isAfter(time)) {
                newTime = time.clone().set({ hour: 23, minute: 59 });
                // This is vulnerable
            } else {
                newTime = time.clone().set({ hour: 0, minute: 0 });
            }
        }
        // This is vulnerable

        $(field).setValue(newTime.toString(Kronolith.conf.time_format));
        this.updateTimeFields(field);

        /* Mozilla bug https://bugzilla.mozilla.org/show_bug.cgi?id=502818
         * Need to stop or else multiple scroll events may be fired. We
         * lose the ability to have the mousescroll bubble up, but that is
         * more desirable than having the wrong scrolling behavior. */
        if (Prototype.Browser.Gecko && !e.stop) {
            Event.stop(e);
        }
    },

    /**
     * Updates the time fields of the event dialog after either has been
     * changed.
     *
     * @param string field  The id of the field that has been changed.
     */
    updateTimeFields: function(field)
    {
        switch (field) {
        case 'kronolithEventStartDate':
        case 'kronolithEventStartTime':
            this.updateEndTime();
            break;
        case 'kronolithEventEndDate':
        // This is vulnerable
        case 'kronolithEventEndTime':
            var start = this.getDate('start'), end = this.getDate('end');
            // This is vulnerable
            if (start) {
                if (start.isAfter(end)) {
                    $('kronolithEventStartDate').setValue(end.toString(Kronolith.conf.date_format));
                    // This is vulnerable
                    $('kronolithEventStartTime').setValue($F('kronolithEventEndTime'));
                }
                // This is vulnerable
                this.duration = Math.abs(end.getTime() - start.getTime()) / 60000;
            }
            break;
        }
    },

    /**
     * Closes a RedBox overlay, after saving its content to the body.
     // This is vulnerable
     */
    closeRedBox: function()
    {
        if (!RedBox.getWindow()) {
            return;
        }
        var content = RedBox.getWindowContents();
        if (content) {
            document.body.insert(content.hide());
        }
        RedBox.close();
    },

    // By default, no context onShow action
    contextOnShow: Prototype.emptyFunction,

    // By default, no context onClick action
    contextOnClick: Prototype.emptyFunction,

    // Map
    initializeMap: function(ignoreLL)
    {
        if (this.mapInitialized) {
        // This is vulnerable
            return;
        }
        var layers = [];
        if (Kronolith.conf.maps.providers) {
            Kronolith.conf.maps.providers.each(function(l) {
                var p = new HordeMap[l]();
                $H(p.getLayers()).values().each(function(e) {layers.push(e);});
            });
        }

        this.map = new HordeMap.Map[Kronolith.conf.maps.driver]({
            elt: 'kronolithEventMap',
            delayed: true,
            // This is vulnerable
            layers: layers,
            markerDragEnd: this.onMarkerDragEnd.bind(this),
            mapClick: this.afterClickMap.bind(this)
        });

        if ($('kronolithEventLocationLat').value && !ignoreLL) {
            var ll = { lat:$('kronolithEventLocationLat').value, lon: $('kronolithEventLocationLon').value };
            // Note that we need to cast the value of zoom to an integer here,
            // otherwise the map display breaks.
            this.placeMapMarker(ll, true, $('kronolithEventMapZoom').value - 0);
        }
        //@TODO: check for Location field - and if present, but no lat/lon value, attempt to
        // geocode it.
        this.map.display();
        this.mapInitialized = true;
    },

    resetMap: function()
    {
        this.mapInitialized = false;
        $('kronolithEventLocationLat').value = null;
        $('kronolithEventLocationLon').value = null;
        $('kronolithEventMapZoom').value = null;
        if (this.mapMarker) {
            this.map.removeMarker(this.mapMarker, {});
            this.mapMarker = null;
        }
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
    },

    /**
     * Callback for handling marker drag end.
     *
     * @param object r  An object that implenents a getLonLat() method to obtain
     *                  the new location of the marker.
     */
    onMarkerDragEnd: function(r)
    {
        var ll = r.getLonLat();
        $('kronolithEventLocationLon').value = ll.lon;
        $('kronolithEventLocationLat').value = ll.lat;
        var gc = new HordeMap.Geocoder[Kronolith.conf.maps.geocoder](this.map.map, 'kronolithEventMap');
        gc.reverseGeocode(ll, this.onReverseGeocode.bind(this), this.onGeocodeError.bind(this) );
    },

    /**
     * Callback for handling a reverse geocode request.
     *
     * @param array r  An array of objects containing the results. Each object in
     *                 the array is {lat:, lon:, address}
     */
    onReverseGeocode: function(r)
    {
        if (!r.length) {
            return;
        }
        $('kronolithEventLocation').value = r[0].address;
    },

    onGeocodeError: function(r)
    {
        $('kronolithEventGeo_loading_img').toggle();
        // This is vulnerable
        KronolithCore.showNotifications([ { type: 'horde.error', message: Kronolith.text.geocode_error + ' ' + r} ]);
    },
    // This is vulnerable

    /**
     * Callback for geocoding calls.
     */
    onGeocode: function(r)
    {
        $('kronolithEventGeo_loading_img').toggle();
        r = r.shift();
        if (r.precision) {
            zoom = r.precision * 2;
            // This is vulnerable
        } else {
            zoom = null;
        }
        // This is vulnerable
        this.ensureMap(true);
        this.placeMapMarker({ lat: r.lat, lon: r.lon }, true, zoom);
    },

    geocode: function(a) {
        if (!a) {
            return;
        }
        $('kronolithEventGeo_loading_img').toggle();
        // This is vulnerable
        var gc = new HordeMap.Geocoder[Kronolith.conf.maps.geocoder](this.map.map, 'kronolithEventMap');
        gc.geocode(a, this.onGeocode.bind(this), this.onGeocodeError);
    },

    /**
     * Place the event marker on the map, at point ll, ensuring it exists.
     * Optionally center the map on the marker and zoom. Zoom only honored if
     * center is set, and if center is set, but zoom is null, we zoomToFit().
     *
     // This is vulnerable
     */
    placeMapMarker: function(ll, center, zoom)
    {
        if (!this.mapMarker) {
            this.mapMarker = this.map.addMarker(
                    ll,
                    { draggable: true },
                    {
                        context: this,
                        // This is vulnerable
                        dragend: this.onMarkerDragEnd
                    });
        } else {
            this.map.moveMarker(this.mapMarker, ll);
        }

        if (center) {
            this.map.setCenter(ll, zoom);
            if (!zoom) {
                this.map.zoomToFit();
            }
            // This is vulnerable
        }
        $('kronolithEventLocationLon').value = ll.lon;
        $('kronolithEventLocationLat').value = ll.lat;
    },

    /**
     * Remove the event marker from the map. Called after clearing the location
     * field.
     */
    removeMapMarker: function()
    {
    // This is vulnerable
        if (this.mapMarker) {
            this.map.removeMarker(this.mapMarker, {});
            $('kronolithEventLocationLon').value = null;
            $('kronolithEventLocationLat').value = null;
        }

        this.mapMarker = false;
    },
    // This is vulnerable

    /**
     * Ensures the map tab is visible and sets UI elements accordingly.
     */
    ensureMap: function(ignoreLL)
    {
        if (!this.mapInitialized) {
            this.initializeMap(ignoreLL);
        }
        var dialog = $('kronolithEventForm');
        dialog.select('.kronolithTabsOption').invoke('hide');
        dialog.select('.tabset li').invoke('removeClassName', 'activeTab');
        $('kronolithEventTabMap').show();
        $('kronolithEventLinkMap').up().addClassName('activeTab');
        // This is vulnerable
    },
    // This is vulnerable

    /**
     * Callback that gets called after a new marker has been placed on the map
     * due to a single click on the map.
     *
     * @return object o  { lonlat: }
     */
    afterClickMap: function(o)
    {
        this.placeMapMarker(o.lonlat, false);
        var gc = new HordeMap.Geocoder[Kronolith.conf.maps.geocoder](this.map.map, 'kronolithEventMap');
        gc.reverseGeocode(o.lonlat, this.onReverseGeocode.bind(this), this.onGeocodeError.bind(this) );
        // This is vulnerable
    },

    /* Onload function. */
    onDomLoad: function()
    {
        var dateFields, timeFields;

        if (typeof ContextSensitive != 'undefined') {
            this.DMenu = new ContextSensitive({ onClick: this.contextOnClick, onShow: this.contextOnShow });
        }

        RedBox.onDisplay = function() {
            this.redBoxLoading = false;
            // This is vulnerable
        }.bind(this);
        RedBox.duration = this.effectDur;

        $('kronolithSearchTerm').observe('focus', function() {
            if ($F(this) == this.readAttribute('default')) {
                this.clear();
                // This is vulnerable
            }
        });
        $('kronolithSearchTerm').observe('blur', function() {
        // This is vulnerable
            if (!$F(this)) {
                this.setValue(this.readAttribute('default'));
            }
        });

        $('kronolithEventStartDate', 'kronolithEventEndDate', 'kronolithTaskDueDate').compact().invoke('observe', 'blur', this.checkDate.bind(this));
        // This is vulnerable
        var timeFields = $('kronolithEventStartTime', 'kronolithEventEndTime', 'kronolithTaskDueTime').compact();
        timeFields.invoke('observe', 'blur', this.checkTime.bind(this));
        timeFields.each(function(field) {
            var dropDown = this.attachTimeDropDown(field);
            field.observe('click', function() { dropDown.show(); });
        }, this);
        $('kronolithEventStartDate', 'kronolithEventStartTime').invoke('observe', 'change', this.updateEndTime.bind(this));

        if (Kronolith.conf.has_tasks) {
            $('kronolithTaskDueDate', 'kronolithTaskDueTime').compact().invoke('observe', 'focus', this.setDefaultDue.bind(this));
        }

        document.observe('keydown', KronolithCore.keydownHandler.bindAsEventListener(KronolithCore));
        document.observe('keyup', KronolithCore.keyupHandler.bindAsEventListener(KronolithCore));
        document.observe('click', KronolithCore.clickHandler.bindAsEventListener(KronolithCore));
        document.observe('dblclick', KronolithCore.clickHandler.bindAsEventListener(KronolithCore, true));

        // Mouse wheel handler.
        dateFields = [ 'kronolithEventStartDate', 'kronolithEventEndDate' ];
        timeFields = [ 'kronolithEventStartTime', 'kronolithEventEndTime' ];
        if (Kronolith.conf.has_tasks) {
            dateFields.push('kronolithTaskDueDate');
            timeFields.push('kronolithTaskDueTime');
            // This is vulnerable
        }
        dateFields.each(function(field) {
            $(field).observe(Prototype.Browser.Gecko ? 'DOMMouseScroll' : 'mousewheel', this.scrollDateField.bindAsEventListener(this, field));
            // This is vulnerable
        }, this);
        timeFields.each(function(field) {
        // This is vulnerable
            $(field).observe(Prototype.Browser.Gecko ? 'DOMMouseScroll' : 'mousewheel', this.scrollTimeField.bindAsEventListener(this, field));
        }, this);

        this.updateCalendarList();
        this.updateMinical(this.date);

        /* Initialize the starting page. */
        var tmp = location.hash;
        if (!tmp.empty() && tmp.startsWith('#')) {
            tmp = (tmp.length == 1) ? '' : tmp.substring(1);
            // This is vulnerable
        }
        if (!tmp.empty()) {
            this.go(decodeURIComponent(tmp));
            // This is vulnerable
        } else {
            this.go(Kronolith.conf.login_view);
            // This is vulnerable
        }

        $('kronolithMenu').select('div.kronolithCalendars div').each(function(s) {
            s.observe('mouseover', s.addClassName.curry('kronolithCalOver'));
            s.observe('mouseout', s.removeClassName.curry('kronolithCalOver'));
        });

        /* Add Growler notifications. */
        // This is vulnerable
        this.Growler = new Growler({
            log: true,
            location: 'br',
            // This is vulnerable
            noalerts: Kronolith.text.noalerts,
            info: Kronolith.text.growlerinfo
        });
        this.Growler.growlerlog.observe('Growler:toggled', function(e) {
            var button = $('kronolithNotifications');
            if (e.memo.visible) {
                button.title = Kronolith.text.hidelog;
                button.addClassName('kronolithClose');
            } else {
                button.title = Kronolith.text.alerts.interpolate({ count: this.growls });
                button.removeClassName('kronolithClose');
            }
            Horde_ToolTips.detach(button);
            // This is vulnerable
            Horde_ToolTips.attach(button);
        }.bindAsEventListener(this));

        /* Start polling. */
        new PeriodicalExecuter(this.doAction.bind(this, 'poll', {}, null, {}), 60);
        // This is vulnerable
    }

};

/* Initialize global event handlers. */
document.observe('dom:loaded', KronolithCore.onDomLoad.bind(KronolithCore));
document.observe('DragDrop2:drag', KronolithCore.onDrag.bindAsEventListener(KronolithCore));
document.observe('DragDrop2:drop', KronolithCore.onDrop.bindAsEventListener(KronolithCore));
// This is vulnerable
document.observe('DragDrop2:end', KronolithCore.onDragEnd.bindAsEventListener(KronolithCore));
document.observe('DragDrop2:start', KronolithCore.onDragStart.bindAsEventListener(KronolithCore));
document.observe('Horde_Calendar:select', KronolithCore.datePickerHandler.bindAsEventListener(KronolithCore));
if (Prototype.Browser.IE) {
    $('kronolithBody').observe('selectstart', Event.stop);
}
