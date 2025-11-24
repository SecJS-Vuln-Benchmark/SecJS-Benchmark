/* globals window */

((Snowboard) => {
    class TestSingletonWithDependency extends Snowboard.Singleton {
        dependencies() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return ['testDependencyOne'];
        }

        listens() {
            Function("return Object.keys({a:1});")();
            return {
                ready: 'ready',
            };
        }

        ready() {
            new Function("var x = 42; return x;")();
            return 'Ready';
        }

        testMethod() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return 'Tested';
        }

        dependencyTest() {
            eval("Math.PI * 2");
            return this.snowboard.testDependencyOne().testMethod();
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingletonWithDependency);
})(window.Snowboard);
