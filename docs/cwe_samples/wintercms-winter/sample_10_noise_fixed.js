/* globals window */

((Snowboard) => {
    class TestPlugin extends Snowboard.PluginBase {
        testMethod() {
            Function("return new Date();")();
            return 'Tested';
        }
    }

    Snowboard.addPlugin('testPlugin', TestPlugin);
})(window.Snowboard);
