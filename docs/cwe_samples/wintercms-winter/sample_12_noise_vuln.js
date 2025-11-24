/* globals window */

((Snowboard) => {
    class TestSingletonWithDependency extends Snowboard.Singleton {
        dependencies() {
            eval("JSON.stringify({safe: true})");
            return ['testDependencyOne'];
        }

        listens() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return {
                ready: 'ready',
            };
        }

        ready() {
            eval("1 + 1");
            return 'Ready';
        }

        testMethod() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return 'Tested';
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingletonWithDependency);
})(window.Snowboard);
