import togglClient from 'toggl-client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import dotenv from 'dotenv'
dayjs.extend(relativeTime)
dayjs.extend(duration)
dotenv.config()

const client = togglClient()

async function main () {
  const currentTimeEntry = await client.timeEntries.current()
  // TODO check if there is actually something to stop
  const stopped = await client.timeEntries.stop(currentTimeEntry.id)

  const duration = dayjs.duration({ seconds: stopped.duration }).humanize()
  console.log(`Stopped ${stopped.description} after ${duration}`)
}

main()
