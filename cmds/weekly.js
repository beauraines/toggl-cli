const Client = require('../client');
const dayjs = require('dayjs');
var dur = require('dayjs/plugin/duration')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(dur);


exports.command = 'week'
exports.desc = 'Weekly project summary by day'
exports.builder = {}
exports.handler = async function (argv) {
    const client = Client();
    let workspace = await getWorkspace();
    let params = { since: dayjs().startOf('week').toISOString() };
    weeklyReport = await client.reports.weekly(workspace.id,params);
    displayReportText(weeklyReport.data);
    // displayReportJson(weeklyReport.data);
}

async function getWorkspace() {
    const client = Client();
    workspaces = await client.workspaces.list();
    return workspaces[0];
}


function displayReportJson(data) {
    let json = []
    data.map(project => {
        let startOfWeek = dayjs().startOf('week');
        project.totals.slice(0,7).map((total, i) => {
            let duration = dayjs.duration(total, 'milliseconds').format('H[h] m[m]');
            let day = startOfWeek.add(i, 'days').format('YYYY-MM-DD');
            // i == 7 ? console.info(`\tTotal : ${duration}`) : console.info(`\t ${day} - ${duration}`);
            // TODO revise this format - maybe nested
            let entry = {
                project: project.title.project,
                date: day,
                duration: duration
            }
            json.push(entry);
        });
    });
    console.log(JSON.stringify(json));
} 

function displayReportText(data) {
    data.map(project => {
        console.info(project.title.project);
        let startOfWeek = dayjs().startOf('week');
        project.totals.map((total, i) => {
            // TODO see https://runkit.com/6022b36c23da0600130851a0/6022b36c7614ed001ad11853 for formatting options
            let duration = dayjs.duration(total, 'milliseconds').format('H[h] m[m]');
            let day = startOfWeek.add(i, 'days').format('ddd MMM D');
            i == 7 ? console.info(`\tTotal : ${duration}`) : console.info(`\t ${day} - ${duration}`);
        });
    });
}
