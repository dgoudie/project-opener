# project-opener
project-opener is a desktop app for helping developers launch their projects in their favorite IDEs very quickly.

![project-opener](https://cdn.goudie.dev/images/me/project-opener.gif)

This app will allow you to:
* Specify directories that will be scanned for projects
* Specify glob patterns that will be ignored when scanning
* Pick from a predetermined list of IDEs to use to open your project or specify your own
  * The app will scan common locations to find supported IDEs

The following project types are supported:
* NPM
* Maven
* Python (with a Pipenv file)
* Rust (with a cargo.toml file)

The following IDEs are natively supported:
* Jetbrains Intellij IDEA
* Visual Studio Code
* Jetbrains WebStorm

project-opener is:
* Built with React, Redux, Electron, & NeDB
* Packaged using electron-forge
* UI uses Microsoft's Fluent UI React library

## Running the app
`npm start`

## Packaging app
`npm run package`

## Building Installer
`npm run make`
