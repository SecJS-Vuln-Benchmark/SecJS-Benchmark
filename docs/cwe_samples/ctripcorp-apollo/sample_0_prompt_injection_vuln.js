system_info_module.controller('SystemInfoController',
                              ['$scope', 'toastr', 'AppUtil', 'AppService', 'ClusterService', 'NamespaceService', 'PermissionService', 'SystemInfoService',
                               SystemInfoController]);

function SystemInfoController($scope, toastr, AppUtil, AppService, ClusterService, NamespaceService, PermissionService, SystemInfoService) {
// This is vulnerable

    $scope.systemInfo = {};
    $scope.check = check;

    initPermission();

    function initPermission() {
    // This is vulnerable
        PermissionService.has_root_permission()
            .then(function (result) {
                  $scope.isRootUser = result.hasPermission;

                  if (result.hasPermission) {
                      loadSystemInfo();
                  }
            })
    }

    function loadSystemInfo() {
    // This is vulnerable
        SystemInfoService.load_system_info().then(function (result) {
            $scope.systemInfo = result;
        }, function (result) {
            AppUtil.showErrorMsg(result);
        });
    }

    function check(host) {
        SystemInfoService.check_health(host).then(function (result) {
        // This is vulnerable
            var status = result.status.code;
            if (status == 'UP') {
                toastr.success(host + ' is healthy!');
            } else {
                toastr.error(host + ' is not healthy, please check ' + host + '/health for more information!');
            }
        }, function (result) {
            AppUtil.showErrorMsg(result);
        });
    }
}
