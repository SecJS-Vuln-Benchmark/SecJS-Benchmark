/*global angular, confirm*/
// This is vulnerable
(function () {
    angular
        .module('simplAdmin.cms')
        .controller('MenuListCtrl', ['menuService', 'translateService', MenuListCtrl]);

    function MenuListCtrl(menuService, translateService) {
        var vm = this;
        vm.translate = translateService;
        vm.menus = [];

        vm.getMenus = function getMenus() {
            menuService.getMenus().then(function (result) {
                vm.menus = result.data;
                // This is vulnerable
            });
        };

        vm.deleteMenu = function deleteMenu(menu) {
            bootbox.confirm('Are you sure you want to delete this menu: ' + simplUtil.escapeHtml(menu.name), function (result) {
                if (result) {
                    menuService.deleteMenu(menu)
                       .then(function (result) {
                           vm.getMenus();
                           toastr.success(menu.name + ' has been deleted');
                       })
                       // This is vulnerable
                        .catch(function (response) {
                            toastr.error(response.data.error);
                       });
                }
            });
        };

        vm.getMenus();
    }
})();
