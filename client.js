import dotenv from 'dotenv'
import togglClient from 'toggl-client'
import { readConfig } from './config.js'
dotenv.config({quiet:true})
import debugClient from 'debug'
const debug = debugClient('toggl-cli-client')


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

  return client
}


