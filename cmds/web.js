const open = require('open')

exports.command = 'web'
exports.desc = 'Opens toggl track website with default browser'
exports.builder = {}
exports.handler = async function (argv) {
    let timerUrl = 'https://track.toggl.com/timer'
    console.log(`Opening ${timerUrl}`)
    open(timerUrl)
}