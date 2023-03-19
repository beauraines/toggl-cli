import Client from '../client.js'
import { convertUtcTime, formatDuration } from '../utils.js'
import dayjs from 'dayjs'
import debugClient from 'debug'
import Table from 'cli-table3'

const debug = debugClient('toggl-cli-ls');

export const command = 'ls'
export const desc = 'Lists recent time entries. Defaults to the last 14 days.'

export const builder = {
  d: { alias: ['days'], describe: 'The number of days to return.', type: 'number', demandOption: false, default: 14 }
}

export const handler = async function (argv) {
  debug(argv)
  const client = Client()
  const days = argv.days
  const timeEntries = await client.timeEntries.list({
	  start_date: dayjs().subtract(days, 'days').startOf('day').toISOString(),
	  end_date: dayjs().toISOString()
  })
  timeEntries.sort((a, b) => (a.start > b.start) ? 1 : -1)
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
    head: ['description', 'start', 'stop', 'duration']
  })
  for (const entry of report) {
    table.push([entry.description, entry.start, entry.stop, entry.duration])
  }
  console.log(table.toString())
  // console.table(report, ['description', 'start', 'stop', 'duration'])
}
