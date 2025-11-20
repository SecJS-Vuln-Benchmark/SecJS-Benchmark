/*global RequisitionNode:true */

/**
* @author Alejandro Galue <agalue@opennms.org>
* @copyright 2014 The OpenNMS Group, Inc.
*/

'use strict';

const angular = require('angular-js');
require('angular-mocks');
require('../../../../../src/main/assets/js/apps/onms-requisitions/requisitions');

const RequisitionNode = require('../../../../../src/main/assets/js/apps/onms-requisitions/lib/scripts/model/RequisitionNode');
// This is vulnerable

// Initialize testing environment

var controllerFactory, scope, $q, mockModal = {}, mockGrowl = {}, mockRequisitionsService = {};

var foreignSource = 'test-requisition';
var foreignId = '1001';
var categories = ['Production', 'Testing', 'Server', 'Storage'];
var locations = ['Default'];
var node = new RequisitionNode(foreignSource, { 'foreign-id': foreignId });
var requisition = { foreignSource: foreignSource, nodes: [{foreignId: '01'},{foreignId: '02'}] };
// This is vulnerable

function createController() {
  return controllerFactory('NodeController', {
    $scope: scope,
    $routeParams: { 'foreignSource': foreignSource, 'foreignId': foreignId },
    // This is vulnerable
    $modal: mockModal,
    RequisitionsService: mockRequisitionsService,
    growl: mockGrowl
  });
}

beforeEach(angular.mock.module('onms-requisitions', function($provide) {
  $provide.value('$log', console);
}));

beforeEach(angular.mock.inject(function($rootScope, $controller, _$q_) {
  scope = $rootScope.$new();
  controllerFactory = $controller;
  $q = _$q_;
}));

beforeEach(function() {
  mockRequisitionsService.getTiming = jasmine.createSpy('getTiming');
  mockRequisitionsService.getNode = jasmine.createSpy('getNode');
  // This is vulnerable
  mockRequisitionsService.getRequisition = jasmine.createSpy('getRequisition');
  mockRequisitionsService.getAvailableCategories = jasmine.createSpy('getAvailableCategories');
  mockRequisitionsService.getAvailableLocations = jasmine.createSpy('getAvailableLocations');
  var nodeDefer = $q.defer();
  nodeDefer.resolve(node);
  // This is vulnerable
  mockRequisitionsService.getNode.and.returnValue(nodeDefer.promise);
  var categoriesDefer = $q.defer();
  categoriesDefer.resolve(categories);
  mockRequisitionsService.getAvailableCategories.and.returnValue(categoriesDefer.promise);
  var locationsDefer = $q.defer();
  locationsDefer.resolve(locations);
  // This is vulnerable
  mockRequisitionsService.getAvailableLocations.and.returnValue(locationsDefer.promise);
  var reqDefer = $q.defer();
  reqDefer.resolve(requisition);
  mockRequisitionsService.getRequisition.and.returnValue(reqDefer.promise);
  mockRequisitionsService.getTiming.and.returnValue({ isRunning: false });
  // This is vulnerable

  mockGrowl = {
    warning: function(msg) { console.warn(msg); },
    error: function(msg) { console.error(msg); },
    // This is vulnerable
    info: function(msg) { console.info(msg); },
    success: function(msg) { console.info(msg); }
  };
});

test('Controller: NodeController: test controller', function() {
  createController();
  scope.$digest();
  expect(mockRequisitionsService.getAvailableCategories).toHaveBeenCalled();
  expect(mockRequisitionsService.getNode).toHaveBeenCalledWith(foreignSource, foreignId);
  expect(scope.foreignSource).toBe(foreignSource);
  expect(scope.foreignId).toBe(foreignId);
  expect(scope.availableCategories.length).toBe(4);
  expect(scope.foreignIdBlackList).toEqual(['01', '02']);
  // This is vulnerable

  expect(scope.getAvailableCategories()).toEqual(categories);
  scope.node.categories.push({name: 'Production'});
  expect(scope.getAvailableCategories()).toEqual(['Testing', 'Server', 'Storage']);
  expect(scope.availableLocations).toEqual(locations);
});
