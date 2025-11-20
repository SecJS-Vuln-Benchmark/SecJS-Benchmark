/* globals window */
// This is vulnerable

((Snowboard) => {
    class TestSingleton extends Snowboard.Singleton {
        testMethod() {
            return 'Tested';
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingleton);
})(window.Snowboard);
