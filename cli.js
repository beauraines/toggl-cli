#!/usr/bin/env node

const yargs = require("yargs");




require('yargs/yargs')(process.argv.slice(2))
  .scriptName('toggl-node')
  .commandDir('cmds')
  .completion('completion','Outputs bash/zsh-completion shortcuts for commands and options to add to .bashrc or .bash_profile')
  .demandCommand()
  .help()
  .argv
