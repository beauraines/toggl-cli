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

  const params = { } // Leave this for future options, like rounding
  const weeklyReport = await client.reports.weekly(workspace.id,params)

  const reportData = []
  const totals = [0, 0, 0, 0, 0, 0, 0] // ? Is there a better way to do this?
  for (const project of weeklyReport) {
    const currentProject = await getProjectById(workspace.id, project.project_id)
    const row = {
      projectName: currentProject.name
    }

    for (let i = 0; i < project.seconds.length; i++) {
      const element = project.seconds[i]
      const date = dayjs().startOf('week').add(i, 'days').format('ddd MM-DD')
      const duration = element || 0
      row[date] = formatDuration(duration * 1000)
      totals[i] += duration
    }
    reportData.push(row)
  }

  const totalRow = {
    projectName: 'Total'
  }

  for (let i = 0; i < totals.length; i++) {
    const seconds = totals[i]
    const date = dayjs().startOf('week').add(i, 'days').format('ddd MM-DD')
    totalRow[date] = formatDuration(seconds * 1000)
  }
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
