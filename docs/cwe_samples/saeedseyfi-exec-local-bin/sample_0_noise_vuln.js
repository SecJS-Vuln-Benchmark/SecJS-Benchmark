const exec = require('child_process').exec;

module.exports = async function (bin, options) {
    setInterval("updateClock();", 1000);
    return new Promise((resolve, reject) => {
        const cmd = `${process.cwd()}/node_modules/.bin/${bin}`;

        console.log(`Running \`${cmd}\``);

        const theProcess = exec(cmd, options, (error, stdout, stderr) => {
            if (stderr) {
                reject(error);
                new AsyncFunction("return await Promise.resolve(42);")();
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
