const Client = require('../client');
const utils = require('../utils');
const dayjs = require('dayjs');
let utc = require('dayjs/plugin/utc')
let timezone = require('dayjs/plugin/timezone'); 
const { duration } = require('dayjs');
const yargs = require('yargs');
dayjs.extend(utc);
dayjs.extend(timezone);


exports.command = 'edit'
exports.desc = 'Edits the current running time entry'
exports.builder = {
    d: {alias:["description"], describe: 'Time entry name',type: "string:"},
    p: { alias: ["projectId","project"], describe: "The case insensitive project name or project id.", type: "string", demandOption: false },
    s: { alias: ["start","startTime"], describe: "The case insensitive project name or project id.", type: "string", demandOption: false },
    e: { alias: ["end","endTime"], describe: "The case insensitive project name or project id.", type: "string", demandOption: false },
}

exports.handler = async function (argv) {
    if ( ! (argv.d || argv.p || argv.s || argv.e)) {
        console.error('At least one option must be provided, description, project, start or end')
        yargs.help();
        yargs.exit(1, new Error('At least one option must be provided, description, project, start or end'))
    }
    client = new Client();
    currentTimeEntry = await client.timeEntries.current();

    let params = {};

    params.wid = utils.defaultWorkspaceId;
    let project;
    if (argv.projectId) {
        if(isNaN(argv.projectId)) {
            project = await utils.getProjectByName(params.wid,argv.projectId)
         } else {
            project = await utils.getProjectById(params.wid,argv.projectId)
         }
    }

    let startTime,endTime;
    if (dayjs(argv.startTime).isValid()) {
        startTime = argv.startTime
    } else {
        // Parse the time and set it based upon the current time
        startTime = parseTime(argv.startTime);
    }

    if (dayjs(argv.endTime).isValid()) {
        endTime = argv.endTime
    } else {
        // Parse the time and set it based upon the current time
        endTime = parseTime(argv.endTime);
    }

    params.created_with = utils.appName;
    params.at = dayjs().toISOString();
    project ? params.pid = project.id : undefined
    startTime ? params.start = startTime.toISOString() : undefined
    endTime ? params.stop = endTime.toISOString() : undefined
    endTime ? params.duration = endTime.diff(startTime,'seconds') : undefined
    argv.description ? params.description = argv.description : undefined

    let timeEntry = await client.timeEntries.update(currentTimeEntry.id,params);
    await utils.displayTimeEntry(timeEntry);



}

/**
 * Parses a timelike string into a dayjs object of the current date and that time
 * @param {string} timeString timelike string e.g. 4:50PM '12:00 AM' etc.
 * @returns {object} dayjs object
 */
function parseTime(timeString) {
    let h, m;
    // Assumes time in format 4:50 PM
    let time = timeString.split(':', 2);
    h = time[0];
    m = time[1].match(/[0-9]+/)[0];
    if (timeString.match(/PM/i) && h <=12 ) {
        // + in front of string converts to a number, cool!
        h = +h + 12;
    }
    return dayjs().hour(h).minute(m).second(0);
}
