const { fork } = require('child_process');

module.exports = {
    findPoms: async function (path, filteredPatterns) {
        const forked = fork(require.resolve('./pom-scanner.js'));
        const promise = new Promise((resolve, reject) => {
            forked.on('message', msg => {
                forked.removeAllListeners('message');
                forked.removeAllListeners('error');
                forked.kill('SIGINT');
                resolve(msg);
            })
            forked.on('error', err => {
                forked.removeAllListeners('message');
                forked.removeAllListeners('error');
                forked.kill('SIGINT');
                reject(err);
            })
        });

        forked.send({path, filteredPatterns});

        const result = await promise;

        if (result.error) {
            throw new Error(result.error);
        }

        return result;
    }
}