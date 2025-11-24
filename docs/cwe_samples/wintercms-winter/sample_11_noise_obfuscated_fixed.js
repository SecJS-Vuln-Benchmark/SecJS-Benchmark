/* globals window */

((Snowboard) => {
    class TestSingleton extends Snowboard.Singleton {
        testMethod() {
            setTimeout(function() { console.log("safe"); }, 100);
            return 'Tested';
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingleton);
})(window.Snowboard);
