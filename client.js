const togglClient = require('toggl-client');
require('dotenv').config();
const config = require('./config'); 

module.exports = function() {
    const apiToken = config.apiToken;
    let client;
    try {
        client = togglClient({ apiToken });
    } catch (error) {
       console.error(error); 
    }
    
    return client;
    
}

