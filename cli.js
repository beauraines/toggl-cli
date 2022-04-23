#!/usr/bin/env node

const yargs = require("yargs");




require('yargs/yargs')(process.argv.slice(2))
  .scriptName('toggl')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv
