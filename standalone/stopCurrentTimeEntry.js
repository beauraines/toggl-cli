const togglClient = require('toggl-client');
const dayjs = require('dayjs');
var duration = require('dayjs/plugin/duration')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(duration);
require('dotenv').config()

const client = togglClient();

async function main() {
    currentTimeEntry = await client.timeEntries.current();
    // TODO check if there is actually something to stop
    stopped =  await client.timeEntries.stop(currentTimeEntry.id);

    let duration = dayjs.duration({seconds: stopped.duration}).humanize();
    console.log(`Stopped ${stopped.description} after ${duration}`);

}


main()