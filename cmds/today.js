import Client from '../client.js'
import dayjs from 'dayjs'
import utils from '../utils.js'
import dur from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.extend(dur)

export const command = 'today'
export const desc = 'Reports today\'s activities by project'
export const builder = {}

export const handler = async function (argv) {
  const client = Client()
  const workspace = await utils.getWorkspace()
  const projects = await utils.getProjects(workspace.id)
  const params = { start_date: dayjs().startOf('day').toISOString() }

  const timeEntries = await client.timeEntries.list(params)

  let todaysProjects = []
  timeEntries.map(e => {
    todaysProjects.push(e.pid)
  })
  todaysProjects = [...new Set(todaysProjects)]

  const report = []
  todaysProjects.map(p => {
    let total = 0
    timeEntries.filter(x => x.pid == p).map(e => {
      if (e.duration >= 0) {
        total += e.duration // UNLESS e.duration is less than zero - meaning currently running
      } else {
        const startTime = dayjs.unix(e.duration * -1)
        const duration = dayjs().diff(startTime, 's')
        total += duration
      }
    })
    const project = projects.find(x => x.id == p)
    report.push({
      project,
      project_name: project?.name,
      seconds: total,
      duration_formatted: utils.formatDuration(total * 1000),
      duration: utils.formatDurationAsTime(total * 1000)
    })
  })

  // Compute total row
  const totalRow = {
    project_name: 'Total'
  }
  totalRow.seconds = report.reduce((total, project) => {
    return total + project.seconds
  }, 0)
  totalRow.duration_formatted = utils.formatDuration(totalRow.seconds * 1000)
  totalRow.duration = utils.formatDurationAsTime(totalRow.seconds * 1000)
  report.push(totalRow)

  // TODO make format a CLI option
  const format = 'table' // csv | json | table defaults to table
  displayDailyReport(report, format)
}

// TODO should this be moved to a formatter file?
function displayDailyReport (report, format) {
  switch (format) {
    case 'csv':
      // TODO maybe use jsontocsv
      console.log(JSON.stringify(report))
      break
    case 'json':
      console.log(JSON.stringify(report))
      break
    case 'table':
    default:
      console.table(report, ['project_name', 'duration_formatted'])
      break
  }
}
