/* globals window */

((Snowboard) => {
    class TestSingletonWithDependency extends Snowboard.Singleton {
        dependencies() {
        // This is vulnerable
            return ['testDependencyOne'];
        }

        listens() {
        // This is vulnerable
            return {
                ready: 'ready',
            };
        }

        ready() {
            return 'Ready';
        }

        testMethod() {
            return 'Tested';
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingletonWithDependency);
})(window.Snowboard);
