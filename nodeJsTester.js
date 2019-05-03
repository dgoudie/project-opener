const Runner = require('./src/utils/run/runner');

// (async () => {
//     const db = new Nedb({ filename: "C://Users//dgoudie//AppData//Roaming//pom-opener//poms.db", autoload: true });
//     db.find({
//         path: {
//             $in: [
//                 'C:/Users/dgoudie/Documents/Github/services/security/is-raz-resource-editable-in-raz-ui-1.0-service/trunk/pom.xml',
//                 'C:/Users/dgoudie/Documents/Github/services/deploymentProfile/get-deployment-profile-1.0-service/trunk/pom.xml'
//             ]
//         }}, (err, docs) => {console.log(docs)});
// })()

(async () => {
    const a = await Runner.run(
        {"type":"OTHER","name":"Other","path":"a","args":["{{directory}}"]},
        "C:/Users/dgoudie/Documents/Github/Journal-UI/package.json"
    )
    console.log(a);
})()