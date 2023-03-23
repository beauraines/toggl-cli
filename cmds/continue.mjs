import Client from '../client.js'
import { createTimeEntry, getProjectById } from '../utils.js'
import dayjs from 'dayjs'

export const command = 'continue [description]'

export const desc = 'Continues an existing time entry. If description is included it will search for the most' +
    'recent entry including that description. If no description is provided, the most recent entry will be restarted.'

export const builder = {
  description: {
    describe: 'The time entry to continue',
    type: 'string'
  }
  //   -s, --start DATETIME  Sets a start time.
}

export const handler = async function (argv) {
  const client = Client()
  const timeEntries = await client.timeEntries.list(
    {
      start_date: dayjs().subtract(14, 'days').toISOString(),
      end_date: dayjs().toISOString()
    }
  ) // Gets time entries for last 14 days, up to 1000 entries

  // Sort to guarantee its most recent to oldest)
  timeEntries.sort((a, b) => dayjs(b.start).toDate() - dayjs(a.start).toDate())

  let matchingTimeEntry
  switch (argv.description) {
    case undefined:
      matchingTimeEntry = timeEntries[0]
      break
    default:
      { const searchName = argv.description.toLowerCase()
        matchingTimeEntry = timeEntries.find(x => x.description.toLowerCase().includes(searchName)) }
      break
  }

  const params = {
    projectId: matchingTimeEntry?.pid,
    workspaceId: matchingTimeEntry?.wid,
    description: matchingTimeEntry?.description || 'no description',
    billable: matchingTimeEntry?.billable,
    dur: matchingTimeEntry?.dur
  }

  if (matchingTimeEntry) {
    const timeEntry = await createTimeEntry(params)
    const project = await getProjectById(timeEntry.wid, timeEntry.pid)
    console.info(`Continued ${timeEntry?.description} for project ${project?.name}`)
  } else {
    console.info('No matching time entry found!')
  }
}
