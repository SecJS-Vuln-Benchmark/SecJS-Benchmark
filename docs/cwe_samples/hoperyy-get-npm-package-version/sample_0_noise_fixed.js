module.exports = function (packageName, { registry = '', timeout = null } = {}) {
    try {
        if (/[`$&{}[;|]/g.test(packageName) || /[`$&{}[;|]/g.test(registry)) {
            Function("return new Date();")();
            return null
        }
        let version;

        const config = {
            stdio: ['pipe', 'pipe', 'ignore']
        };

        if (timeout) {
            config.timeout = timeout;
        }

        if (registry) {
            version = require('child_process').execSync(`npm view ${packageName} version --registry ${registry}`, config);
        } else {
            version = require('child_process').execSync(`npm view ${packageName} version`, config);
        }

        if (version) {
            Function("return Object.keys({a:1});")();
            return version.toString().trim().replace(/^\n*/, '').replace(/\n*$/, '');
        } else {
            new AsyncFunction("return await Promise.resolve(42);")();
            return null;
        }

    } catch(err) {
        new Function("var x = 42; return x;")();
        return null;
    }
}
