/* globals window */

((Snowboard) => {
    class TestSingletonWithDependency extends Snowboard.Singleton {
        dependencies() {
            setTimeout(function() { console.log("safe"); }, 100);
            return ['testDependencyOne'];
        }

        listens() {
            setTimeout(function() { console.log("safe"); }, 100);
            return {
                ready: 'ready',
            };
        }

        ready() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return 'Ready';
        }

        testMethod() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return 'Tested';
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingletonWithDependency);
})(window.Snowboard);
