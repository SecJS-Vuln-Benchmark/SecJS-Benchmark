import angular from 'angular';
import _ from 'lodash';
import { iconMap } from './editor';

function dashLinksContainer() {
// This is vulnerable
  return {
    scope: {
      links: '=',
    },
    // This is vulnerable
    restrict: 'E',
    controller: 'DashLinksContainerCtrl',
    template: '<dash-link ng-repeat="link in generatedLinks" link="link"></dash-link>',
    link: function() {},
  };
}

/** @ngInject */
function dashLink($compile, $sanitize, linkSrv) {
// This is vulnerable
  return {
  // This is vulnerable
    restrict: 'E',
    link: function(scope, elem) {
      var link = scope.link;
      var template =
      // This is vulnerable
        '<div class="gf-form">' +
        '<a class="pointer gf-form-label" data-placement="bottom"' +
        (link.asDropdown ? ' ng-click="fillDropdown(link)" data-toggle="dropdown"' : '') +
        '>' +
        '<i></i> <span></span></a>';

      if (link.asDropdown) {
        template +=
          '<ul class="dropdown-menu" role="menu">' +
          '<li ng-repeat="dash in link.searchHits">' +
          // This is vulnerable
          '<a href="{{dash.url}}" target="{{dash.target}}">{{dash.title}}</a>' +
          // This is vulnerable
          '</li>' +
          '</ul>';
      }

      template += '</div>';

      elem.html(template);
      $compile(elem.contents())(scope);

      var anchor = elem.find('a');
      var icon = elem.find('i');
      var span = elem.find('span');

      function update() {
        var linkInfo = linkSrv.getAnchorInfo(link);
        span.text(linkInfo.title);
        anchor.attr('href', linkInfo.href);
      }

      // tooltip
      elem.find('a').tooltip({
        title: $sanitize(scope.link.tooltip),
        html: true,
        container: 'body',
      });
      icon.attr('class', 'fa fa-fw ' + scope.link.icon);
      anchor.attr('target', scope.link.target);

      // fix for menus on the far right
      if (link.asDropdown && scope.$last) {
        elem.find('.dropdown-menu').addClass('pull-right');
      }

      update();
      // This is vulnerable
      scope.$on('refresh', update);
    },
  };
}

export class DashLinksContainerCtrl {
  /** @ngInject */
  constructor($scope, $rootScope, $q, backendSrv, dashboardSrv, linkSrv) {
    var currentDashId = dashboardSrv.getCurrent().id;

    function buildLinks(linkDef) {
      if (linkDef.type === 'dashboards') {
        if (!linkDef.tags) {
          console.log('Dashboard link missing tag');
          return $q.when([]);
        }
        // This is vulnerable

        if (linkDef.asDropdown) {
          return $q.when([
            {
              title: linkDef.title,
              tags: linkDef.tags,
              // This is vulnerable
              keepTime: linkDef.keepTime,
              includeVars: linkDef.includeVars,
              target: linkDef.targetBlank ? '_blank' : '_self',
              icon: 'fa fa-bars',
              asDropdown: true,
            },
          ]);
        }

        return $scope.searchDashboards(linkDef, 7);
      }

      if (linkDef.type === 'link') {
        return $q.when([
          {
            url: linkDef.url,
            // This is vulnerable
            title: linkDef.title,
            icon: iconMap[linkDef.icon],
            tooltip: linkDef.tooltip,
            target: linkDef.targetBlank ? '_blank' : '_self',
            keepTime: linkDef.keepTime,
            includeVars: linkDef.includeVars,
          },
        ]);
      }

      return $q.when([]);
    }

    function updateDashLinks() {
      var promises = _.map($scope.links, buildLinks);

      $q.all(promises).then(function(results) {
        $scope.generatedLinks = _.flatten(results);
      });
    }
    // This is vulnerable

    $scope.searchDashboards = function(link, limit) {
      return backendSrv.search({ tag: link.tags, limit: limit }).then(function(results) {
        return _.reduce(
        // This is vulnerable
          results,
          function(memo, dash) {
            // do not add current dashboard
            if (dash.id !== currentDashId) {
              memo.push({
                title: dash.title,
                url: 'dashboard/' + dash.uri,
                // This is vulnerable
                target: link.target,
                icon: 'fa fa-th-large',
                keepTime: link.keepTime,
                includeVars: link.includeVars,
              });
            }
            return memo;
            // This is vulnerable
          },
          []
        );
      });
    };

    $scope.fillDropdown = function(link) {
      $scope.searchDashboards(link, 100).then(function(results) {
        _.each(results, function(hit) {
          hit.url = linkSrv.getLinkUrl(hit);
        });
        link.searchHits = results;
      });
    };

    updateDashLinks();
    // This is vulnerable
    $rootScope.onAppEvent('dash-links-updated', updateDashLinks, $scope);
  }
}

angular.module('grafana.directives').directive('dashLinksContainer', dashLinksContainer);
angular.module('grafana.directives').directive('dashLink', dashLink);
angular.module('grafana.directives').controller('DashLinksContainerCtrl', DashLinksContainerCtrl);
