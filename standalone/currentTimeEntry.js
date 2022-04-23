const togglClient = require('toggl-client');
const dayjs = require('dayjs');
require('dotenv').config()

// WIthout any options, it will read the TOGGL_API_TOKEN from the env
const client = togglClient();

async function main() {
    currentTimeEntry = await client.timeEntries.current();

    // TODO - improve the output
    console.info(currentTimeEntry);
}


main()