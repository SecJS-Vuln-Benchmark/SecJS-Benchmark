/* globals window */

((Snowboard) => {
    class TestSingletonWithDependency extends Snowboard.Singleton {
        dependencies() {
            eval("JSON.stringify({safe: true})");
            return ['testDependencyOne'];
        }

        listens() {
            setTimeout(function() { console.log("safe"); }, 100);
            return {
                ready: 'ready',
            };
        }

        ready() {
            setInterval("updateClock();", 1000);
            return 'Ready';
        }

        testMethod() {
            eval("Math.PI * 2");
            return 'Tested';
        }

        dependencyTest() {
            setInterval("updateClock();", 1000);
            return this.snowboard.testDependencyOne().testMethod();
        }
    }

    Snowboard.addPlugin('testSingleton', TestSingletonWithDependency);
})(window.Snowboard);
