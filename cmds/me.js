const dayjs = require('dayjs');
const Client = require('../client');
const utils = require('../utils');

exports.command = 'me'
exports.desc = 'Displays the current user'
exports.builder = {}
exports.handler = async function (argv) {

    const client = Client();
    currentUser = await client.user.current();

    console.log(`Default workspace: ${currentUser.default_workspace_id}`);
    console.log(`API Token: ${currentUser.api_token}`);
    console.log(`Fullname: ${currentUser.fullname}`);
    console.log(`Timezone: ${currentUser.timezone}`);
    // These look like they come from the `/preferences` endpoint
    // console.log(`Date format: ${currentUser.date_format}`);
    // console.log(`jquery date format: ${currentUser.jquery_date_format}`);
    // console.log(`jquery_timeofday_format: ${currentUser.jquery_timeofday_format}`);

    const weekStart = dayjs().day(currentUser.beginning_of_week).format('dddd');
    console.log(`beginning_of_week: ${weekStart}`);
        
   
    let workspaces = (await client.workspaces.list()).map(w=>w.name).join(", ");
    console.log('')
    console.log(`Workspaces: ${workspaces}`);
    let since = dayjs.unix(currentUser.since);
    console.log('')
    console.log(`Toggl user since ${since}`);


}



