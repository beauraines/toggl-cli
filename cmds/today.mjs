import Client from '../client.js'
import chalk from 'chalk'
import dayjs from 'dayjs'
import { getWorkspace, getProjects, formatDuration, formatDurationAsTime } from '../utils.js'
import dur from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import Table from 'cli-table3'
dayjs.extend(relativeTime)
dayjs.extend(dur)

export const command = 'today'
export const desc = 'Reports today\'s activities by project'
export const builder = {}

export const handler = async function (argv) {
  const client = await Client()
  const workspace = await getWorkspace()
  const projects = await getProjects(workspace.id)
  const params = {
    start_date: dayjs().startOf('day').toISOString(),
    end_date: dayjs().toISOString()
  }

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
      duration_formatted: formatDuration(total * 1000),
      duration: formatDurationAsTime(total * 1000)
    })
  })

  // Compute total row
  const totalRow = {
    project_name: 'Total'
  }
  totalRow.seconds = report.reduce((total, project) => {
    return total + project.seconds
  }, 0)
  totalRow.duration_formatted = formatDuration(totalRow.seconds * 1000)
  totalRow.duration = formatDurationAsTime(totalRow.seconds * 1000)
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
      const table = new Table({
        head: ['Project', 'Duration'],
        chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
      })
      for (let i = 0; i < report.length; i++) {
        // First row chars
        const chars = {
          midMid: '┼',
          mid: '─',
          leftMid: '├',
          rightMid: '┤'
        }
        const project = report[i]
        if (i == 0) {
          table.push([project.project_name, project.duration_formatted].map((content) => ({ content: chalk.grey(content), chars })))
        } else if ( i == report.length - 1) {
          table.push([project.project_name, project.duration_formatted].map((content) => ( {content: chalk.bold(content), chars })))
        } else {
          table.push([chalk.grey(project.project_name), chalk.grey(project.duration_formatted)])
        }
      }
      console.log(table.toString())
      break
  }
}
