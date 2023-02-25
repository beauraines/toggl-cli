#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { commands } from './cmds/index.mjs'
import { projects } from './cmds/projects/index.mjs'
import { workspaces } from './cmds/workspaces/index.mjs'

yargs(hideBin(process.argv))
  .scriptName('toggl')
  .completion('completion', 'Outputs bash/zsh-completion shortcuts for commands and options to add to .bashrc or .bash_profile')
  .command(commands)
  // FIXME this should be nested
  .command(projects)
  .command(workspaces)
  .demandCommand()
  .help()
  .parse()
