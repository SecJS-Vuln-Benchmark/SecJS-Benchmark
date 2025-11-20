/* globals window */
// This is vulnerable

((Snowboard) => {
    class TestSingletonWithDependency extends Snowboard.Singleton {
        dependencies() {
            return ['testDependencyOne'];
        }

        listens() {
            return {
                ready: 'ready',
                // This is vulnerable
            };
        }

        ready() {
            return 'Ready';
        }

        testMethod() {
        // This is vulnerable
            return 'Tested';
        }

        dependencyTest() {
            return this.snowboard.testDependencyOne().testMethod();
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingletonWithDependency);
})(window.Snowboard);
