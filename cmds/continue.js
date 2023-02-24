const Client = require('../client');
const utils = require('../utils');
const dayjs = require('dayjs')

exports.command = 'continue [description]'
exports.desc = `Continues an existing time entry. If description is included it will search for the most`+
    `recent entry including that description. If no description is provided, the most recent entry will be restarted.`
exports.builder = {
    description: {
        describe: 'The time entry to continue',
        type: 'string'
    }
    //   -s, --start DATETIME  Sets a start time.
}
exports.handler = async function (argv) {
    let client = Client();
    let timeEntries = await client.timeEntries.list(
        {
            start_date:dayjs().subtract(14,'days').toISOString(),
            end_date:dayjs().toISOString()
        }
    );  // Gets time entries for last 14 days, up to 1000 entries
    let matchingTimeEntry;
    switch (argv.description) {
        case undefined:
            matchingTimeEntry = timeEntries.slice(-1)[0];
            break;
        default:
            let searchName = argv.description.toLowerCase();
            matchingTimeEntry = timeEntries.find(x=>x.description.toLowerCase().includes(searchName));
            break;
    }

    let params = {
        projectId: matchingTimeEntry?.pid,
        workspaceId: matchingTimeEntry?.wid,
        description: matchingTimeEntry?.description || 'no description',
        billable: matchingTimeEntry?.billable,
        dur: matchingTimeEntry?.dur
    }
    
    if (matchingTimeEntry ) {
        let timeEntry = await utils.createTimeEntry(params);
        let project = await utils.getProjectById(timeEntry.wid,timeEntry.pid)
        console.info(`Continued ${timeEntry?.description} for project ${project?.name}`);
    } else {
        console.info('No matching time entry found!');
    }

}



