import Client from '../client.js'
import { convertUtcTime, formatDuration } from '../utils.js'
import dayjs from 'dayjs'
import debugClient from 'debug'
import Table from 'cli-table3'

const debug = debugClient('toggl-cli-ls')

export const command = 'ls [searchStrings...]'
export const desc = 'Lists recent time entries. Defaults to the last 14 days.'

export const builder = {
  d: { alias: ['days'], describe: 'The number of days to return. Ignored if --today provided', type: 'number', demandOption: false, default: 14 },
  today: {describe: 'Only returns today\'s time entries. Overrides --days.', type: 'boolean', demandOption: false}
}

export const handler = async function (argv) {
  debug(argv)
  const client = await Client()
  const days = argv.today ? 0 : argv.days
  let timeEntries = await client.timeEntries.list({
    start_date: dayjs().subtract(days, 'days').startOf('day').toISOString(),
    end_date: dayjs().toISOString()
  })
  timeEntries.sort((a, b) => (a.start > b.start) ? 1 : -1)
  if (argv.searchStrings) {
    const searchString = argv.searchStrings.join(' ').toLowerCase()
    debug(searchString)
    timeEntries = timeEntries.filter(x => x.description.toLowerCase().includes(searchString))
  }

  const workspaces = await client.workspaces.list()
  const workspace = workspaces[0]
  debug('Workspace: ' + workspace.name)
  debug('id: ' + workspace.id)
  const projects = await client.workspaces.projects(workspace.id)

  const report = []
  timeEntries.forEach(element => {
    report.push(
      {
        description: element.description,
        project: projects.filter(p => p.id == element.project_id)[0]?.name,
        project_id: projects.filter(p => p.id == element.project_id)[0]?.id,
        start: convertUtcTime(element.start),
        stop: convertUtcTime(element.stop) == 'Invalid Date' ? 'Currently Running' : convertUtcTime(element.stop),
        duration: formatDuration(element.duration * 1000),
        id: element.id
      }
    )
  })

  const table = new Table({
    head: ['Description', 'Project', 'Start', 'Stop', 'Duration', 'Time Entry ID'],
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
    const entry = report[i]
    if (i === 0) {
      table.push([entry.description, entry.project, entry.start, entry.stop, entry.duration, entry.id].map((content) => ({ content, chars })))
    } else {
      table.push([entry.description, entry.project, entry.start, entry.stop, entry.duration, entry.id])
    }
  }
  console.log(table.toString())
}
