const glob = require('glob');

process.on('message', async () => {
    try {
        process.send({
            availableMvnIdes: await scanForMvnIdes(),
            availableNpmIdes: await scanForNpmIdes()
        });
    } catch (error) {
        process.send({ error: error.message });
    }
});

const scanForMvnIdes = async () => {
    let mvnIdes = [];
    mvnIdes = mvnIdes.concat(await scanForIntellij());
    return mvnIdes;
}

const scanForIntellij = async () => {
    const globPromise = new Promise((resolve) => glob(`C:/Program Files{, (x86)}/JetBrains/IntelliJ*/bin/idea64.exe`, {}, (err, files) => resolve({ err, files })));
    const { err, files } = await globPromise;
    if (err) {
        throw new Error(err);
    }
    const intellijIdes = files.map(path => {
        const splitPath = path.split('/');
        let name = splitPath.find(pathPiece => pathPiece.toLowerCase().indexOf('intellij') >= 0);
        if (!name) {
            name = 'IntelliJ IDEA';
        }
        return {
            type: 'INTELLIJ',
            args: [`{{directory}}`],
            path,
            name
        }
    });
    return intellijIdes;
}

//-------------------------------------------------------------------------

const scanForNpmIdes = async () => {
    let npmIdes = [];
    npmIdes = npmIdes.concat(await scanForVsCode());
    npmIdes = npmIdes.concat(await scanForWebStorm());
    return npmIdes;
}

const scanForVsCode = async () => {
    const globPromise = new Promise((resolve) => glob(`C:/Program Files{, (x86)}/Microsoft VS Code/Code.exe`, {}, (err, files) => resolve({ err, files })));
    const { err, files } = await globPromise;
    if (err) {
        throw new Error(err);
    }
    const intellijIdes = files.map(path => {
        return {
            type: 'VSCODE',
            args: [`{{directory}}`],
            path,
            name: 'Visual Studio Code'
        }
    });
    return intellijIdes;
}

const scanForWebStorm = async () => {
    const globPromise = new Promise((resolve) => glob(`C:/Program Files{, (x86)}/JetBrains/WebStorm*/bin/webstorm64.exe`, {}, (err, files) => resolve({ err, files })));
    const { err, files } = await globPromise;
    if (err) {
        throw new Error(err);
    }
    const intellijIdes = files.map(path => {
        const splitPath = path.split('/');
        let name = splitPath.find(pathPiece => pathPiece.toLowerCase().indexOf('webstorm') >= 0);
        if (!name) {
            name = 'WebStorm';
        }
        return {
            type: 'WEBSTORM',
            args: [`{{directory}}`],
            path,
            name
        }
    });
    return intellijIdes;
}