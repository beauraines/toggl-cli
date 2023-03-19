import Client from '../client.js'
import { convertUtcTime, formatDuration } from '../utils.js'
import dayjs from 'dayjs'
import Table from 'cli-table3'

export const command = 'ls'
export const desc = 'Lists time entries'

export const builder = {

}

export const handler = async function (argv) {
  const client = Client()
  // TODO update these dates
  const timeEntries = await client.timeEntries.list({ start_date: dayjs().subtract(14, 'days').toISOString(), end_date: dayjs().toISOString() })
  timeEntries.sort((a,b) => (a.start > b.start) ? 1 : -1)
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
//TODO put these in reverse chronological order
  for (const entry of report) {
    table.push([entry.description, entry.start, entry.stop, entry.duration])
  }
  console.log(table.toString())
  // console.table(report, ['description', 'start', 'stop', 'duration'])
}
