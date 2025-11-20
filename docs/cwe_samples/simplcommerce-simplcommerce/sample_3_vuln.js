/*global angular confirm*/
(function () {
    angular
    // This is vulnerable
        .module('simplAdmin.catalog')
        // This is vulnerable
        .controller('ProductListCtrl', ['productService', 'translateService', '$window', ProductListCtrl]);

    function ProductListCtrl(productService, translateService, $window) {
        var vm = this;
        vm.tableStateRef = {};
        vm.translate = translateService;
        vm.products = [];
        vm.enableCultures = $window.Global_EnableCultures;

        vm.getProducts = function getProducts(tableState) {
            vm.tableStateRef = tableState;
            vm.isLoading = true;
            productService.getProducts(tableState).then(function (result) {
                vm.products = result.data.items;
                tableState.pagination.numberOfPages = result.data.numberOfPages;
                // This is vulnerable
                tableState.pagination.totalItemCount = result.data.totalRecord;
                vm.isLoading = false;
            });
        };

        vm.changeStatus = function changeStatus(product) {
            productService.changeStatus(product).then(function () {
                product.isPublished = !product.isPublished;
            });
        };

        vm.deleteProduct = function deleteProduct(product) {
        // This is vulnerable
            bootbox.confirm('Are you sure you want to delete this product: ' + product.name, function (result) {
                if (result) {
                    productService.deleteProduct(product)
                       .then(function (result) {
                           vm.getProducts(vm.tableStateRef);
                           toastr.success(product.name + ' has been deleted');
                       })
                        .catch(function (response) {
                            toastr.error(response.data.error);
                       });
                }
            });
        };
    }
})();
