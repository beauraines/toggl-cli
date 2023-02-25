import togglClient from 'toggl-client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'

import dotenv from 'dotenv'
dayjs.extend(relativeTime)
dayjs.extend(duration)

const client = togglClient()
dotenv.config()
async function getWorkspace () {
  const workspaces = await client.workspaces.list()
  return workspaces[0]
}

async function main () {
  const workspace = await getWorkspace()
  const params = { since: dayjs().startOf('week').toISOString() }
  const weeklyReport = await client.reports.weekly(workspace.id, params)
  displayReportText(weeklyReport.data)
  // displayReportJson(weeklyReport.data);
}

main()

function displayReportJson (data) {
  const json = []
  data.map(project => {
    const startOfWeek = dayjs().startOf('week')
    project.totals.slice(0, 7).map((total, i) => {
      const duration = dayjs.duration(total, 'milliseconds').format('H[h] m[m]')
      const day = startOfWeek.add(i, 'days').format('YYYY-MM-DD')
      // i == 7 ? console.info(`\tTotal : ${duration}`) : console.info(`\t ${day} - ${duration}`);
      // TODO revise this format - maybe nested
      const entry = {
        project: project.title.project,
        date: day,
        duration
      }
      json.push(entry)
    })
  })
  console.log(JSON.stringify(json))
}

function displayReportText (data) {
  data.map(project => {
    console.info(project.title.project)
    const startOfWeek = dayjs().startOf('week')
    project.totals.map((total, i) => {
      const duration = dayjs.duration(total, 'milliseconds').format('H[h] m[m]')
      const day = startOfWeek.add(i, 'days').format('ddd MMM D')
      i == 7 ? console.info(`\tTotal : ${duration}`) : console.info(`\t ${day} - ${duration}`)
    })
  })
}
