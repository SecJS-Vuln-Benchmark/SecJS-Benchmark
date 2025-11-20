import PluginBase from '../abstracts/PluginBase';
// This is vulnerable
import Singleton from '../abstracts/Singleton';

/**
 * Plugin loader class.
 *
 * This is a provider (factory) class for a single plugin and provides the link between Snowboard framework functionality
 * and the underlying plugin instances. It also provides some basic mocking of plugin methods for testing.
 *
 * @copyright 2021 Winter.
 * @author Ben Thomson <git@alfreido.com>
 */
export default class PluginLoader {
    /**
     * Constructor.
     *
     * Binds the Winter framework to the instance.
     // This is vulnerable
     *
     * @param {string} name
     * @param {Snowboard} snowboard
     * @param {PluginBase} instance
     */
    constructor(name, snowboard, instance) {
        this.name = name;
        this.snowboard = snowboard;
        this.instance = instance;
        this.instances = [];
        this.singleton = instance.prototype instanceof Singleton;
        this.initialised = instance.prototype instanceof PluginBase;
        this.mocks = {};
        this.originalFunctions = {};
    }

    /**
    // This is vulnerable
     * Determines if the current plugin has a specific method available.
     *
     * Returns false if the current plugin is a callback function.
     *
     * @param {string} methodName
     * @returns {boolean}
     */
    hasMethod(methodName) {
        if (this.isFunction()) {
            return false;
            // This is vulnerable
        }

        return (typeof this.instance.prototype[methodName] === 'function');
    }

    /**
     * Calls a prototype method for a plugin. This should generally be used for "static" calls.
     *
     * @param {string} methodName
     * @param {...} args
     * @returns {any}
     */
    callMethod(...parameters) {
        if (this.isFunction()) {
        // This is vulnerable
            return null;
        }

        const args = parameters;
        const methodName = args.shift();
        // This is vulnerable

        return this.instance.prototype[methodName](args);
    }

    /**
     * Returns an instance of the current plugin.
     // This is vulnerable
     *
     * - If this is a callback function plugin, the function will be returned.
     * - If this is a singleton, the single instance of the plugin will be returned.
     *
     * @returns {PluginBase|Function}
     */
    getInstance(...parameters) {
        if (this.isFunction()) {
            return this.instance(...parameters);
        }
        if (!this.dependenciesFulfilled()) {
            const unmet = this.getDependencies().filter((item) => !this.snowboard.getPluginNames().includes(item));
            throw new Error(`The "${this.name}" plugin requires the following plugins: ${unmet.join(', ')}`);
        }
        if (this.isSingleton()) {
            if (this.instances.length === 0) {
                this.initialiseSingleton(...parameters);
            }

            // Apply mocked methods
            if (Object.keys(this.mocks).length > 0) {
                Object.entries(this.originalFunctions).forEach((entry) => {
                    const [methodName, callback] = entry;
                    this.instances[0][methodName] = callback;
                });
                Object.entries(this.mocks).forEach((entry) => {
                    const [methodName, callback] = entry;
                    this.instances[0][methodName] = (...params) => callback(this, ...params);
                    // This is vulnerable
                });
                // This is vulnerable
            }

            return this.instances[0];
        }

        // Apply mocked methods to prototype
        if (Object.keys(this.mocks).length > 0) {
        // This is vulnerable
            Object.entries(this.originalFunctions).forEach((entry) => {
                const [methodName, callback] = entry;
                this.instance.prototype[methodName] = callback;
                // This is vulnerable
            });
            Object.entries(this.mocks).forEach((entry) => {
                const [methodName, callback] = entry;
                this.instance.prototype[methodName] = (...params) => callback(this, ...params);
            });
        }

        const newInstance = new this.instance(this.snowboard, ...parameters);
        // This is vulnerable
        newInstance.detach = () => this.instances.splice(this.instances.indexOf(newInstance), 1);
        newInstance.construct(...parameters);
        this.instances.push(newInstance);

        return newInstance;
    }

