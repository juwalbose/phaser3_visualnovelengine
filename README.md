# Introduction
A very simple Visual Novel Engine using DragonBones with Phaser 3 while using Webpack and ES6.

[SEE LIVE DEMO HERE](https://juwalbose.github.io/phaser3_visualnovelengine/)

# EDITOR
A desktop app to create the story json which drives this engine is being worked on.

## FEATURES

| sl | Feature |
|---------|-------------|
|1| Single json file drives the entire novel |
|2| Syntax within the json to drive necessary story actions |
|3| Show narrator & character dialogs |
|4| Branch to labels ad needed of based on choices |
|5| Display and process 6 choices |
|6| Dragon Bones based non mesh animated character support |
|7| Switching character face based on mood instructions in json |
|8| Track, update, check & display game variables all using the json syntax |
|9| Load various locations |
|10| Support landscape and portrait modes. Responsively adjust to resizing |
|11| Auto save progress to local storage. Restart where left off |
|12| XOR encrypted save data |
|13| Face switching technique can be extended to dressing up the characters |
|14| Simple inventory with item popup & ability to check for item |

Note: This is a fork of the phaser3-project-template repository.
## Phaser 3 Webpack Project Template

A Phaser 3 project template with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds.

Loading images via JavaScript module `import` is also supported.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Uses

Phaser 3 https://phaser.io/
Phaser 3 rex plugins https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/
Dragon bones for Phaser 3 https://github.com/DragonBones/DragonBonesJS/tree/master/Phaser
Phaser 3 Dragon Bones integration https://github.com/RaheelYawar/phaser3-webpack-dragonbones 