const Client = require('./client');
const dayjs = require('dayjs');
const appName = require('./package.json').name

// TODO read from file or GET /me
exports.defaultWorkspaceId = process.env.TOGGL_DEFAULT_WORKSPACE_ID;

// TODO read from file or ENV
exports.defaultProjectId = process.env.TOGGL_DEFAULT_PROJECT_ID;

exports.getProjects = async function(workspaceId) {
    const client = Client();
    let projects = await client.workspaces.projects(workspaceId);
    let activeProjects = projects.filter(x => x.active)
    return activeProjects;
}

exports.getWorkspace = async function() {
    const client = Client();
    let workspaces = await client.workspaces.list();
    return workspaces[0];
}

exports.getProjectByName = async function(workspaceId,string) {
    const client = Client();
    let projects = await client.workspaces.projects(workspaceId);
    return projects.find(x=>x.name.toLowerCase().includes(string.toLowerCase()));
}

exports.getProjectById = async function(workspaceId,projectId) {
    const client = Client();
    let projects = await client.workspaces.projects(workspaceId);
    return projects.find(x=>x.id == projectId);
}

exports.createTimeEntry = async function (params) {
    const client = Client();

    timeEntry = await client.timeEntries.create(
        {
            description: params.description,
            wid: params.workspaceId,
            pid: params.projectId,
            start: dayjs().toISOString(),
            duration: -1 * dayjs().unix(),
            created_with: appName,
            at: dayjs().toISOString()
        }
    );
    return timeEntry
}

/**
 * 
 * @param {number} milliseconds , if negative the time entry is assumed to be running
 * @returns {string} duration formatted as 25h 32m where duration greater than a day displays
 * total hours
 */
 exports.formatDuration = function (milliseconds) {
    if (milliseconds < 0 ) {
        let seconds = milliseconds/1000;
        let startTime = dayjs.unix(seconds*-1);
        let duration = dayjs().diff(startTime,'s');
        return dayjs.duration(duration*1000).format('H[h] m[m]');
    }
    var dur = dayjs.duration(milliseconds);
    var hours = (dur.days() * 24) + dur.hours();
    let duration = `${hours}h ${dur.minutes()}m`;
    return duration;
}

/**
 * 
 * @param {number} milliseconds 
 * @returns {String} the duration formatted as H:mm:ss
 */
 exports.formatDurationAsTime = function (milliseconds) {
    return dayjs.duration(milliseconds).format('H:mm:ss');
}

/**
 * Formats a dateTime to YYYY-MM-DD HH:mm
 * @param {Date} dateTime 
 * @returns {String}
 */
 exports.convertUtcTime = function(dateTime) {
    let tz = process.env.TOGGL_TIMEZONE || 'America/New_York';
    return dayjs(dateTime).tz(tz).format('YYYY-MM-DD HH:mm');
}

exports.appName = appName;

/**
 * Displays a time entry on the console
 * @param {TimeEntry} timeEntry 
 */
exports.displayTimeEntry = async function(timeEntry) {
    if (!timeEntry) {
        console.log('There is no time entry running!');
    } else {
        console.info(`${timeEntry.description} #${timeEntry.id}`);
        console.info(`Billable: ${timeEntry.billable}`);

        // TODO this should be abstracted for reuse
        let startTime = dayjs.unix(timeEntry.duration*-1);
        let duration = dayjs().diff(startTime,'s');
        let durationFormatted = dayjs.duration(duration*1000).format('H[h] m[m]');

        console.info(`Duration: ${durationFormatted}`);

        let projects =  await this.getProjects(timeEntry.wid);
        let project = projects.find(x=> x.id == timeEntry.pid);

        console.info(`Project: ${project?.name} (#${timeEntry.pid})`);
        
        let tz = process.env.TOGGL_TIMEZONE || 'America/New_York';
        let startTimeFormatted = dayjs(timeEntry.start).tz(tz).format('YYYY-MM-DD HH:mm');
        let stopTimeFormatted = timeEntry.stop ? dayjs(timeEntry.stop).tz(tz).format('YYYY-MM-DD HH:mm') : '' ;

        console.info(`Start: ${startTimeFormatted}`); 
        console.info(`Stop: ${stopTimeFormatted}`); // This will always be blank for the current entry, but will be useful for a time entry 
        // console.info(`Tags: `); // Not going to include these in the near term
        // console.info(`Task: `); // Not going to include these in the near term

        let workspace = await this.getWorkspace();
        console.info(`Workspace: ${workspace.name} (#${timeEntry.wid})`);
    }
     
}