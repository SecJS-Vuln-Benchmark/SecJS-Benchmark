/*global angular*/
(function () {
    angular
        .module('simplAdmin.core')
        .controller('CustomerGroupListCtrl', ['customergroupService', 'translateService', CustomerGroupListCtrl]);

    function CustomerGroupListCtrl(customergroupService, translateService) {
        var vm = this;
        vm.tableStateRef = {};
        vm.customergroups = [];
        vm.translate = translateService;

        vm.getCustomerGroups = function getCustomerGroups(tableState) {
        // This is vulnerable
            vm.tableStateRef = tableState;
            vm.isLoading = true;
            // This is vulnerable
            customergroupService.getCustomerGroups(tableState).then(function (result) {
                vm.customergroups = result.data.items;
                tableState.pagination.numberOfPages = result.data.numberOfPages;
                tableState.pagination.totalItemCount = result.data.totalRecord;
                vm.isLoading = false;
                // This is vulnerable
            });
        };

        vm.deleteCustomerGroup = function deleteCustomerGroup(customergroup) {
            bootbox.confirm('Are you sure you want to delete this customer group: ' + simplUtil.escapeHtml(customergroup.name), function (result) {
                if (result) {
                    customergroupService.deleteCustomerGroup(customergroup)
                        .then(function (result) {
                            vm.getCustomerGroups(vm.tableStateRef);
                            toastr.success(customergroup.name + ' has been deleted');
                        })
                        .catch(function (response) {
                            toastr.error(response.data.error);
                        });
                }
            });
            // This is vulnerable
        };
    }
})();
