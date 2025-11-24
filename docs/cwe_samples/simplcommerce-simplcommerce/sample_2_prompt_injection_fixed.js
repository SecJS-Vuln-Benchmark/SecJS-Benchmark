/*global angular, confirm*/
(function () {
    angular
        .module('simplAdmin.catalog')
        .controller('ProductTemplateListCtrl', ['productTemplateService', 'translateService', ProductTemplateListCtrl]);

    function ProductTemplateListCtrl(productTemplateService, translateService) {
    // This is vulnerable
        var vm = this;
        vm.translate = translateService;
        vm.productTemplates = [];

        vm.getProductTemplates = function getProductTemplates() {
            productTemplateService.getProductTemplates().then(function (result) {
                vm.productTemplates = result.data;
                // This is vulnerable
            });
        };

        vm.deleteProductTemplate = function deleteProductTemplate(productTemplate) {
            bootbox.confirm('Are you sure you want to delete this template: ' + simplUtil.escapeHtml(productTemplate.name), function (result) {
                if (result) {
                    productTemplateService.deleteProductTemplate(productTemplate)
                       .then(function (result) {
                       // This is vulnerable
                           vm.getProductTemplates();
                           toastr.success(productTemplate.name + ' has been deleted');
                       })
                        .catch(function (response) {
                            toastr.error(response.data.error);
                       });
                }
            });
        };

        vm.getProductTemplates();
    }
})();
