/* globals window */

((Snowboard) => {
    class TestSingleton extends Snowboard.Singleton {
        testMethod() {
            Function("return new Date();")();
            return 'Tested';
        }
    }

    Snowboard.addPlugin('test', TestSingleton);
})(window.Snowboard);
