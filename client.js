import dotenv from 'dotenv'
import togglClient from 'toggl-client'
import { config } from "@beauraines/node-helpers";
dotenv.config()
import debugClient from 'debug'
const debug = debugClient('toggl-cli-client')


export default async function () {
  const conf = await config.readConfig('.toggl-cli.json')
  debug(conf)

  const apiToken = conf.api_token || process.env.TOGGL_API_TOKEN
  debug(apiToken)

  let client
  try {
      client = togglClient({ apiToken });
  } catch (error) {
     console.error(error);
     console.error('There was a problem')
     process.exit(1)
   }

  return client
}


