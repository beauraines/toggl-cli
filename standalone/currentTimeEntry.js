import togglClient from 'toggl-client'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
dotenv.config()

// WIthout any options, it will read the TOGGL_API_TOKEN from the env
const client = togglClient()

async function main () {
  const currentTimeEntry = await client.timeEntries.current()

  // TODO - improve the output
  console.info(currentTimeEntry)
}

main()
