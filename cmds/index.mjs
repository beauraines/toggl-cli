import * as ls from './ls.mjs'
import * as me from './me.mjs'
import * as continueEntry from './continue.mjs'
import * as current from './currentTimeEntry.mjs'
import * as workspace from './workspace.mjs'
import * as projects from './projects.mjs'
import * as edit from './edit.mjs'
import * as web from './web.mjs'
import * as startTimeEntry from './startTimeEntry.mjs'
import * as stopTimeEntry from './stopTimeEntry.mjs'
import * as addTimeEntry from './addTimeEntry.mjs'
import * as removeTimeEntry from './removeTimeEntry.mjs'
import * as today from './today.mjs'
import * as weekly from './weekly.mjs'
import * as createConfig from './create-config.mjs'
import * as quota from './quota.mjs'
export const commands = [
  continueEntry,
  current,
  edit,
  ls,
  me,
  projects,
  quota,
  startTimeEntry,
  stopTimeEntry,
  addTimeEntry,
  removeTimeEntry,
  today,
  web,
  weekly,
  workspace,
  createConfig
]
