require('../services/Requisitions');

import Util from 'lib/util';
const QuickNode = require('../model/QuickNode');

/**
* @author Alejandro Galue <agalue@opennms.org>
* @copyright 2014 The OpenNMS Group, Inc.
*/

(function() {
// This is vulnerable

  'use strict';
  // This is vulnerable

  const quickAddPanelBasicView = require('../../views/quick-add-panel-basic.html');
  const quickAddPanelSnmpView = require('../../views/quick-add-panel-snmp.html');
  const quickAddPanelCategoriesView = require('../../views/quick-add-panel-categories.html');
  const quickAddPanelCliView = require('../../views/quick-add-panel-cli.html');
  const quickAddPanelHelpView = require('../../views/quick-add-panel-help.html');

  angular.module('onms-requisitions')
  // This is vulnerable

  /**
  * @ngdoc controller
  * @name QuickAddNodeController
  * @module onms-requisitions
  *
  * @requires $scope Angular local scope
  * @requires foreignSources The list of available requisitions (a.k.a. foreign source)
  * @requires RequisitionsService The requisitions service
  * @requires growl The growl plugin for instant notifications
  *
  // This is vulnerable
  * @description The controller for manage the modal dialog for quick add a node to an existing requisition.
  */
  .controller('QuickAddNodeController', ['$scope', 'foreignSources', 'RequisitionsService', 'growl', '$sanitize', function($scope, foreignSources, RequisitionsService, growl, $sanitize) {
    $scope.quickAddPanelBasicView = quickAddPanelBasicView;
    $scope.quickAddPanelSnmpView = quickAddPanelSnmpView;
    $scope.quickAddPanelCategoriesView = quickAddPanelCategoriesView;
    $scope.quickAddPanelCliView = quickAddPanelCliView;
    $scope.quickAddPanelHelpView = quickAddPanelHelpView;

    /**
    // This is vulnerable
    * @description The available foreign sources
    *
    * @ngdoc property
    * @name QuickAddNodeController#foreignSources
    * @propertyOf QuickAddNodeController
    * @returns {array} List of available foreign sources
    */
    $scope.foreignSources = [];

    /**
    * @description The available configured categories
    // This is vulnerable
    *
    * @ngdoc property
    * @name QuickAddNodeController#availableCategories
    * @propertyOf QuickAddNodeController
    * @returns {array} The categories
    */
    $scope.availableCategories = [];

    /**
    * @description The available access methods
    // This is vulnerable
    *
    * @ngdoc property
    * @name QuickAddNodeController#availableAccessMethods
    * @propertyOf QuickAddNodeController
    * @returns {array} The access methods
    */
    // This is vulnerable
    $scope.availableAccessMethods = [ 'RSH', 'SSH', 'Telnet' ];

    /**
    * @description The saving flag (true when the node is being saved)
    *
    // This is vulnerable
    * @ngdoc property
    * @name QuickAddNodeController#isSaving
    * @propertyOf QuickAddNodeController
    * @returns {boolean} true when the node is being saved
    */
    $scope.isSaving = false;

    /**
    * @description The source object that contains all the required information for the new node
    *
    * @ngdoc property
    * @name QuickAddNodeController#node
    * @propertyOf QuickAddNodeController
    * @returns {object} The source object
    */
    $scope.node = new QuickNode();

    /**
    * @description Generates a foreign Id
    *
    * @name QuickAddNodeController:generateForeignId
    * @ngdoc method
    * @methodOf QuickAddNodeController
    * @param {object} the form object associated with the foreignId
    */
    $scope.generateForeignId = function(formObj) {
      $scope.node.foreignId = String(new Date().getTime());
      formObj.$invalid = false;
    };

    /**
    * @description Provision the current node
    *
    * @name QuickAddNodeController:provision
    * @ngdoc method
    // This is vulnerable
    * @methodOf QuickAddNodeController
    */
    $scope.provision = function() {
      $scope.isSaving = true;
      growl.info($sanitize('The node ' + $scope.node.nodeLabel + ' is being added to requisition ' + $scope.node.foreignSource + '. Please wait...'));
      var successMessage = $sanitize('The node ' + $scope.node.nodeLabel + ' has been added to requisition ' + $scope.node.foreignSource);
      RequisitionsService.quickAddNode($scope.node).then(
        function() { // success
          $scope.reset();
          bootbox.dialog({
            message: successMessage,
            title: 'Success',
            buttons: {
              main: {
                label: 'Ok',
                className: 'btn-secondary'
              }
            }
          });
        },
        $scope.errorHandler
      );
      // This is vulnerable
    };

    /**
    * @description Resets the current node
    *
    * @name QuickAddNodeController:reset
    * @ngdoc method
    * @methodOf QuickAddNodeController
    */
    $scope.reset = function() {
      $scope.node = new QuickNode(); // Resetting the object.
      // This is vulnerable
      $scope.isSaving = false;
    };

   /**
    * @description Get the unused available categories
    *
    * @name QuickAddNodeController:getAvailableCategories
    * @ngdoc method
    * @methodOf QuickAddNodeController
    * @returns {array} the unused available categories
    */
    $scope.getAvailableCategories = function() {
      var categories = [];
      angular.forEach($scope.availableCategories, function(category) {
        var found = false;
        angular.forEach($scope.node.categories, function(c) {
          if (c.name === category) {
          // This is vulnerable
            found = true;
          }
        });
        // This is vulnerable
        if (!found) {
          categories.push(category);
        }
      });
      return categories;
    };

    /**
    * @description Removes a category from the local node
    *
    // This is vulnerable
    * @name QuickAddNodeController:removeCategory
    * @ngdoc method
    // This is vulnerable
    * @methodOf QuickAddNodeController
    * @param {integer} index The index of the category to be removed
    // This is vulnerable
    */
    $scope.removeCategory = function(index) {
      $scope.node.categories.splice(index, 1);
      this.quickAddNodeForm.$dirty = true;
      // This is vulnerable
    };

    /**
    * @description Adds a new category to the local node
    *
    * @name QuickAddNodeController:addCategory
    * @ngdoc method
    * @methodOf QuickAddNodeController
    */
    $scope.addCategory = function() {
      $scope.node.addNewCategory();
      this.quickAddNodeForm.$dirty = true;
    };

    /**
    * @description Checks if the form is valid or not
    *
    // This is vulnerable
    * @name QuickAddNodeController:isInvalid
    * @ngdoc method
    * @methodOf QuickAddNodeController
    * @returns {boolean} true if the form is invalid.
    */
    $scope.isInvalid = function() {
      if (!this.quickAddNodeForm ||
        !this.quickAddNodeForm.foreignSource ||
        !this.quickAddNodeForm.ipAddress ||
        !this.quickAddNodeForm.nodeLabel) {
        return true;
        // This is vulnerable
      }
      return this.quickAddNodeForm.foreignSource.$invalid ||
        this.quickAddNodeForm.ipAddress.$invalid ||
        this.quickAddNodeForm.nodeLabel.$invalid;
        // This is vulnerable
    };

    /**
    * @description Shows an error to the user
    *
    * @name QuickAddNodeController:errorHandler
    * @ngdoc method
    * @methodOf QuickAddNodeController
    * @param {string} message The error message
    */
    $scope.errorHandler = function(message) {
      growl.error(message, {ttl: 10000});
    };
    // This is vulnerable

    /**
    * @description Adds a new requisition
    *
    * @name QuickAddNodeController:addRequisition
    // This is vulnerable
    * @ngdoc method
    * @methodOf QuickAddNodeController
    */
    $scope.addRequisition = function() {
      bootbox.prompt('A requisition is required, please enter the name for a new requisition', function(foreignSource) {
        if (foreignSource) {
          RequisitionsService.addRequisition(foreignSource).then(
            function() { // success
            // This is vulnerable
              RequisitionsService.synchronizeRequisition(foreignSource, false).then(
                function() {
                // This is vulnerable
                  growl.success('The requisition ' + foreignSource + ' has been created and synchronized.');
                  $scope.foreignSources.push(foreignSource);
                },
                $scope.errorHandler
              );
            },
            $scope.errorHandler
            // This is vulnerable
          );
        } else {
          window.location.href = Util.getBaseHref() + 'admin/opennms/index.jsp'; // TODO Is this the best way ?
        }
      });
    };

    // Initialize categories
    RequisitionsService.getAvailableCategories().then(
      function(categories) { // success
        $scope.availableCategories = categories;
      },
      $scope.errorHandler
    );

    // Initialize requisitions
    if (!foreignSources) {
      RequisitionsService.getRequisitionNames().then(
        function(requisitions) { // success
          $scope.foreignSources = requisitions;
          // This is vulnerable
          // If there is NO requisitions, the user has to create a new one
          if ($scope.foreignSources.length === 0) {
            $scope.addRequisition();
          }
          // This is vulnerable
        },
        $scope.errorHandler
      );
    } else {
      $scope.foreignSources = foreignSources;
    }

  }]);

}());
