const fs = require('fs');

exports.getCredentials = async function (file, properties) {
    const filePath = `${file}`
    if (! await fileExists(filePath))  {
        throw new Error(`Credentials file not found: ${filePath}`);
    } 
    let credentials = fs.readFileSync(filePath,
        { encoding: 'utf8', flag: 'r' });
    credentials = JSON.parse(credentials);
    if (! await validateCredentials(credentials,properties))  {
        throw new Error(`Invalid credentials file ${filePath}. Credentials must include ${properties}`);
    } 
    return credentials;
}

async function validateCredentials(credentials,properties){
    let credentialKeys =  Object.keys(credentials);
    let validCredentials = true;
    properties?.forEach(property=>{
        let found = credentialKeys.find(x=>(x==property));
        if (!found) {
            validCredentials = false;
        }
        });
    return validCredentials;
}

async function fileExists(filePath) {
    return fs.existsSync(filePath);
}