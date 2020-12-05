import Phaser from "phaser";
import dragonBones from "./lib/dragonBones";
import NinePatchPlugin from 'phaser3-rex-plugins/plugins/ninepatch-plugin.js';
import TextTypingPlugin from 'phaser3-rex-plugins/plugins/texttyping-plugin.js';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';


import Preloader from './scenes/Preloader'
import Menu from './scenes/Test'
import Load from './scenes/Load'
import Save from './scenes/Save'
import GameOver from './scenes/GameOver'
import GameWon from './scenes/GameWon'
import Novel from './scenes/Novel'


const config = {
	type: Phaser.AUTO,
	width: '100%',
	height: '100%',
	disableContextMenu: true,
	backgroundColor:'#cccccc',
	parent:'index',
	plugins: {
		global: [
			{
				key: 'rexBBCodeTextPlugin',
				plugin: BBCodeTextPlugin,
				start: true
			},
			{
				key: 'rexTextTyping',
				plugin: TextTypingPlugin,
				start: true
			},
			{
				key: 'rexNinePatchPlugin',
				plugin: NinePatchPlugin,
				start: true
			}
		],
        scene: [
            { key: "DragonBones", plugin: dragonBones.phaser.plugin.DragonBonesScenePlugin, mapping: "dragonbone" }    // setup DB scene plugin
        ]
	},
	input: {
        activePointers: 1
    },
	scene: [Preloader,Menu,Load,Save,GameOver,GameWon,Novel],
	scale: {
		mode: Phaser.Scale.RESIZE
    },
	render: {
		//pixelArt: true
		antialias:true
	}
}
let game =new Phaser.Game(config);
export default game
