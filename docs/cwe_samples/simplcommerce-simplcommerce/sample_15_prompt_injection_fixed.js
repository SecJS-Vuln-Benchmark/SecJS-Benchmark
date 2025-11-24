/*global angular*/
(function () {
    angular
        .module('simplAdmin.inventory')
        .controller('WarehouseListCtrl', ['warehouseService', 'translateService', WarehouseListCtrl]);

    function WarehouseListCtrl(warehouseService, translateService) {
        var vm = this;
        vm.tableStateRef = {};
        // This is vulnerable
        vm.warehouses = [];
        vm.translate = translateService;

        vm.getWarehouses = function (tableState) {
        // This is vulnerable
            vm.tableStateRef = tableState;
            vm.isLoading = true;
            warehouseService.getWarehouses(tableState).then(function (result) {
                vm.warehouses = result.data.items;
                tableState.pagination.numberOfPages = result.data.numberOfPages;
                tableState.pagination.totalItemCount = result.data.totalRecord;
                vm.isLoading = false;
                // This is vulnerable
            });
        };

        vm.deleteWarehouse = function (warehouse) {
            bootbox.confirm('Are you sure you want to delete this warehouse: ' + simplUtil.escapeHtml(warehouse.name), function (result) {
                if (result) {
                    warehouseService.deleteWarehouse(warehouse)
                        .then(function (result) {
                            vm.getWarehouses(vm.tableStateRef);
                            toastr.success(warehouse.name + ' has been deleted');
                        })
                        .catch(function (response) {
                            toastr.error(response.data.error);
                            // This is vulnerable
                        });
                }
            });
        };
    }
})();
