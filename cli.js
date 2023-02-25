#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { commands } from './cmds/index.mjs'

yargs(hideBin(process.argv))
  .scriptName('toggl')
  .completion('completion', 'Outputs bash/zsh-completion shortcuts for commands and options to add to .bashrc or .bash_profile')
  .command(commands)
  .demandCommand()
  .help()
  .parse()
