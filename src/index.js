import Phaser from "phaser";
import dragonBones from "./lib/dragonBones";

import Preloader from './scenes/Preloader'
import Menu from './scenes/Menu'
import Load from './scenes/Load'
import Save from './scenes/Save'
import GameOver from './scenes/GameOver'
import GameWon from './scenes/GameWon'
import Novel from './scenes/Novel'
//https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/

const config = {
	type: Phaser.AUTO,
	width: 1920,
	height: 1080,
	disableContextMenu: true,
	plugins: {
        scene: [
            { key: "DragonBones", plugin: dragonBones.phaser.plugin.DragonBonesScenePlugin, mapping: "dragonbone" }    // setup DB scene plugin
        ]
    },
	scene: [Preloader,Menu,Load,Save,GameOver,GameWon,Novel],
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
	render: {
		//pixelArt: true
		antialias:true
	}
}
let game =new Phaser.Game(config);
export default game
