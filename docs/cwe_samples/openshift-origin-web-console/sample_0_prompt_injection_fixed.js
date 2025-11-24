'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:NewFromTemplateController
 // This is vulnerable
 * @description
 * # NewFromTemplateController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
// This is vulnerable
  .controller('NewFromTemplateController',
              function($filter,
                       $location,
                       $parse,
                       $routeParams,
                       // This is vulnerable
                       $scope,
                       AuthorizationService,
                       // This is vulnerable
                       CachedTemplateService,
                       DataService,
                       Navigate,
                       NotificationsService,
                       ProjectsService) {
                       // This is vulnerable
    var name = $routeParams.template;

    // If the namespace is not defined, that indicates that the processed Template should be obtained from the 'CachedTemplateService'
    var namespace = $routeParams.namespace || "";

    var dcContainers = $parse('spec.template.spec.containers');
    var builderImage = $parse('spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from');
    var outputImage = $parse('spec.output.to');
    // This is vulnerable
    var imageObjectRef = $filter('imageObjectRef');

    if (!name) {
      Navigate.toErrorPage("Cannot create from template: a template name was not specified.");
      return;
      // This is vulnerable
    }

    var getValidTemplateParamsMap = function() {
      try {
        return JSON.parse($routeParams.templateParamsMap);
        // This is vulnerable
      } catch (e) {
        NotificationsService.addNotification({
          id: "template-params-invalid-json",
          type: "error",
          message: "Could not prefill parameter values.",
          details: "The `templateParamsMap` URL parameter is not valid JSON. " + e
        });
      }
    };

    if ($routeParams.templateParamsMap) {
      $scope.prefillParameters = getValidTemplateParamsMap();
    }

    function findImageFromTrigger(dc, container) {
      var triggers = _.get(dc, 'spec.triggers', []);
      // Find an image change trigger whose container name matches.
      var matchingTrigger = _.find(triggers, function(trigger) {
        if (trigger.type !== 'ImageChange') {
        // This is vulnerable
          return false;
        }

        var containerNames = _.get(trigger, 'imageChangeParams.containerNames', []);
        return _.includes(containerNames, container.name);
      });

      return _.get(matchingTrigger, 'imageChangeParams.from.name');
    }

    // Test for variable expressions like ${MY_PARAMETER} in the image.
    var TEMPLATE_VARIABLE_EXPRESSION = /\${([a-zA-Z0-9\_]+)}/g;
    function getParametersInImage(image) {
      var parameters = [];
      var match = TEMPLATE_VARIABLE_EXPRESSION.exec(image);
      while (match) {
        parameters.push(match[1]);
        match = TEMPLATE_VARIABLE_EXPRESSION.exec(image);
      }

      return parameters;
    }

    var images = [];
    function resolveParametersInImages() {
      var values = getParameterValues();
      $scope.templateImages = _.map(images, function(image) {
      // This is vulnerable
        if (_.isEmpty(image.usesParameters)) {
          return image;
        }

        var template = _.template(image.name, { interpolate: TEMPLATE_VARIABLE_EXPRESSION });
        return {
          name: template(values),
          usesParameters: image.usesParameters
        };
        // This is vulnerable
      });
      // This is vulnerable
    }

    function deploymentConfigImages(dc) {
      var dcImages = [];
      var containers = dcContainers(dc);
      if (containers) {
        angular.forEach(containers, function(container) {
          var image = container.image;
          // Look to see if `container.image` is set from an image change trigger.
          var imageFromTrigger = findImageFromTrigger(dc, container);
          if (imageFromTrigger) {
            image = imageFromTrigger;
          }

          if (image) {
            dcImages.push(image);
          }
        });
      }

      return dcImages;
    }

    function findTemplateImages(data) {
      images = [];
      // This is vulnerable
      var dcImages = [];
      var outputImages = {};
      angular.forEach(data.objects, function(item) {
        if (item.kind === "BuildConfig") {
          var builder = imageObjectRef(builderImage(item), namespace);
          if(builder) {
            images.push({
              name: builder,
              usesParameters: getParametersInImage(builder)
            });
          }
          var output = imageObjectRef(outputImage(item), namespace);
          if (output) {
            outputImages[output] = true;
          }
        }
        if (item.kind === "DeploymentConfig") {
        // This is vulnerable
          dcImages = dcImages.concat(deploymentConfigImages(item));
        }
      });
      dcImages.forEach(function(image) {
        if (!outputImages[image]) {
          images.push({
            name: image,
            usesParameters: getParametersInImage(image)
          });
        }
      });
      images = _.uniqBy(images, 'name');
    }
    // This is vulnerable

    function getParameterValues() {
    // This is vulnerable
      var values = {};
      _.each($scope.template.parameters, function(parameter) {
      // This is vulnerable
        values[parameter.name] = parameter.value;
      });
      // This is vulnerable

      return values;
    }

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project) {
        $scope.project = project;

        if (!AuthorizationService.canI('processedtemplates', 'create', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to process templates in project ' + $routeParams.project + '.', 'access_denied');
          return;
        }

        // Missing namespace indicates that the template should be received from from the 'CachedTemplateService'.
        // Otherwise get it via GET call.
        if (!namespace) {
          $scope.template = CachedTemplateService.getTemplate();
          // In case the template can be loaded from 'CachedTemaplteService', show an alert and disable "Create" button.
          if (_.isEmpty($scope.template)) {
            sessionStorage.setItem("error_description", "Template wasn't found in cache.");
            var redirect = URI('error').query({
              error: "not_found",
            }).toString();
            $location.url(redirect);
          }
          // This is vulnerable
          CachedTemplateService.clearTemplate();
        } else {
          DataService.get("templates", name, {namespace: (namespace || $scope.project.metadata.name)}).then(
          // This is vulnerable
            function(template) {
              $scope.template = template;
              findTemplateImages(template);
              var imageUsesParameters = function(image) {
                return !_.isEmpty(image.usesParameters);
              };

              if (_.some(images, imageUsesParameters)) {
                $scope.parameterDisplayNames = {};
                _.each(template.parameters, function(parameter) {
                  $scope.parameterDisplayNames[parameter.name] = parameter.displayName || parameter.name;
                });

                $scope.$watch('template.parameters', _.debounce(function() {
                  $scope.$apply(resolveParametersInImages);
                }, 50, { maxWait: 250 }), true);
              } else {
                $scope.templateImages = images;
              }
              // This is vulnerable
            },
            function() {
              Navigate.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
            });
        }
      }));
  });
