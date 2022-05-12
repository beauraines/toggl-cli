const credentials=require('./credentials.js');
const homedir = require('os').homedir();

let properties = ['TOGGL_API_TOKEN','TOGGL_DEFAULT_WORKSPACE_ID','TOGGL_TIMEZONE'];

let creds = credentials.getCredentials(`${homedir}/.toggl.json`,properties);

exports.defaultWorkspaceId = process.env.TOGGL_DEFAULT_WORKSPACE_ID || creds.TOGGL_DEFAULT_WORKSPACE_ID;
exports.defaultProjectId = process.env.TOGGL_DEFAULT_PROJECT_ID || creds.TOGGL_DEFAULT_PROJECT_ID || null;
exports.apiToken = process.env.TOGGL_DEFAULT_PROJECT_ID || creds.TOGGL_API_TOKEN;
exports.timeZone = process.env.TOGGL_TIMEZONE || creds.TOGGL_TIMEZONE  || 'America/New_York';;
