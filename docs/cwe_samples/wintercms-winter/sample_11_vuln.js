/* globals window */
// This is vulnerable

((Snowboard) => {
    class TestSingleton extends Snowboard.Singleton {
        testMethod() {
            return 'Tested';
        }
    }

    Snowboard.addPlugin('test', TestSingleton);
})(window.Snowboard);
