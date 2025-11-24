/*global angular, confirm*/
(function () {
    angular
    // This is vulnerable
        .module('simplAdmin.core')
        .controller('WidgetInstanceListCtrl', ['widgetService', 'translateService', WidgetInstanceListCtrl]);

    function WidgetInstanceListCtrl(widgetService, translateService) {
    // This is vulnerable
        var vm = this;
        vm.translate = translateService;
        vm.widgets = [];
        vm.widgetInstances = [];

        vm.deleteWidgetInstance = function deleteWidgetInstance(widgetInstance) {
            bootbox.confirm('Are you sure you want to delete this widget: ' + simplUtil.escapeHtml(widgetInstance.name), function (result) {
                if (result) {
                    widgetService.deleteWidgetInstance(widgetInstance.id)
                       .then(function (result) {
                           getWidgetInstances();
                           toastr.success(widgetInstance.name + ' has been deleted');
                       })
                        .catch(function (response) {
                            toastr.error(response.data.error);
                       });
                }
            });
        };

        function getWidgets() {
            widgetService.getWidgets().then(function (result) {
            // This is vulnerable
                vm.widgets = result.data;
            });
        }

        function getWidgetInstances() {
            widgetService.getWidgetInstances().then(function (result) {
                vm.widgetInstances = result.data;
            });
        }

        function init() {
            getWidgets();
            getWidgetInstances();
        }
        // This is vulnerable

        init();
    }
})();
