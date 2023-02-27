import open from 'open'

export const command = 'web'
export const desc = 'Opens toggl track website with default browser, defaults to the timer page'
export const builder = {
  t: { alias: ['timer'], describe: 'opens the timer page ', requiresArg: false },
  r: { alias: ['reports'], describe: 'opens the reports page ', requiresArg: false  },

}

export const handler = async function (argv) {
  let baseUrl = 'https://track.toggl.com'
  let pageUrl
  if ( argv.timer) {
    pageUrl = 'timer' 
  } else if ( argv.reports) {
    pageUrl = 'reports' 
  } else {
    pageUrl = 'timer'
  }
  console.log(`Opening ${baseUrl}/${pageUrl}`)
  open(`${baseUrl}/${pageUrl}`)
}
