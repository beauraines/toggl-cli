# toggl-node

toggl cli written in node, based on TogglCli project. Attempting to use similiar syntax.

## Configuration

add your `TOGGL_API_TOKEN` to your environment. Eventually this will read from a config file too.
## Dependencies

## To DO

- config file ?
  - default workspace?
  - API key?
  - display formats?
- format now output
```
Time tracking - cli #2462957088
Billable: False
Duration: 0:00:42
Project: Worked (#174558624)
Start: 9:41:22 AM 04/22/2022
Stop: 
Tags: 
Task: 
Workspace: beau.raines's workspace (#403916)

```
- update running time entry
  - description
  - project
- adjust running time entry start time
  - adjust for overlapping
- "report" today by project
  - based on Time Entry API, not Report API
- summary report data
  - open ended time frame
- add cli support

## Limitations

Things I don't use

1. tags
2. multiple workspaces
3. billable

## How to Contribute
