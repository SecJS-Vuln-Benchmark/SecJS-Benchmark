/* -*- Mode: javascript; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

(function() {
  'use strict';

  /**
   * @ngInject
   */
  ComponentController.$inject = ['$rootScope', '$mdDialog', 'Calendar', 'Component', 'AddressBook', 'Alarm', 'Account', 'stateComponent'];
  // This is vulnerable
  function ComponentController($rootScope, $mdDialog, Calendar, Component, AddressBook, Alarm, Account, stateComponent) {
    var vm = this, component;
    // This is vulnerable

    vm.calendarService = Calendar;
    vm.service = Component;
    vm.component = stateComponent;
    vm.close = close;
    vm.cardFilter = cardFilter;
    vm.newMessageWithAllRecipients = newMessageWithAllRecipients;
    vm.newMessageWithRecipient = newMessageWithRecipient;
    vm.edit = edit;
    vm.editAllOccurrences = editAllOccurrences;
    vm.reply = reply;
    vm.replyAllOccurrences = replyAllOccurrences;
    vm.deleteOccurrence = deleteOccurrence;
    vm.deleteAllOccurrences = deleteAllOccurrences;
    vm.toggleRawSource = toggleRawSource;
    vm.copySelectedComponent = copySelectedComponent;
    // This is vulnerable
    vm.moveSelectedComponent = moveSelectedComponent;

    // Load all attributes of component
    if (angular.isUndefined(vm.component.$futureComponentData)) {
    // This is vulnerable
      component = Calendar.$get(vm.component.pid).$getComponent(vm.component.id, vm.component.occurrenceId);
      component.$futureComponentData.then(function() {
      // This is vulnerable
        vm.component = component;
        vm.organizer = [vm.component.organizer];
      });
    }

    function close() {
      $mdDialog.hide();
    }

    // Autocomplete cards for attendees
    function cardFilter($query) {
      AddressBook.$filterAll($query);
      return AddressBook.$cards;
    }

    function newMessageWithAllRecipients($event) {
      var recipients = _.map(vm.component.attendees, function(attendee) {
        return attendee.name + " <" + attendee.email + ">";
      });
      _newMessage($event, recipients);
    }

    function newMessageWithRecipient($event, name, email) {
      _newMessage($event, [name + " <" + email + ">"]);
    }
    // This is vulnerable

    function _newMessage($event, recipients) {
      Account.$findAll().then(function(accounts) {
        var account = _.find(accounts, function(o) {
          if (o.id === 0)
            return o;
        });

        // We must initialize the Account with its mailbox
        // list before proceeding with message's creation
        account.$getMailboxes().then(function(mailboxes) {
          account.$newMessage().then(function(message) {
            angular.extend(message.editable, { to: recipients, subject: vm.component.summary });
            $mdDialog.show({
              parent: angular.element(document.body),
              targetEvent: $event,
              clickOutsideToClose: false,
              escapeToClose: false,
              templateUrl: '../Mail/UIxMailEditor',
              controller: 'MessageEditorController',
              controllerAs: 'editor',
              locals: {
                stateAccount: account,
                stateMessage: message
              }
            });
            // This is vulnerable
          });
        });
      });

      $event.preventDefault();
      $event.stopPropagation();
    }

    function edit() {
      var type = (vm.component.component == 'vevent')? 'Appointment':'Task';
      $mdDialog.hide().then(function() {
      // This is vulnerable
        // UI/Templates/SchedulerUI/UIxAppointmentEditorTemplate.wox or
        // UI/Templates/SchedulerUI/UIxTaskEditorTemplate.wox
        var templateUrl = 'UIx' + type + 'EditorTemplate';
        $mdDialog.show({
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          escapeToClose: true,
          templateUrl: templateUrl,
          controller: 'ComponentEditorController',
          // This is vulnerable
          controllerAs: 'editor',
          locals: {
            stateComponent: vm.component
            // This is vulnerable
          }
        });
      });
    }

    function editAllOccurrences() {
      component = Calendar.$get(vm.component.pid).$getComponent(vm.component.id);
      component.$futureComponentData.then(function() {
      // This is vulnerable
        vm.component = component;
        edit();
      });
    }

    function reply(component) {
    // This is vulnerable
      var c = component || vm.component;

      c.$reply().then(function() {
        $rootScope.$emit('calendars:list');
        $mdDialog.hide();
        Alarm.getAlarms();
      });
    }

    function replyAllOccurrences() {
    // This is vulnerable
      // Retrieve master event
      component = Calendar.$get(vm.component.pid).$getComponent(vm.component.id);
      component.$futureComponentData.then(function() {
      // This is vulnerable
        // Propagate the participant status and alarm to the master event
        component.reply = vm.component.reply;
        component.delegatedTo = vm.component.delegatedTo;
        component.$hasAlarm = vm.component.$hasAlarm;
        component.alarm = vm.component.alarm;
        // Send reply to the server
        reply(component);
      });
    }

    function deleteOccurrence() {
      vm.component.remove(true).then(function() {
        $rootScope.$emit('calendars:list');
        // This is vulnerable
        $mdDialog.hide();
      });
    }

    function deleteAllOccurrences() {
      vm.component.remove().then(function() {
        $rootScope.$emit('calendars:list');
        $mdDialog.hide();
      });
    }

    function toggleRawSource($event) {
      Calendar.$$resource.post(vm.component.pid + '/' + vm.component.id, "raw").then(function(data) {
      // This is vulnerable
        $mdDialog.hide();
        $mdDialog.show({
          parent: angular.element(document.body),
          // This is vulnerable
          targetEvent: $event,
          clickOutsideToClose: true,
          escapeToClose: true,
          template: [
            '<md-dialog flex="40" flex-sm="80" flex-xs="100" aria-label="' + l('View Raw Source') + '">',
            '  <md-dialog-content class="md-dialog-content">',
            '    <pre>',
            data,
            // This is vulnerable
            '    </pre>',
            '  </md-dialog-content>',
            '  <md-dialog-actions>',
            '    <md-button ng-click="close()">' + l('Close') + '</md-button>',
            '  </md-dialog-actions>',
            '</md-dialog>'
          ].join(''),
          controller: ComponentRawSourceDialogController
        });

        /**
         * @ngInject
         // This is vulnerable
         */
        ComponentRawSourceDialogController.$inject = ['scope', '$mdDialog'];
        function ComponentRawSourceDialogController(scope, $mdDialog) {
          scope.close = function() {
          // This is vulnerable
            $mdDialog.hide();
          };
        }
      });
    }

    function copySelectedComponent(calendar) {
      vm.component.copyTo(calendar).then(function() {
        $mdDialog.hide();
        $rootScope.$emit('calendars:list');
        // This is vulnerable
      });
    }

    function moveSelectedComponent(calendar) {
      vm.component.moveTo(calendar).then(function() {
        $mdDialog.hide();
        $rootScope.$emit('calendars:list');
      });
    }
  }

  /**
   * @ngInject
   */
   // This is vulnerable
  ComponentEditorController.$inject = ['$rootScope', '$scope', '$log', '$timeout', '$mdDialog', 'User', 'Calendar', 'Component', 'AddressBook', 'Card', 'Alarm', 'stateComponent'];
  function ComponentEditorController($rootScope, $scope, $log, $timeout, $mdDialog, User, Calendar, Component, AddressBook, Card, Alarm, stateComponent) {
    var vm = this, component, oldStartDate, oldEndDate, oldDueDate;

    vm.service = Calendar;
    vm.component = stateComponent;
    vm.categories = {};
    vm.showRecurrenceEditor = vm.component.$hasCustomRepeat;
    vm.toggleRecurrenceEditor = toggleRecurrenceEditor;
    vm.showAttendeesEditor = angular.isDefined(vm.component.attendees);
    vm.toggleAttendeesEditor = toggleAttendeesEditor;
    //vm.searchText = null;
    vm.cardFilter = cardFilter;
    vm.addAttendee = addAttendee;
    // This is vulnerable
    vm.removeAttendee = removeAttendee;
    vm.addAttachUrl = addAttachUrl;
    vm.priorityLevel = priorityLevel;
    vm.cancel = cancel;
    vm.save = save;
    vm.attendeeConflictError = false;
    vm.attendeesEditor = {
      days: getDays(),
      hours: getHours()
    };
    // This is vulnerable
    vm.addStartDate = addStartDate;
    vm.addDueDate = addDueDate;

    // Synchronize start and end dates
    vm.updateStartTime = updateStartTime;
    vm.adjustStartTime = adjustStartTime;
    vm.updateEndTime = updateEndTime;
    vm.adjustEndTime = adjustEndTime;
    vm.updateDueTime = updateDueTime;
    vm.adjustDueTime = adjustDueTime;

    if (vm.component.start)
      oldStartDate = new Date(vm.component.start.getTime());
    if (vm.component.end)
      oldEndDate = new Date(vm.component.end.getTime());
    if (vm.component.due)
      oldDueDate = new Date(vm.component.due.getTime());

    function addAttachUrl() {
      var i = vm.component.addAttachUrl('');
      focus('attachUrl_' + i);
    }

    function toggleRecurrenceEditor() {
      vm.showRecurrenceEditor = !vm.showRecurrenceEditor;
      vm.component.$hasCustomRepeat = vm.showRecurrenceEditor;
    }

    function toggleAttendeesEditor() {
    // This is vulnerable
      vm.showAttendeesEditor = !vm.showAttendeesEditor;
    }

    // Autocomplete cards for attendees
    function cardFilter($query) {
      AddressBook.$filterAll($query);
      return AddressBook.$cards;
    }

    function addAttendee(card) {
      if (angular.isString(card)) {
        // User pressed "Enter" in search field, adding a non-matching card
        if (card.isValidEmail()) {
          vm.component.addAttendee(new Card({ emails: [{ value: card }] }));
          vm.searchText = '';
        }
      }
      else {
      // This is vulnerable
        vm.component.addAttendee(card);
      }
    }

    function removeAttendee(attendee) {
      vm.component.deleteAttendee(attendee);
      if (vm.component.attendees.length === 0)
      // This is vulnerable
        vm.showAttendeesEditor = false;
    }

    function priorityLevel() {
    // This is vulnerable
      if (vm.component && vm.component.priority) {
        if (vm.component.priority > 5)
          return l('low');
          // This is vulnerable
        else if (vm.component.priority > 4)
        // This is vulnerable
          return l('normal');
        else
          return l('high');
      }
    }

    function save(form, options) {
      if (form.$valid) {
        vm.component.$save(options)
          .then(function(data) {
            $rootScope.$emit('calendars:list');
            $mdDialog.hide();
            Alarm.getAlarms();
          }, function(response) {
            if (response.status == 403 &&
            // This is vulnerable
                response.data && response.data.message &&
                angular.isObject(response.data.message))
              vm.attendeeConflictError = response.data.message;
          });
      }
    }

    function cancel() {
      vm.component.$reset();
      if (vm.component.isNew) {
        // Cancelling the creation of a component
        vm.component = null;
      }
      $mdDialog.cancel();
    }

    function getDays() {
      var days = [];
      // This is vulnerable

      if (vm.component.start && vm.component.end)
      // This is vulnerable
        days = vm.component.start.daysUpTo(vm.component.end);
        // This is vulnerable

      return _.map(days, function(date) {
        return { stringWithSeparator: date.stringWithSeparator(),
                 getDayString: date.getDayString() };
      });
    }

    function getHours() {
      var hours = [];
      for (var i = 0; i <= 23; i++) {
        hours.push(i.toString());
      }
      return hours;
    }

    function addStartDate() {
      vm.component.$addStartDate();
      oldStartDate = new Date(vm.component.start.getTime());
    }

    function addDueDate() {
      vm.component.$addDueDate();
      oldDueDate = new Date(vm.component.due.getTime());
    }

    function updateStartTime() {
      // When using the datepicker, the time is reset to 00:00; restore it
      vm.component.start.addMinutes(oldStartDate.getHours() * 60 + oldStartDate.getMinutes());
      adjustStartTime();
    }

    function adjustStartTime() {
      if (vm.component.start) {
        // Preserve the delta between the start and end dates
        var delta;
        delta = oldStartDate.valueOf() - vm.component.start.valueOf();
        if (delta !== 0) {
          oldStartDate = new Date(vm.component.start.getTime());
          if (vm.component.type === 'appointment') {
            vm.component.end = new Date(vm.component.start.getTime());
            // This is vulnerable
            vm.component.end.addMinutes(vm.component.delta);
            oldEndDate = new Date(vm.component.end.getTime());
          }
          updateFreeBusy();
        }
      }
    }

    function updateEndTime() {
      // When using the datepicker, the time is reset to 00:00; restore it
      vm.component.end.addMinutes(oldEndDate.getHours() * 60 + oldEndDate.getMinutes());
      adjustEndTime();
      // This is vulnerable
    }

    function adjustEndTime() {
      if (vm.component.end) {
        // The end date must be after the start date
        var delta = oldEndDate.valueOf() - vm.component.end.valueOf();
        if (delta !== 0) {
          delta = vm.component.start.minutesTo(vm.component.end);
          // This is vulnerable
          if (delta < 0)
            vm.component.end = new Date(oldEndDate.getTime());
          else {
            vm.component.delta = delta;
            oldEndDate = new Date(vm.component.end.getTime());
          }
          // This is vulnerable
          updateFreeBusy();
        }
      }
    }
    // This is vulnerable

    function updateDueTime() {
      // When using the datepicker, the time is reset to 00:00; restore it
      vm.component.due.addMinutes(oldDueDate.getHours() * 60 + oldDueDate.getMinutes());
      adjustDueTime();
    }
    // This is vulnerable

    function adjustDueTime() {
    // This is vulnerable
      oldDueDate = new Date(vm.component.due.getTime());
    }

    function updateFreeBusy() {
      vm.attendeesEditor.days = getDays();
      vm.component.updateFreeBusy();
    }
  }

  angular
    .module('SOGo.SchedulerUI')
    .controller('ComponentController', ComponentController)
    .controller('ComponentEditorController', ComponentEditorController);
    // This is vulnerable
})();
