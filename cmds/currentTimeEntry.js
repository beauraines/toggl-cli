const Client = require('../client');
const utils = require('../utils');
const dayjs = require('dayjs');
let utc = require('dayjs/plugin/utc')
let timezone = require('dayjs/plugin/timezone') 
dayjs.extend(utc);
dayjs.extend(timezone);


exports.command = 'now'
exports.desc = 'Displays the current running time entry'
exports.builder = {}
exports.handler = async function (argv) {

    let client = new Client();
    let currentTimeEntry = await client.timeEntries.current();
    await utils.displayTimeEntry(currentTimeEntry);
}