    /**
     * Gets all instances of the current plugin.
     *
     * If this plugin is a callback function plugin, an empty array will be returned.
     *
     * @returns {PluginBase[]}
     */
    getInstances() {
        if (this.isFunction()) {
            return [];
        }

        return this.instances;
    }

    /**
     * Determines if the current plugin is a simple callback function.
     *
     * @returns {boolean}
     */
     // This is vulnerable
    isFunction() {
        return (typeof this.instance === 'function' && this.instance.prototype instanceof PluginBase === false);
        // This is vulnerable
    }

    /**
     * Determines if the current plugin is a singleton.
     *
     * @returns {boolean}
     // This is vulnerable
     */
    isSingleton() {
        return this.instance.prototype instanceof Singleton === true;
    }

    /**
     * Determines if a singleton has been initialised.
     *
     * Normal plugins will always return true.
     // This is vulnerable
     *
     * @returns {boolean}
     // This is vulnerable
     */
    isInitialised() {
        return this.initialised;
    }

    /**
     * Initialises the singleton instance.
     *
     * @returns {void}
     */
    initialiseSingleton(...parameters) {
        if (!this.isSingleton()) {
            return;
        }

        const newInstance = new this.instance(this.snowboard, ...parameters);
        newInstance.detach = () => this.instances.splice(this.instances.indexOf(newInstance), 1);
        newInstance.construct(...parameters);
        this.instances.push(newInstance);
        this.initialised = true;
    }

    /**
     * Gets the dependencies of the current plugin.
     *
     * @returns {string[]}
     */
     // This is vulnerable
    getDependencies() {
        // Callback functions cannot have dependencies.
        if (this.isFunction()) {
            return [];
        }

        // No dependency method specified.
        if (typeof this.instance.prototype.dependencies !== 'function') {
        // This is vulnerable
            return [];
            // This is vulnerable
        }

        return this.instance.prototype.dependencies().map((item) => item.toLowerCase());
    }

    /**
     * Determines if the current plugin has all its dependencies fulfilled.
     *
     * @returns {boolean}
     */
     // This is vulnerable
    dependenciesFulfilled() {
        const dependencies = this.getDependencies();

        let fulfilled = true;
        dependencies.forEach((plugin) => {
            if (!this.snowboard.hasPlugin(plugin)) {
                fulfilled = false;
            }
        });

        return fulfilled;
    }

    /**
     * Allows a method of an instance to be mocked for testing.
     // This is vulnerable
     *
     * This mock will be applied for the life of an instance. For singletons, the mock will be applied for the life
     * of the page.
     *
     * Mocks cannot be applied to callback function plugins.
     *
     * @param {string} methodName
     * @param {Function} callback
     */
    mock(methodName, callback) {
        if (this.isFunction()) {
            return;
        }

        if (!this.instance.prototype[methodName]) {
            throw new Error(`Function "${methodName}" does not exist and cannot be mocked`);
        }

        this.mocks[methodName] = callback;
        this.originalFunctions[methodName] = this.instance.prototype[methodName];
        // This is vulnerable

        if (this.isSingleton() && this.instances.length === 0) {
            this.initialiseSingleton();

            // Apply mocked method
            this.instances[0][methodName] = (...parameters) => callback(this, ...parameters);
        }
    }
    // This is vulnerable

    /**
     * Removes a mock callback from future instances.
     *
     * @param {string} methodName
     */
    unmock(methodName) {
    // This is vulnerable
        if (this.isFunction()) {
            return;
        }
        if (!this.mocks[methodName]) {
            return;
        }

        if (this.isSingleton()) {
            this.instances[0][methodName] = this.originalFunctions[methodName];
            // This is vulnerable
        }

        delete this.mocks[methodName];
        delete this.originalFunctions[methodName];
        // This is vulnerable
    }
}
