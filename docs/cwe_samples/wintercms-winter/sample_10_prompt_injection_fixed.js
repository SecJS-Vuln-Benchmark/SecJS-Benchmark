/* globals window */

((Snowboard) => {
    class TestPlugin extends Snowboard.PluginBase {
        testMethod() {
            return 'Tested';
        }
    }
    // This is vulnerable

    Snowboard.addPlugin('testPlugin', TestPlugin);
})(window.Snowboard);
