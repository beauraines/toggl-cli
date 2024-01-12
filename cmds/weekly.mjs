import Client from '../client.js'
import chalk from 'chalk'
import { getWorkspace, formatDuration, getProjectById } from '../utils.js'
import dayjs from 'dayjs'
import debugClient from 'debug';
import dur from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import Table from 'cli-table3'
dayjs.extend(relativeTime)
dayjs.extend(dur)

const debug = debugClient('toggl-cli-week');


export const command = 'week'
// FIXME descriptions
export const desc = 'Weekly project summary by day'
export const builder = {
  p: { alias: ['previous','prior'], describe: 'Return the prior week\'s data', type: 'boolean', demandOption: false, requiresArg: false}
}

export const handler = async function (argv) {
  const client = await Client()
  const workspace = await getWorkspace()

  const weekOffset = argv.previous ? 1 : 0
  const startDate = dayjs().startOf('week').subtract(weekOffset,'weeks')

  const params = {
    start_date: startDate.format('YYYY-MM-DD')
  }

  const weeklyReport = await client.reports.weekly(workspace.id, params)
  debug(weeklyReport)
  const reportData = []
  const totals = [0, 0, 0, 0, 0, 0, 0] // ? Is there a better way to do this?
  for (const project of weeklyReport) {
    const currentProject = await getProjectById(workspace.id, project.project_id)
    debug(currentProject)
    const row = {
      "Project Name": currentProject ? currentProject.name : 'No Project',
      Total: 0
    }

    for (let i = 0; i < project.seconds.length; i++) {
      const element = project.seconds[i]
      const date = startDate.add(i, 'days').format('ddd MM-DD')
      const duration = element || 0
      row[date] = formatDuration(duration * 1000)
      totals[i] += duration // for use with a daily total row
      row.Total += duration // accumulate the projects weekly total
    }
    reportData.push(row)
  }

  const totalRow = {
    projectName: 'Total',
    Total: 0
  }

  for (let i = 0; i < totals.length; i++) {
    const seconds = totals[i]
    const date = startDate.add(i, 'days').format('ddd MM-DD')
    totalRow[date] = formatDuration(seconds * 1000)
    totalRow.Total += seconds // accumulate the projects weekly total
  }
  reportData.push(totalRow)

  for (const project of reportData) {
    project.Total = formatDuration(project.Total * 1000)
  }

  const head = Object.keys(reportData[0])
  const table = new Table({
    head,
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
  })
  for (let i = 0; i < reportData.length; i++) {
    // First row chars
    const chars = {
      midMid: '┼',
      mid: '─',
      leftMid: '├',
      rightMid: '┤'
    }
    const project = reportData[i]
    if (i == 0 ) {
      table.push(Object.values(project).map((content) => ({ content: chalk.grey(content), chars })))
    } else if ( i == reportData.length - 1) {
      table.push(Object.values(project).map((content) => ( {content: chalk.bold(content), chars })))
    } else {
      table.push(Object.values(project).map((content) => ({ content: chalk.grey(content) })))
    }
  }
  console.log(table.toString())
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
