# TODO

- How to get env vars working inside react

  - locally: from .env - DONE?
  - on prod: from github secrets/variables

  - TODO still:
  - add vars and secrets to github
  - push, deploy and test (can I login, does app work against /RecordStore path, can I make an API call)

- remove build:development script

  - package.json
  - deploy.yml

- remove log(penv)

- push to github
  - revert db version to 1

## Possible Changes?

- link button to include after ">" ?
- Spotify Track backup ?

## Improvements to App

- Restore

  - Allow the users to restore this data to their spotify account?

- prevent backup process interruption

  - navigation warning on route change during backup process so backup process isn't interrupted
