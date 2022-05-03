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
    // displayReportText(weeklyReport.data);
    // displayReportJson(weeklyReport.data);
    console.log(weeklyReport.data)
    console.table(weeklyReport.data,['title','totals'])

}

async function getWorkspace() {
    const client = Client();
    workspaces = await client.workspaces.list();
    return workspaces[0];
}



// We need to get the data shaped like
// which happens to be very much like displayReportText() is doing
// except its writing to the console instead of an object

// {
//     "Project 1": {
//         "2022-01-01": 1100,
//         "2022-01-02": 1100,
//         "2022-01-03": 1100,
//         "2022-01-04": 1100,
//         "2022-01-05": 1100
//     },
//     "Worked": {
//         "2022-01-01": 1100,
//         "2022-01-02": 1100,
//         "2022-01-03": 1100,
//         "2022-01-04": 1100,
//         "2022-01-05": 1100
//     }
// }

// Then console.table() will work "nicely"

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
                duration: duration,
                total: total
            }
            json.push(entry);
        });
    });
    console.log(JSON.stringify(json));
    console.table(json);
} 

function displayReportText(data) {
    data.map(project => {
        console.info(project.title.project);
        let startOfWeek = dayjs().startOf('week');
        project.totals.map((total, i) => {
            // TODO see https://runkit.com/6022b36c23da0600130851a0/6022b36c7614ed001ad11853 for formatting options
            var dur = dayjs.duration(total, 'milliseconds');
            var hours = (dur.days() * 24) + dur.hours()
            let duration = `${hours}h ${dur.minutes()}m `
            // let duration = `${hours}h ${dur.minutes()}m ${dur.seconds()}s`
            let day = startOfWeek.add(i, 'days').format('ddd MMM D');
            i == 7 ? console.info(`\tTotal : ${duration}`) : console.info(`\t ${day} - ${duration}`);
        });
    });
}
