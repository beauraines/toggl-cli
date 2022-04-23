const togglClient = require('toggl-client');
const client = togglClient();
require('dotenv').config()

async function main() {
    workspaces = await client.workspaces.list();
    console.log(workspaces);
}

main()


