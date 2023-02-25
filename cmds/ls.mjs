import Client from '../client.js'
import { convertUtcTime, formatDuration } from '../utils.js'
import dayjs from 'dayjs'

export const command = 'ls'
export const desc = 'Lists time entries'

export const builder = {

}

export const handler = async function (argv) {
  const client = Client()
  // TODO update these dates
  const timeEntries = await client.timeEntries.list({start_date:dayjs().subtract(14,'days').toISOString(),end_date:dayjs().toISOString()});

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

  console.table(report, ['description', 'start', 'stop', 'duration'])
}
