import { createConfig } from '../config.js'
import debugClient from 'debug';

const debug = debugClient('toggl-cli-create-config');

export const command = 'create-config'
export const desc = 'Creates a boilerplate .toggl-cli.json configuration file in your home directory.'
export const builder = {}

export const handler = async function (argv) {
    const configProps = [ 
        "api_token",
        "default_workspace_id",
        "timezone",
        "default_project_id"
    ]

    let configFile
    try {
        configFile = await createConfig('.toggl-cli.json',configProps)
        console.log(`Configuration file written to ${configFile} in your home directory`)
        console.log(`Edit with your user information from Toggl.`)
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }

}