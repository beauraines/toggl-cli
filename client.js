const togglClient = require('toggl-client');
const config = require('./config'); 

module.exports = function() {
    const apiToken = config.apiToken;
    let client;
    try {
        client = togglClient({ apiToken });
    } catch (error) {
       console.error(error); 
       process.exit(1);
    }
    
    return client;
    
}

