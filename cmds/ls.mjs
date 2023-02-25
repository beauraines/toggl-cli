import Client from '../client.js'
import { convertUtcTime, formatDuration } from '../utils.js'

export const command = 'ls'
export const desc = 'Lists time entries'

export const builder = {

}

export const handler = async function (argv) {
  const client = Client()
  const timeEntries = await client.timeEntries.list()

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
