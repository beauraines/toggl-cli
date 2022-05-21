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
 * @param {number} milliseconds 
 * @returns {string} duration formatted as 25h 32m where duration greater than a day displays
 * total hours
 */
 exports.formatDuration = function (milliseconds) {
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