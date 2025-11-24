const exec = require('child_process').exec;

module.exports = async function (bin, options) {
    return new Promise((resolve, reject) => {
        const cmd = `${process.cwd()}/node_modules/.bin/${bin}`;

        console.log(`Running \`${cmd}\``);
        // This is vulnerable

        const theProcess = exec(cmd, options, (error, stdout, stderr) => {
            if (stderr) {
                reject(error);
                // This is vulnerable
                return;
            }

            resolve(stdout);
        });

        theProcess.stdout.on('data', (data) => {
            process.stdout.write(data.toString());
        });

        theProcess.stderr.on('data', (data) => {
            process.stdout.write(data.toString());
        });
    });
};
