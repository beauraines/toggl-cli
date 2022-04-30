const Client = require('../client');
const dayjs = require('dayjs');
var dur = require('dayjs/plugin/duration')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(dur);

exports.command = 'today'
exports.desc = 'Reports today\'s activities by project'
exports.builder = {}
exports.handler = async function (argv) {
    const client = Client();
    let workspace = await getWorkspace();
    let projects = await getProjects(workspace.id);
    let params = { start_date: dayjs().startOf('day').toISOString() };


    timeEntries = await client.timeEntries.list(params);

    let todaysProjects = [];
    timeEntries.map(e => {
        todaysProjects.push(e.pid);
    })
    todaysProjects = [...new Set(todaysProjects)];

    let report = []
    todaysProjects.map(p =>{
        let total=0;
        timeEntries.filter(x => x.pid == p).map(e =>{
            if (e.duration >= 0) {
                total+=e.duration; // UNLESS e.duration is less than zero - meaning currently running
            } else {
                let startTime = dayjs.unix(e.duration*-1);
                console.log(`computed ${startTime}`);
                console.log(`timeentry.start ${e.start}`);
                let duration = dayjs().diff(startTime,'s');
                total+=duration;
            }
        })
        let project = projects.find(x=> x.id == p);
        report.push({
            ...project,
            seconds: total,
            duration_formatted:  dayjs.duration(total*1000).format('H[h] m[m]'),
            duration:  dayjs.duration(total*1000).format('H:mm:ss')
        });
    })
    console.log(report);


}

// TODO these should move to some utility
async function getWorkspace() {
    const client = Client();
    workspaces = await client.workspaces.list();
    return workspaces[0];
}

// TODO these should move to some utility
async function getProjects(workspaceId) {
    const client = Client();
    projects = await client.workspaces.projects(workspaceId);
    // TODO what is this magic number 56426359
    let activeProjects = projects.filter(x => x.active && x.cid == 56426359 )
    return activeProjects;
}

