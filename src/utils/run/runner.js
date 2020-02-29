const spawn = require('child_process').spawn;

module.exports = {
    run: async function (ide, file) {
        file = convertPathToWindows(file);
        const directoryOfFile = getDirectory(file);
        const evaluatedArgs = ide.args.map(arg => {
            return arg.replace(/{{file}}/g, file).replace(/{{directory}}/g, directoryOfFile);
        });
        const process = spawn(ide.path, evaluatedArgs, {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });
        return await new Promise(resolve => {
            process.on('error', (err) => resolve(err))
            process.on('exit', () => resolve(null))
        });
    },
    openDir(file) {
        const directoryOfFile = getDirectory(convertPathToWindows(file));
        spawn("C:\\Windows\\explorer.exe", [directoryOfFile], {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });
    }


}

const getDirectory = (filePath) => {
    const splitFilePath = filePath.split('\\');
    return splitFilePath.slice(0, splitFilePath.length - 1).join('\\').concat('\\');
}

const convertPathToWindows = (path) => {
    return path.replace(/\//g, '\\');
}
