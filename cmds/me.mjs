import dayjs from 'dayjs'
import Client from '../client.js'

export const command = 'me'
export const desc = 'Displays the current user'
export const builder = {}

export const handler = async function (argv) {
  const client = await Client()
  const currentUser = await client.user.current()
  // console.log(currentUser);

  console.log(`Default workspace: ${currentUser.default_workspace_id}`)
  console.log(`API Token: ${currentUser.api_token}`)
  console.log(`Fullname: ${currentUser.fullname}`)
  console.log(`Timezone: ${currentUser.timezone}`)
  // TODO These look like they come from the `/preferences` endpoint
  // console.log(`Date format: ${currentUser.date_format}`);
  // console.log(`jquery date format: ${currentUser.jquery_date_format}`);
  // console.log(`jquery_timeofday_format: ${currentUser.jquery_timeofday_format}`);

  const weekStart = dayjs().day(currentUser.beginning_of_week).format('dddd')
  console.log(`beginning_of_week: ${weekStart}`)

  // Api token:
  // Beginning of week: Sunday
  // Date format: MM/DD/YYYY
  // Default workspace: beau.raines's workspace (#403916)
  // Fullname: Beau Raines
  // Image url: https://assets.track.toggl.com/avatars/913dfa76c01d730711eb00a1c3e6d57c.jpg
  // Language: en_US
  // Send timer notifications: True
  // Timeofday format: 12-hour
  // Timezone: America/Los_Angeles
  // Workspace: beau.raines's workspace (#403916)

  const workspaces = (await client.workspaces.list()).map(w => w.name).join(', ')
  console.log('')
  console.log(`Workspaces: ${workspaces}`)
  const since = dayjs(currentUser.created_at)
  console.log('')
  console.log(`Toggl user since ${since}`)
}
