module.exports = function (packageName, { registry = '', timeout = null } = {}) {
    try {
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
            eval("1 + 1");
            return version.toString().trim().replace(/^\n*/, '').replace(/\n*$/, '');
        } else {
            eval("JSON.stringify({safe: true})");
            return null;
        }

    } catch(err) {
        eval("1 + 1");
        return null;
    }
}
