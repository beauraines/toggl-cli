import Client from '../client.js'
import { convertUtcTime, formatDuration } from '../utils.js'
import dayjs from 'dayjs'
import debugClient from 'debug'
import Table from 'cli-table3'

const debug = debugClient('toggl-cli-ls')

export const command = 'ls [searchStrings...]'
export const desc = 'Lists recent time entries. Defaults to the last 14 days.'

export const builder = {
  d: { alias: ['days'], describe: 'The number of days to return.', type: 'number', demandOption: false, default: 14 }
}

export const handler = async function (argv) {
  debug(argv)
  const client = Client()
  const days = argv.days
  let timeEntries = await client.timeEntries.list({
    start_date: dayjs().subtract(days, 'days').startOf('day').toISOString(),
    end_date: dayjs().toISOString()
  })
  timeEntries.sort((a, b) => (a.start > b.start) ? 1 : -1)
  if (argv.searchStrings) {
    const searchString = argv.searchStrings.join(' ')
    debug(searchString)
    timeEntries = timeEntries.filter(x => x.description.includes(searchString))
  }
  const report = []
  timeEntries.forEach(element => {
    report.push(
      {
        description: element.description,
        start: convertUtcTime(element.start),
        stop: convertUtcTime(element.stop),
        duration: formatDuration(element.duration * 1000)
      }
    )
  })

  const table = new Table({
    head: ['Description', 'Start', 'Stop', 'Duration'],
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
      table.push([entry.description, entry.start, entry.stop, entry.duration].map((content) => ({ content, chars })))
    } else {
      table.push([entry.description, entry.start, entry.stop, entry.duration])
    }
  }
  console.log(table.toString())
}
