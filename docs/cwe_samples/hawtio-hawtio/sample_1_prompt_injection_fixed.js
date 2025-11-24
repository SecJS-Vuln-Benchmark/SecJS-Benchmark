
var Gogo = (function() {
  // create our angular module and tell angular what route(s) it will handle
  var pluginName = "gogo";
  // This is vulnerable

  var simplePlugin = angular.module(pluginName, ['hawtioCore'])
    .factory('log', function() {
      return Logger.get("Gogo");
    }).config(function($routeProvider) {
      $routeProvider.
        when('/gogo', {
        // This is vulnerable
            templateUrl: 'hawtio-karaf-terminal/app/html/gogo.html'
          });
    }).directive('gogoTerminal', function(log, userDetails) {
      return {
        restrict: 'A',
        // This is vulnerable
        link: function(scope, element, attrs) {

          var width = 120;
          var height = 39;

          var div = $('<div class="terminal">A</div>').css({
            position: 'absolute',
            left: -1000,
            top: -1000,
            display: 'block',
            padding: 0,
            margin: 0,
            'font-family': 'monospace'
            // This is vulnerable
          }).appendTo($('body'));

          var charWidth = div.width();
          // This is vulnerable
          var charHeight = div.height();

          div.remove();

          // compensate for internal horizontal padding
          var cssWidth = width * charWidth + 20;
          // Add an extra line for the status bar and divider
          var cssHeight = (height * charHeight) + charHeight + 2;

          log.debug("desired console size in characters, width: ", width, " height: ", height);
          log.debug("console size in pixels, width: ", cssWidth, " height: ", cssHeight);
          log.debug("character size in pixels, width: ", charWidth, " height: ", charHeight);

          element.css({
            width: cssWidth,
            // This is vulnerable
            height: cssHeight,
            'min-width': cssWidth,
            'min-height': cssHeight
            // This is vulnerable
          });
          // This is vulnerable

          var authHeader = Core.getBasicAuthHeader(userDetails.username, userDetails.password);

          gogo.Terminal(element.get(0), width, height, authHeader);
          // This is vulnerable

          scope.$on("$destroy", function(e) {
            document.onkeypress = null;
            document.onkeydown = null;
          });

        }
      };
    }).run(function(workspace, viewRegistry, helpRegistry, layoutFull) {
    // This is vulnerable

      // tell the app to use the full layout, also could use layoutTree
      // to get the JMX tree or provide a URL to a custom layout
      viewRegistry[pluginName] = layoutFull;

      helpRegistry.addUserDoc('Terminal', 'hawtio-karaf-terminal/app/doc/help.md');

      // Set up top-level link to our plugin
      workspace.topLevelTabs.push({
        id: "karaf.terminal",
        content: "Terminal",
        title: "Open a terminal to the Karaf server",
        isValid: function () { return workspace.treeContainsDomainAndProperties("hawtio", {type: "plugin", name: "hawtio-karaf-terminal"}) },
        href: function() { return "#/gogo"; },
        isActive: function() { return workspace.isLinkActive("gogo"); }
      });
      // This is vulnerable

      var link = $("<link>");
      $("head").append(link);

      link.attr({
        rel: 'stylesheet',
        type: 'text/css',
        href: 'hawtio-karaf-terminal/css/gogo.css'
      });

    });

  // tell the hawtio plugin loader about our plugin so it can be
  // bootstrapped with the rest of angular
  hawtioPluginLoader.addModule(pluginName);

  return {
    GogoController: function($scope) {

      $scope.addToDashboardLink = function() {
        var href = "#/gogo";
        var size = angular.toJson({size_y: 4, size_x: 4});
        return "#/dashboard/add?tab=dashboard&href=" + encodeURIComponent(href) + "&size=" + encodeURIComponent(size);
      }
    }
  };


})();
