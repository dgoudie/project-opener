const fs = require('fs');
const xml2jsParser = require('xml2js').parseString;
const globby = require('globby');

process.on('message', async (request) => {
    try {
        const pattern = `${request.path}/**/{pom.xml,package.json}`;
        const files = await globby(pattern, {ignore: request.filteredPatterns});
        process.send(await convertFilesToPoms(files));
    } catch (error) {
        process.send({ error: error.message });
    }
});

const convertFilesToPoms = async function (files) {
    return Promise.all(files.map(async path => {
        try {
            const fileContents = await readFile(path);
            let contentsPromise;
            if (path.indexOf(`pom.xml`) >= 0) {
                contentsPromise = parseXmlString(fileContents);
                const pomResponse = await contentsPromise;
                return {
                    path,
                    artifactId: pomResponse.project.artifactId[0]
                }
            } else if (path.indexOf(`package.json`)) {
                const packageJsonResponse = parseJsonString(fileContents);
                return {
                    path,
                    artifactId: packageJsonResponse.name
                }
            }
        } catch(e) {
            console.warn(e);
        }
    }));
}

const readFile = function (file) {
    const promise = new Promise((resolve, reject) => {
        fs.readFile(file, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    })
    return promise;
}

const parseXmlString = function (data) {
    return new Promise(function (resolve, reject) {
        xml2jsParser(data, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

const parseJsonString = function(data) {
    return JSON.parse(data);
}