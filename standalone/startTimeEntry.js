const togglClient = require('toggl-client');
const dayjs = require('dayjs');
const yargs = require("yargs");
const utils = require('../utils');
require('dotenv').config()


const client = togglClient();

const options = yargs
 .usage("Usage: $0 -p <project_id> -w <workspace_id> [time entry description]")
 .option("p", { alias: "projectId", describe: "project id", type: "string", demandOption: false })
 .option("w", { alias: "workspaceId", describe: "workspace id", type: "number", demandOption: false })
 .argv;

async function main() {
    console.debug(JSON.stringify(options));
    // TODO validate options
    let description = options._.join(' ');
    // TODO check that description was provided or provide a default
    let params = {description};
    params.workspaceId = utils.defaultWorkspaceId;
    params.projectId = utils.defaultProjectId;;
    console.debug(params);
    timeEntry = await createTimeEntry(params);
    console.info(`Started ${timeEntry.description}`);
}

async function createTimeEntry(params) {
    const client = Client();
    timeEntry = await client.timeEntries.create(
        {
            description: params.description,
            wid: params.workspaceId,
            pid: params.projectId,
            start: dayjs().toISOString(),
            duration: -1 * dayjs().unix(),
            created_with: 'My app',
            at: dayjs().toISOString()
        }
    );
    return timeEntry
}


main()