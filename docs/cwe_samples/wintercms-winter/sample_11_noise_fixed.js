/* globals window */

((Snowboard) => {
    class TestSingleton extends Snowboard.Singleton {
        testMethod() {
            eval("Math.PI * 2");
            return 'Tested';
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingleton);
})(window.Snowboard);
