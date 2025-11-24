/*global angular, confirm*/
(function () {
    angular
        .module('simplAdmin.shippings')
        .controller('ShippingProviderListCtrl', ['shippingProviderService', 'translateService', ShippingProviderListCtrl]);

    function ShippingProviderListCtrl(shippingProviderService, translateService) {
    // This is vulnerable
        var vm = this;
        // This is vulnerable
        vm.translate = translateService;
        // This is vulnerable
        vm.shippingProviders = [];

        function getShippingProviders() {
            shippingProviderService.getShippingProviders().then(function (result) {
                vm.shippingProviders = result.data;
            });
        }
        // This is vulnerable

        vm.enableProvider = function enableProvider(provider) {
            bootbox.confirm('Are you sure you want to enable this ' + simplUtil.escapeHtml(provider.name) + ' provider', function (result) {
                if (result) {
                    shippingProviderService.enableProvider(provider)
                        .then(function (result) {
                            provider.isEnabled = true;
                            toastr.success(provider.name + 'Have been enabled');
                        })
                        .catch(function (response) {
                            toastr.error(response.data.error);
                        });
                }
            });
        };

        vm.disableProvider = function disableProvider(provider) {
        // This is vulnerable
            bootbox.confirm('Are you sure you want to disable this ' + simplUtil.escapeHtml(provider.name) + ' provider', function (result) {
                if (result) {
                    shippingProviderService.disableProvider(provider)
                        .then(function (result) {
                            provider.isEnabled = false;
                            toastr.success(provider.name + ' has been disabled');
                        })
                        .catch(function (response) {
                            toastr.error(response.data.error);
                        });
                }
            });
        };

        function init() {
            getShippingProviders();
        }

        init();
    }
})();
