const Client = require('../client');
const dayjs = require('dayjs');
var dur = require('dayjs/plugin/duration')
var relativeTime = require('dayjs/plugin/relativeTime');
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
    // console.log(weeklyReport.data)
    // console.table(weeklyReport.data,['title','totals'])
    // console.log(JSON.stringify(weeklyReport));

    let reportData = []
    weeklyReport.data.map(project=>{
        let row = {
            projectName: project.title.project,
            projectId: project.pid
        }
        for (let i = 0; i < project.totals.length; i++) {
            const element = project.totals[i];
            let date = dayjs().startOf('week').add(i,'days').format('ddd MM-DD');
            // TODO this should not be a magic number
            date = i==7 ? 'Total' : date;
            let duration = element ? element :0 ;
            row[date] = dayjs.duration(duration).format('H[h] m[m]'); // TODO convert from milliseconds to duration
        }
        reportData.push(row);
    })
    let totalRow = {
        projectName: 'Total',
        projectId: '',
    }
    weeklyReport.week_totals
    for (let i = 0; i < weeklyReport.week_totals.length; i++) {
        const element = weeklyReport.week_totals[i];
        let date = dayjs().startOf('week').add(i,'days').format('ddd MM-DD');
        // TODO this should not be a magic number
        date = i==7 ? 'Total' : date;
        let duration = element ? element :0 ;
        totalRow[date] = dayjs.duration(duration).format('H[h] m[m]'); // TODO convert from milliseconds to duration
    }
    reportData.push(totalRow);
    console.table(reportData);
}

async function getWorkspace() {
    const client = Client();
    workspaces = await client.workspaces.list();
    return workspaces[0];
}



// TODO figure out what to do with these
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

// TODO figure out what do to with these
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
