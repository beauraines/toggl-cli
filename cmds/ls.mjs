import Client from '../client.js'
// import utils from '../utils.js' // FIXME The requested module '../utils.js' does not provide an export named 'default'

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
        start: element.start, // utils.convertUtcTime(element.start),  // FIXME Temporarily not using utils
        stop: element.stop, // utils.convertUtcTime(element.stop), // FIXME Temporarily not using utils
        duration: element.duration * 1000// utils.formatDuration(element.duration * 1000) // FIXME Temporarily not using utils
      }
    )
  })

  console.table(report, ['description', 'start', 'stop', 'duration'])
}
