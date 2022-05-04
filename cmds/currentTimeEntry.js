const Client = require('../client');
const utils = require('../utils');
const dayjs = require('dayjs');
let utc = require('dayjs/plugin/utc')
let timezone = require('dayjs/plugin/timezone') 
dayjs.extend(utc);
dayjs.extend(timezone);


exports.command = 'now'
exports.desc = 'Displays the current running time entry'
exports.builder = {}
exports.handler = async function (argv) {

    client = new Client();
    currentTimeEntry = await client.timeEntries.current();
    // TODO - improve the output
    await displayTimeEntry(currentTimeEntry);
}


async function displayTimeEntry(timeEntry) {
    
    console.info(`${timeEntry.description} #${timeEntry.id}`);
    console.info(`Billable: ${timeEntry.billable}`);

    // TODO this should be abstracted for reuse
    let startTime = dayjs.unix(timeEntry.duration*-1);
    let duration = dayjs().diff(startTime,'s');
    let durationFormatted = dayjs.duration(duration*1000).format('H[h] m[m]');

    console.info(`Duration: ${durationFormatted}`);

    let projects =  await utils.getProjects(timeEntry.wid);
    let project = projects.find(x=> x.id == timeEntry.pid);

    console.info(`Project: ${project?.name} (#${timeEntry.pid})`);
    
    let tz = process.env.TOGGL_TIMEZONE || 'America/New_York';
    let startTimeFormatted = dayjs(timeEntry.start).tz(tz).format('YYYY-MM-DD HH:mm');
    console.log(startTimeFormatted);

    console.info(`Start: ${startTimeFormatted}`); 
    console.info(`Stop: `); // This will always be blank for the current entry, but will be useful for a time entry 
    // console.info(`Tags: `); // Not going to include these in the near term
    // console.info(`Task: `); // Not going to include these in the near term

    let workspace = await utils.getWorkspace();
    console.info(`Workspace: ${workspace.name} (#${timeEntry.wid})`); 
}

