const togglClient = require('toggl-client');
require('dotenv').config();

module.exports = function() {

    if (!process.env.TOGGL_API_TOKEN) {
        console.log('TOGGL_API_TOKEN environment variable is not set.');
        console.log('For development, it can be set in the .env file in the project root');
    }
    
    // TODO Try to read rc file
    
    // FIXME apiToken is not needed
    const apiToken = process.env.TOGGL_API_TOKEN;
        const client = togglClient();
        // const client = togglClient({ apiToken });
    // ? Why doesn't a try/catch block work?
    // try {
    //     const client = togglClient({ apiToken });
    // } catch (error) {
    //    console.error(error); 
    // }
    if (!client) {
        console.error('There was a problem');
        process.exit(1);
    }

    return client;
    
}

