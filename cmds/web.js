import open from 'open'

export const command = 'web'
export const desc = 'Opens toggl track website with default browser'
export const builder = {}

export const handler = async function (argv) {
  const timerUrl = 'https://track.toggl.com/timer'
  console.log(`Opening ${timerUrl}`)
  open(timerUrl)
}
