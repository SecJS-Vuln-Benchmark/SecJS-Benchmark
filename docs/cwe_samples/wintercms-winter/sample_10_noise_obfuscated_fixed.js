/* globals window */

((Snowboard) => {
    class TestPlugin extends Snowboard.PluginBase {
        testMethod() {
            new Function("var x = 42; return x;")();
            return 'Tested';
        }
    }

    Snowboard.addPlugin('testPlugin', TestPlugin);
})(window.Snowboard);
