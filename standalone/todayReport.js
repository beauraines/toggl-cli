import togglClient from 'toggl-client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import dotenv from 'dotenv'
dayjs.extend(relativeTime)
dayjs.extend(duration)
dotenv.config()

const client = togglClient()

async function getWorkspace () {
  const workspaces = await client.workspaces.list()
  return workspaces[0]
}

async function main () {
  const workspace = await getWorkspace()
  const params = { start_date: dayjs().startOf('day').toISOString() }

  const timeEntries = await client.timeEntries.list(params)

  // [
  //     {
  //       id: 2463026053,
  //       guid: 'dba205a234d78492f3f7510c0c00b790',
  //       wid: 403916,
  //       pid: 174558624,
  //       billable: false,
  //       start: '2022-04-22T17:38:27+00:00',
  //       stop: '2022-04-22T18:07:50+00:00',
  //       duration: 1763,
  //       description: 'recommendations',
  //       duronly: false,
  //       at: '2022-04-22T18:07:51+00:00',
  //       uid: 530321
  //     },
  //     {
  //       id: 2463068736,
  //       guid: 'e9a444f99da3a09de1f16d242546e18e',
  //       wid: 403916,
  //       pid: 174558624,
  //       billable: false,
  //       start: '2022-04-22T18:16:01+00:00',
  //       stop: '2022-04-22T18:33:44+00:00',
  //       duration: 1063,
  //       description: 'profile updates',
  //       duronly: false,
  //       at: '2022-04-22T18:33:44+00:00',
  //       uid: 530321
  //     }
  //   ]

  console.log(timeEntries)
  let projects = []
  timeEntries.map(e => {
    console.log(`${e.start} ${e.description}  ${e.duration}`)
    // find unique projects
    projects.push(e.pid)
    // filter for each project
    // reduce() or _.groupBy() or groupBy()
    // sum duration
    // 2022-04-22T18:53:24+00:00 Time tracking - cli  52
    // 2022-04-22T18:54:15+00:00 Time tracking - cli  225
    // 2022-04-22T18:58:00+00:00 MCP All Hands  3191
    // 2022-04-22T19:56:37+00:00 Time tracking - cli  303
    // 2022-04-22T20:01:39+00:00 Time tracking - cli  -1650657699
  })
  projects = [...new Set(projects)]

  const foo = []
  projects.map(p => {
    let total = 0
    timeEntries.filter(x => x.pid == p).map(e => {
      if (e.duration >= 0) {
        total += e.duration // UNLESS e.duration is less than zero - meaning currently running
      } else {
        const startTime = dayjs.unix(e.duration * -1)
        console.log(`computed ${startTime}`)
        console.log(`timeentry.start ${e.start}`)
        const duration = dayjs().diff(startTime, 's')
        total += duration
      }
    })
    foo.push({ [p]: total })
  })
  console.log(foo)

  console.log(timeEntries[0])
  console.log(timeEntries[timeEntries.length - 1])

  // ! Not supported in Node
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy
  // let result = timeEntries.groupBy( ({ pid }) => pid );
  // console.log(result);

  // displayReportText(weeklyReport.data);
  // displayReportJson(weeklyReport.data);
}

main()
