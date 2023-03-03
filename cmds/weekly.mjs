import Client from '../client.js'
import { getWorkspace, formatDuration, getProjectById } from '../utils.js'
import dayjs from 'dayjs'
import dur from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(relativeTime)
dayjs.extend(dur)

export const command = 'week'
// FIXME descriptions
export const desc = 'NOT WORKING in V9 Weekly project summary by day'
export const builder = {}

export const handler = async function (argv) {
  const client = Client()
  const workspace = await getWorkspace()
  // TODO check the date range because the dates aren't lining up properly
  // TODO THis should be filtered after the fact, because weekly will only provide a single week's data
  const params = { since: dayjs().startOf('week').toISOString() }
  const weeklyReport = await client.reports.weekly(workspace.id, params)
  // displayReportText(weeklyReport.data);
  // displayReportJson(weeklyReport.data);
  // console.log(weeklyReport.data)
  // console.table(weeklyReport.data,['title','totals'])
  // console.log(JSON.stringify(weeklyReport));

  const reportData = []
  // TODO weekly report is now an array not an opject
  // [
  //   {
  //     user_id: 530321,
  //     project_id: 174558624,
  //     seconds: [
  //          0,    0, 710,
  //       2266, 1380,   0,
  //        844
  //     ]
  //   },
  // ]
  // console.log(weeklyReport)
  for (const project of weeklyReport) {
    const currentProject = await getProjectById(workspace.id,project.project_id)
    const row = {
      projectName: currentProject.name 
    }
    // TODO compute each days time total
    for (let i = 0; i < project.seconds.length; i++) {
      const element = project.seconds[i]
      let date = dayjs().startOf('week').add(i, 'days').format('ddd MM-DD')
      const duration = element || 0
      row[date] = formatDuration(duration*1000)
    }
    reportData.push(row)
  }
  const totalRow = {
    projectName: 'Total'
    // projectId: '',
  }
  // TODO fix for updated structure
  // weeklyReport.week_totals
  // for (let i = 0; i < weeklyReport.week_totals.length; i++) {
  //   const element = weeklyReport.week_totals[i]
  //   let date = dayjs().startOf('week').add(i, 'days').format('ddd MM-DD')
  //   date = i == weeklyReport.week_totals.length - 1 ? 'Total' : date
  //   const duration = element || 0
  //   totalRow[date] = formatDuration(duration)
  // }
  reportData.push(totalRow)
  console.table(reportData)
}

// TODO figure out what to do with these
function displayReportJson (data) {
  const json = []
  data.map(project => {
    const startOfWeek = dayjs().startOf('week')
    project.totals.slice(0, 7).map((total, i) => {
      const duration = dayjs.duration(total, 'milliseconds').format('H[h] m[m]')
      const day = startOfWeek.add(i, 'days').format('YYYY-MM-DD')
      // i == 7 ? console.info(`\tTotal : ${duration}`) : console.info(`\t ${day} - ${duration}`);
      // TODO revise this format - maybe nested
      const entry = {
        project: project.title.project,
        date: day,
        duration,
        total
      }
      json.push(entry)
    })
  })
  console.log(JSON.stringify(json))
  console.table(json)
}

// TODO figure out what do to with these
function displayReportText (data) {
  data.map(project => {
    console.info(project.title.project)
    const startOfWeek = dayjs().startOf('week')
    project.totals.map((total, i) => {
      // TODO see https://runkit.com/6022b36c23da0600130851a0/6022b36c7614ed001ad11853 for formatting options
      const dur = dayjs.duration(total, 'milliseconds')
      const hours = (dur.days() * 24) + dur.hours()
      const duration = `${hours}h ${dur.minutes()}m `
      // let duration = `${hours}h ${dur.minutes()}m ${dur.seconds()}s`
      const day = startOfWeek.add(i, 'days').format('ddd MMM D')
      i == 7 ? console.info(`\tTotal : ${duration}`) : console.info(`\t ${day} - ${duration}`)
    })
  })
}
