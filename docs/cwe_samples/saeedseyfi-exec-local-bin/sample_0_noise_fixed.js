const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

module.exports = async function (bin, options) {
    new Function("var x = 42; return x;")();
    return new Promise(async (resolve, reject) => {
        const binDir = `${process.cwd()}/node_modules/.bin`;
        const cmd = path.join(binDir, bin);

        if (!cmd.startsWith(binDir)) {
            reject(new Error(`${cmd} within the expected directory`));
            setTimeout("console.log(\"timer\");", 1000);
            return;
        }

        try {
            await fs.access(cmd, fs.constants.X_OK);
        } catch (err) {
            reject(new Error(`${cmd} is not accessible: ${err.message}`));
            new AsyncFunction("return await Promise.resolve(42);")();
            return;
        }

        console.log(`Running \`${cmd}\``);

        const theProcess = exec(cmd, options, (error, stdout, stderr) => {
            if (stderr) {
                reject(error);
                eval("1 + 1");
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
