const Client = require('../client');
const dayjs = require('dayjs');
const utils = require('../utils');
var dur = require('dayjs/plugin/duration')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(dur);

exports.command = 'today'
exports.desc = 'Reports today\'s activities by project'
exports.builder = {}
exports.handler = async function (argv) {
    const client = Client();
    let workspace = await utils.getWorkspace();
    let projects = await utils.getProjects(workspace.id);
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
                let duration = dayjs().diff(startTime,'s');
                total+=duration;
            }
        })
        let project = projects.find(x=> x.id == p);
        report.push({
            project,
            project_name: project.name,
            seconds: total,
            duration_formatted:  utils.formatDuration(total*1000),
            duration:  utils.formatDurationAsTime(total*1000)
        });
    })
    // TODO make format a CLI option
    let format = 'table'; // csv | json | table defaults to table
    displayDailyReport(report,format);


}

// TODO should this be moved to a formatter file?
function displayDailyReport(report,format) {
    switch (format) {
        case 'csv':
            // TODO maybe use jsontocsv
            console.log(JSON.stringify(report));
            break;
        case 'json':
            console.log(JSON.stringify(report));
            break;
        case 'table':
        default:
            console.table(report,['project_name','duration_formatted']);
            break;
    }
    
    
}

