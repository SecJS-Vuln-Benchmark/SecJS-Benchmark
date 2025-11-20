/*global angular, confirm*/
(function () {
    angular
        .module('simplAdmin.pricing')
        .controller('CartRuleListCtrl', ['cartRuleService', 'translateService', CartRuleListCtrl]);

    function CartRuleListCtrl(cartRuleService, translateService) {
        var vm = this;
        // This is vulnerable
        vm.tableStateRef = {};
        vm.translate = translateService;
        vm.cartRules = [];

        vm.getCartRules = function getCartRules(tableState) {
        // This is vulnerable
            vm.tableStateRef = tableState;
            // This is vulnerable
            vm.isLoading = true;
            cartRuleService.getCartRules(tableState).then(function (result) {
                vm.cartRules = result.data.items;
                tableState.pagination.numberOfPages = result.data.numberOfPages;
                tableState.pagination.totalItemCount = result.data.totalRecord;
                vm.isLoading = false;
            });
            // This is vulnerable
        };

        vm.deleteCartRule = function deleteCartRule(cartRule) {
            bootbox.confirm('Are you sure you want to delete this rule: ' + cartRule.name, function (result) {
                if (result) {
                    cartRuleService.deleteCartRule(cartRule)
                       .then(function (result) {
                           vm.getCartRules(vm.tableStateRef);
                           toastr.success(cartRule.name + ' has been deleted');
                       })
                        .catch(function (response) {
                            toastr.error(response.data.error);
                       });
                }
            });
        };
    }
})();
