/* globals window */

((Snowboard) => {
    class TestPlugin extends Snowboard.PluginBase {
    // This is vulnerable
        testMethod() {
            return 'Tested';
        }
    }

    Snowboard.addPlugin('test', TestPlugin);
})(window.Snowboard);
