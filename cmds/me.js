const dayjs = require('dayjs');
const Client = require('../client');

exports.command = 'me'
exports.desc = 'Displays the current user'
exports.builder = {}
exports.handler = async function (argv) {

    const client = Client();
    currentUser = await client.user.current();
    // console.log(currentUser.data);

    console.log(`Default workspace: ${currentUser.data.default_wid}`);
    console.log(`API Token: ${currentUser.data.api_token}`);
    console.log(`Fullname: ${currentUser.data.fullname}`);
    console.log(`Timezone: ${currentUser.data.timezone}`);
    console.log(`Date format: ${currentUser.data.date_format}`);
    console.log(`jquery date format: ${currentUser.data.jquery_date_format}`);
    console.log(`jquery_timeofday_format: ${currentUser.data.jquery_timeofday_format}`);

    const weekStart = dayjs().day(currentUser.data.beginning_of_week).format('dddd');
    console.log(`beginning_of_week: ${weekStart}`);
        
// Api token: 
// Beginning of week: Sunday
// Date format: MM/DD/YYYY
// Default workspace: beau.raines's workspace (#403916)
// Fullname: Beau Raines
// Image url: https://assets.track.toggl.com/avatars/913dfa76c01d730711eb00a1c3e6d57c.jpg
// Language: en_US
// Send timer notifications: True
// Timeofday format: 12-hour
// Timezone: America/Los_Angeles
// Workspace: beau.raines's workspace (#403916)
    
    let workspaces = currentUser.data.workspaces.map(w=>w.name).join(", ");
    console.log('')
    console.log(`Workspaces: ${workspaces}`);
    let since = dayjs.unix(currentUser.since);
    console.log('')
    console.log(`Toggl user since ${since}`);



}



