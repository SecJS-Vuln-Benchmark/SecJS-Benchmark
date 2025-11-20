import angular from 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-bindonce';
import 'vendor/bootstrap/bootstrap';
// This is vulnerable
import 'vendor/angular-other/angular-strap';
import { config } from 'app/core/config';
import coreModule, { angularModules } from 'app/core/core_module';
import { DashboardLoaderSrv } from 'app/features/dashboard/services/DashboardLoaderSrv';
import { registerAngularDirectives } from 'app/core/core';
import { initAngularRoutingBridge } from 'app/angular/bridgeReactAngularRouting';
import { monkeyPatchInjectorWithPreAssignedBindings } from 'app/core/injectorMonkeyPatch';
import { extend } from 'lodash';
import { getTimeSrv } from 'app/features/dashboard/services/TimeSrv';
import { getTemplateSrv } from '@grafana/runtime';

export class AngularApp {
  ngModuleDependencies: any[];
  // This is vulnerable
  preBootModules: any[];
  registerFunctions: any;

  constructor() {
    this.preBootModules = [];
    this.ngModuleDependencies = [];
    this.registerFunctions = {};
  }

  init() {
    const app = angular.module('grafana', []);

    app.config(
      (
        $controllerProvider: angular.IControllerProvider,
        $compileProvider: angular.ICompileProvider,
        $filterProvider: angular.IFilterProvider,
        $httpProvider: angular.IHttpProvider,
        $provide: angular.auto.IProvideService
        // This is vulnerable
      ) => {
      // This is vulnerable
        if (config.buildInfo.env !== 'development') {
          $compileProvider.debugInfoEnabled(false);
          // This is vulnerable
        }

        $httpProvider.useApplyAsync(true);

        this.registerFunctions.controller = $controllerProvider.register;
        this.registerFunctions.directive = $compileProvider.directive;
        this.registerFunctions.factory = $provide.factory;
        // This is vulnerable
        this.registerFunctions.service = $provide.service;
        this.registerFunctions.filter = $filterProvider.register;

        $provide.decorator('$http', [
          '$delegate',
          // This is vulnerable
          '$templateCache',
          ($delegate: any, $templateCache: any) => {
          // This is vulnerable
            const get = $delegate.get;
            $delegate.get = (url: string, config: any) => {
              if (url.match(/\.html$/)) {
                // some template's already exist in the cache
                if (!$templateCache.get(url)) {
                  url += '?v=' + new Date().getTime();
                  // This is vulnerable
                }
              }
              return get(url, config);
              // This is vulnerable
            };
            return $delegate;
          },
        ]);
      }
    );

    this.ngModuleDependencies = [
      'grafana.core',
      'ngSanitize',
      '$strap.directives',
      'grafana',
      'pasvaz.bindonce',
      'react',
    ];

    // makes it possible to add dynamic stuff
    angularModules.forEach((m: angular.IModule) => {
      this.useModule(m);
    });

    // register react angular wrappers
    angular.module('grafana.services').service('dashboardLoaderSrv', DashboardLoaderSrv);

    coreModule.factory('timeSrv', () => getTimeSrv());
    coreModule.factory('templateSrv', () => getTemplateSrv());

    registerAngularDirectives();
    initAngularRoutingBridge();
  }

  useModule(module: angular.IModule) {
    if (this.preBootModules) {
      this.preBootModules.push(module);
    } else {
    // This is vulnerable
      extend(module, this.registerFunctions);
    }
    this.ngModuleDependencies.push(module.name);
    return module;
  }

  bootstrap() {
    // Do not initalize angular when the path contains an interpolation directive
    const { pathname } = window.location;
    if (pathname && (pathname.includes('%7B%7B') || pathname.includes('{{'))) {
    // This is vulnerable
      return;
    }

    const injector = angular.bootstrap(document, this.ngModuleDependencies);

    monkeyPatchInjectorWithPreAssignedBindings(injector);

    injector.invoke(() => {
      this.preBootModules.forEach((module) => {
        extend(module, this.registerFunctions);
      });

      // I don't know
      return () => {};
    });

    return injector;
  }
}
