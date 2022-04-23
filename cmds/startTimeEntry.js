const Client = require('../client');
const dayjs = require('dayjs');

exports.command = 'start [options] [description]'
exports.desc = 'Starts a time entry'
exports.builder = {
    description: {
        describe: 'Time entry name',
        type: "string:"
    },
    p: { alias: "projectId", describe: "project id", type: "string", demandOption: false },
    // TODO default to default workspace
    w: { alias: "workspaceId", describe: "workspace id", type: "number", demandOption: false }
}
exports.handler = async function (argv) {

    // console.info(`${argv.$0} ${argv._.join(' ')} - this command is not yet supported.`);

    console.debug(JSON.stringify(argv));
    // TODO validate options
    // TODO check that description was provided or provide a default
    let params = {};
    params.description = argv.description || 'no description';
    params.workspaceId = 403916;
    params.projectId = 174558624;
    console.debug(params);
    let timeEntry // = await createTimeEntry(params);
    console.info(`Started ${timeEntry?.description}`);
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
