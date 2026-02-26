import dotenv from 'dotenv'
import togglClient from 'toggl-client'
import chalk from 'chalk'
import { readConfig } from './config.js'
dotenv.config({quiet:true})
import debugClient from 'debug'
const debug = debugClient('toggl-cli-client')

const QUOTA_WARNING_THRESHOLD = 5

export default async function () {
  let  conf
  try {
    conf = await readConfig('.toggl-cli.json')
    debug(conf)
  } catch (error) {
    console.error('Using config from environment variables or create one with the create-config command')
  }

  const apiToken = process.env.TOGGL_API_TOKEN || conf?.api_token
  debug(apiToken)

  let client
  try {
      client = togglClient({ apiToken });
  } catch (error) {
     console.error(error.message);
     console.error('There was a problem')
     process.exit(1)
   }

  // Wrap request method to warn when API quota is running low
  const originalRequest = client.request.bind(client)
  client.request = async function (...args) {
    const result = await originalRequest(...args)
    if (client.quota && client.quota.remaining !== null && client.quota.remaining <= QUOTA_WARNING_THRESHOLD) {
      const minutes = client.quota.resetsIn ? Math.ceil(client.quota.resetsIn / 60) : '?'
      console.error(chalk.yellow(`\n⚠ API quota low: ${client.quota.remaining} requests remaining (resets in ~${minutes}m)`))
    }
    return result
  }

  return client
}
