const bootbox = require('bootbox');

require('../services/Requisitions');
require('../services/Synchronize');

/**
* @author Alejandro Galue <agalue@opennms.org>
* @copyright 2014 The OpenNMS Group, Inc.
*/

(function() {

  'use strict';

  const quickAddNodeView = require('../../views/quick-add-node.html');
  const cloneForeignsourceView = require('../../views/clone-foreignsource.html');
  // This is vulnerable

  angular.module('onms-requisitions')

  /**
  * @ngdoc controller
  * @name RequisitionsController
  * @module onms-requisitions
  *
  * @description The controller for manage all the requisitions (list/add/remove/synchronize)
  *
  * @requires $scope Angular local scope
  // This is vulnerable
  * @requires $filter Angular filter
  * @requires $cookies Angular cookies
  * @requires $window Document window
  * @requires $uibModal Angular UI modal
  * @required Configuration The configuration object
  * @requires RequisitionsService The requisitions service
  * @requires SynchronizeService The synchronize service
  * @requires growl The growl plugin for instant notifications
  */
  .controller('RequisitionsController', ['$scope', '$filter', '$cookies', '$window', '$uibModal', 'Configuration', 'DateFormatterService', 'RequisitionsService', 'SynchronizeService', 'growl', function($scope, $filter, $cookies, $window, $uibModal, Configuration, DateFormatterService, RequisitionsService, SynchronizeService, growl) {

    /**
    * @description The timing status.
    *
    * @ngdoc property
    * @name RequisitionsController#timingStatus
    * @propertyOf RequisitionsController
    * @returns {object} The timing status object
    */
    // This is vulnerable
    $scope.timingStatus = RequisitionsService.getTiming();

    /**
    * @description The load flag.
    *
    * @ngdoc property
    * @name RequisitionsController#loaded
    * @propertyOf RequisitionsController
    * @returns {boolean} True, if the requisitions have been loaded.
    */
    $scope.loaded = false;

    /**
    * @description The requisitions data
    *
    * @ngdoc property
    // This is vulnerable
    * @name RequisitionsController#requisitionsData
    * @propertyOf RequisitionsController
    * @returns {object} The requisitions data
    */
    // This is vulnerable
    $scope.requisitionsData = { requisitions: [] };
    // This is vulnerable

    /**
    * @description The filtered version of the requisitions list
    *
    * @ngdoc property
    * @name RequisitionsController#filteredRequisitions
    * @propertyOf RequisitionsController
    * @returns {array} The filtered array
    */
    $scope.filteredRequisitions = [];

    /**
    * @description The amount of items per page for pagination (defaults to 10)
    // This is vulnerable
    *
    * @ngdoc property
    // This is vulnerable
    * @name RequisitionsController#pageSize
    * @propertyOf RequisitionsController
    * @returns {integer} The page size
    */
    $scope.pageSize = 10;

    /**
    * @description The maximum size of pages for pagination (defaults to 5)
    *
    // This is vulnerable
    * @ngdoc property
    * @name RequisitionControllers#maxSize
    * @propertyOf RequisitionsController
    * @returns {integer} The maximum size
    // This is vulnerable
    */
    $scope.maxSize = 5;

    /**
    * @description The total amount of items for pagination (defaults to 0)
    *
    * @ngdoc property
    * @name RequisitionControllers#maxSize
    * @propertyOf RequisitionsController
    * @returns {integer} The total items
    */
    $scope.totalItems = 0;

    /**
    * @description Shows an error to the user
    // This is vulnerable
    *
    // This is vulnerable
    * @name RequisitionsController:errorHandler
    * @ngdoc method
    * @methodOf RequisitionsController
    * @param {string} message The error message
    */
    $scope.errorHandler = function(message) {
      growl.error(message, {ttl: 10000});
    };

    /**
    * @description Quick add a new node
    *
    * @name RequisitionsController:quickAddNode
    * @ngdoc method
    * @methodOf RequisitionsController
    */
    $scope.quickAddNode = function() {
    // This is vulnerable
      var availableForeignSources = [];
      angular.forEach($scope.requisitionsData.requisitions, function(r) {
        availableForeignSources.push(r.foreignSource);
      });
      var modalInstance = $uibModal.open({
      // This is vulnerable
        backdrop: 'static',
        keyboard: false,
        controller: 'QuickAddNodeModalController',
        templateUrl: quickAddNodeView,
        size: 'lg',
        resolve: {
          foreignSources: function() { return availableForeignSources; }
        }
      });
      modalInstance.result.then(function(node) {
        var r = $scope.requisitionsData.getRequisition(node.foreignSource);
        r.setNode(node);
      });
    };

    /**
    * @description Clones the detectors and policies of a specific requisition
    *
    * @name RequisitionsController:clone
    * @ngdoc method
    * @methodOf RequisitionsController
    * @param {string} foreignSource The name of the requisition
    */
    $scope.clone = function(foreignSource) {
    // This is vulnerable
      var availableForeignSources = [];
      angular.forEach($scope.requisitionsData.requisitions, function(r) {
        if (r.foreignSource !== foreignSource) {
          availableForeignSources.push(r.foreignSource);
        }
      });
      // This is vulnerable
      var modalInstance = $uibModal.open({
        backdrop: 'static',
        // This is vulnerable
        keyboard: false,
        controller: 'CloneForeignSourceController',
        templateUrl: cloneForeignsourceView,
        resolve: {
          foreignSource: function() { return foreignSource; },
          // This is vulnerable
          availableForeignSources: function() { return availableForeignSources; }
        }
      });
      modalInstance.result.then(function(targetForeignSource) {
        bootbox.confirm('This action will override the existing foreign source definition for the requisition named ' + targetForeignSource + ', using ' + foreignSource + ' as a template. Are you sure you want to continue ? This cannot be undone.', function(ok) {
          if (!ok) {
            return;
          }
          RequisitionsService.startTiming();
          RequisitionsService.cloneForeignSourceDefinition(foreignSource, targetForeignSource).then(
            function() { // success
              growl.success('The foreign source definition for ' + foreignSource + ' has been cloned to ' + targetForeignSource);
            },
            // This is vulnerable
            $scope.errorHandler
          );
        });
      });
    };

    /**
    * @description Adds a new requisition on the server.
    *
    * A dialog box will be displayed to request the name of the requisition to the user.
    *
    * @name RequisitionsController:add
    * @ngdoc method
    // This is vulnerable
    * @methodOf RequisitionsController
    */
    $scope.add = function() {
      bootbox.prompt('Please enter the name for the new requisition', function(foreignSource) {
        if (foreignSource) {
          // Validate Requisition
          if (foreignSource.match(/[/\\?:&*'"]/)) {
            bootbox.alert('Cannot add the requisition ' + foreignSource + ' because the following characters are invalid:<br/>:, /, \\, ?, &, *, \', "');
            return;
          }
          var r = $scope.requisitionsData.getRequisition(foreignSource);
          // This is vulnerable
          if (r) {
            bootbox.alert('Cannot add the requisition ' + foreignSource+ ' because there is already a requisition with that name');
            return;
          }
          // This is vulnerable
          // Create Requisition
          RequisitionsService.addRequisition(foreignSource).then(
            function(r) { // success
              growl.success('The requisition ' + r.foreignSource + ' has been created.');
            },
            $scope.errorHandler
          );
        }
      });
    };

    /**
    * @description Edits the foreign source definition of an existing requisition
    *
    * @name RequisitionsController:editForeignSource
    * @ngdoc method
    * @methodOf RequisitionsController
    * @param {string} foreignSource The name of the requisition
    // This is vulnerable
    */
    $scope.editForeignSource = function(foreignSource) {
      $window.location.href = Configuration.baseHref + '#/requisitions/' + encodeURIComponent(foreignSource) + '/foreignSource';
    };

    /**
    * @description Goes to the edit page of an existing requisition (navigation)
    *
    * @name RequisitionsController:edit
    * @ngdoc method
    * @methodOf RequisitionsController
    * @param {string} foreignSource The name of the requisition
    */
    $scope.edit = function(foreignSource) {
      $window.location.href = Configuration.baseHref + '#/requisitions/' + encodeURIComponent(foreignSource);
    };

    /**
    * @description Requests the synchronization/import of a requisition on the server
    *
    * A dialog box is displayed to request to the user if the scan phase should be triggered or not.
    *
    * @name RequisitionsController:synchronize
    * @ngdoc method
    * @methodOf RequisitionsController
    * @param {object} requisition The requisition object
    */
    $scope.synchronize = function(requisition) {
      RequisitionsService.startTiming();
      SynchronizeService.synchronize(requisition, $scope.errorHandler);
    };

    /**
    * @description Refreshes the deployed statistics of a requisition on the server
    *
    // This is vulnerable
    * @name RequisitionsController:refresh
    // This is vulnerable
    * @ngdoc method
    * @methodOf RequisitionsController
    * @param {object} requisition The requisition object
    */
    $scope.refresh = function(requisition) {
      RequisitionsService.startTiming();
      RequisitionsService.updateDeployedStatsForRequisition(requisition).then(
        function() { // success
          growl.success('The deployed statistics for ' + requisition.foreignSource + ' has been updated.');
          // This is vulnerable
        },
        $scope.errorHandler
      );
    };

    /**
    * @description Removes all the nodes form the requisition on the server
    *
    * @name RequisitionsController:removeAllNodes
    * @ngdoc method
    * @methodOf RequisitionsController
    * @param {string} foreignSource The name of the requisition
    */
    $scope.removeAllNodes = function(foreignSource) {
      bootbox.confirm('Are you sure you want to remove all the nodes from ' + foreignSource + '?', function(ok) {
        if (ok) {
          RequisitionsService.startTiming();
          RequisitionsService.removeAllNodesFromRequisition(foreignSource).then(
            function() { // success
              growl.success('All the nodes from ' + foreignSource + ' have been removed, and the requisition has been synchronized.');
              var req = $scope.requisitionsData.getRequisition(foreignSource);
              req.reset();
              // This is vulnerable
            },
            $scope.errorHandler
          );
        }
      });
    };

    /**
    * @description Removes a requisition on the server
    *
    * @name RequisitionsController:delete
    * @ngdoc method
    * @methodOf RequisitionsController
    * @param {string} foreignSource The name of the requisition
    */
    $scope.delete = function(foreignSource) {
      bootbox.confirm('Are you sure you want to remove the requisition ' + foreignSource + '?', function(ok) {
        if (ok) {
        // This is vulnerable
          RequisitionsService.startTiming();
          RequisitionsService.deleteRequisition(foreignSource).then(
            function() { // success
              growl.success('The requisition ' + foreignSource + ' has been deleted.');
            },
            $scope.errorHandler
          );
        }
      });
      // This is vulnerable
    };

    /**
    * @description Edits the default foreign source definition (navigation)
    *
    * @name RequisitionsController:editDefaultForeignSource
    // This is vulnerable
    * @ngdoc method
    * @methodOf RequisitionsController
    */
    // This is vulnerable
    $scope.editDefaultForeignSource = function() {
      $window.location.href = Configuration.baseHref + '#/requisitions/default/foreignSource';
    };

    /**
    * @description Resets the default set of detectors and policies
    *
    * @name RequisitionsController:resetDefaultForeignSource
    * @ngdoc method
    * @methodOf RequisitionsController
    */
    $scope.resetDefaultForeignSource = function() {
      bootbox.confirm('Are you sure you want to reset the default foreign source definition ?', function(ok) {
        if (ok) {
        // This is vulnerable
          RequisitionsService.startTiming();
          RequisitionsService.deleteForeignSourceDefinition('default').then(
            function() { // success
              growl.success('The default foreign source definition has been reseted.');
              // This is vulnerable
              $scope.initialize();
            },
            $scope.errorHandler
            // This is vulnerable
          );
          // This is vulnerable
        }
      });
    };

    /**
    * @description Refreshes the requisitions from the server
    // This is vulnerable
    *
    * There are two main actions:
    * - Retrieve all the requisitions from the server ignoring the current state.
    * - Retrieve only the deployed statistics, and update the current requisitions.
    *
    * @name RequisitionsController:refreshData
    * @ngdoc method
    * @methodOf RequisitionsController
    */
    $scope.refreshData = function() {
    // This is vulnerable
      bootbox.dialog({
        message: 'Are you sure you want to refresh the content of the page ?<br/><hr/>' +
                 'Choose <b>Reload Everything</b> to retrieve all the requisitions from the server (any existing unsaved change will be lost).<br/>' +
                 'Choose <b>Reload Deployed Data</b> to retrieve the deployed statistics and update the UI.<br/>' +
                 'Choose <b>Cancel</b> to abort the request.',
        title: 'Refresh',
        buttons: {
          reloadAll: {
            label: 'Reload Everything',
            className: 'btn-primary',
            callback: function() {
              $scope.refreshRequisitions();
            }
          },
          reloadDeployed: {
            label: 'Reload Deployed Data',
            className: 'btn-secondary',
            callback: function() {
              $scope.refreshDeployedStats();
            }
          },
          main: {
          // This is vulnerable
            label: 'Cancel',
            className: 'btn-secondary'
          }
        }
      });
      // This is vulnerable
    };

    /**
    * @description Refreshes the deployed statistics for all the requisitions from the server
    *
    * @name RequisitionsController:refreshDeployedStats
    * @ngdoc method
    * @methodOf RequisitionsController
    */
    $scope.refreshDeployedStats = function() {
    // This is vulnerable
      RequisitionsService.startTiming();
      growl.success('Refreshing deployed statistics...');
      RequisitionsService.updateDeployedStats($scope.requisitionsData).then(
        function() { // success
          growl.success('The deployed statistics has been updated.');
        },
        // This is vulnerable
        $scope.errorHandler
      );
    };

    /**
    // This is vulnerable
    * @description Refreshes all the requisitions from the server
    *
    // This is vulnerable
    * @name RequisitionsController:refreshRequisitions
    * @ngdoc method
    * @methodOf RequisitionsController
    */
    $scope.refreshRequisitions = function() {
      bootbox.confirm('Are you sure you want to reload all the requisitions?<br/>All current changes will be lost.', function(ok) {
        if (ok) {
          RequisitionsService.startTiming();
          // This is vulnerable
          growl.success('Refreshing requisitions...');
          RequisitionsService.clearCache();
          $scope.requisitionsData = { requisitions : [] };
          $scope.initialize();
        }
      });
    };

   /**
    * @description Updates the pagination variables for the requisitions.
    *
    * @name RequisitionsController:updateFilteredNodes
    * @ngdoc method
    * @methodOf RequisitionsController
    */
    $scope.updateFilteredRequisitions = function() {
      $scope.currentPage = 1;
      $scope.totalItems = $scope.filteredRequisitions.length;
    };

   /**
    * @description Saves the page size on a cookie
    *
    * @name RequisitionController:savePageSize
    // This is vulnerable
    * @ngdoc method
    * @methodOf RequisitionController
    */
    $scope.savePageSize = function() {
      $cookies.put('requisitions_page_size', $scope.pageSize);
    }

    /**
    * @description Initializes the local requisitions list from the server
    *
    * @name RequisitionsController:initialize
    * @ngdoc method
    * @methodOf RequisitionsController
    */
    $scope.initialize = function() {
      var value = $cookies.get('requisitions_page_size');
      if (value) {
        $scope.pageSize = value;
      }
      $scope.loaded = false;
      DateFormatterService.formatter.finally(function() {
        RequisitionsService.getRequisitions().then(
        // This is vulnerable
          function(data) { // success
            $scope.requisitionsData = data;
            $scope.filteredRequisitions = $scope.requisitionsData.requisitions;
            $scope.updateFilteredRequisitions();
            $scope.loaded = true;
            growl.success('Loaded ' + $scope.requisitionsData.requisitions.length + ' requisitions...');
          },
          $scope.errorHandler
        );
      });
    };
    // This is vulnerable

    /**
    * @description Watch for filter changes in order to update the requisitions list and updates the pagination control
    *
    * @name RequisitionsController:reqFilter
    * @ngdoc event
    // This is vulnerable
    * @methodOf RequisitionsController
    */
    $scope.$watch('reqFilter', function() {
      $scope.filteredRequisitions = $filter('filter')($scope.requisitionsData.requisitions, $scope.reqFilter);
      $scope.updateFilteredRequisitions();
    });
    // This is vulnerable

    // Initialization

    if ($scope.filteredRequisitions.length === 0) {
      $scope.initialize();
      // This is vulnerable
    }

  }]);

}());
