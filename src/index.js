import Phaser from "phaser";
import dragonBones from "./lib/dragonBones";
import NinePatchPlugin from 'phaser3-rex-plugins/plugins/ninepatch-plugin.js';
import TextTypingPlugin from 'phaser3-rex-plugins/plugins/texttyping-plugin.js';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';
import XORPlugin from 'phaser3-rex-plugins/plugins/xor-plugin.js';


import Preloader from './scenes/Preloader'
import Menu from './scenes/Menu'
import Load from './scenes/Load'
import Save from './scenes/Save'
import GameOver from './scenes/GameOver'
import GameWon from './scenes/GameWon'
import Novel from './scenes/Novel'
import Swap from './scenes/Swap'
import PortLand from './scenes/PortLand'


const config = {
	type: Phaser.AUTO,
	width: '100%',//enable for Test.js
	height: '100%',
	//width: '1920',
	//height: '1080',
	disableContextMenu: true,
	backgroundColor:'#cccccc',
	parent:'index',
	plugins: {
		global: [
			{
				key: 'rexXOR',
				plugin: XORPlugin,
				start: true
			},
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
	scene: [Preloader,Menu,Load,Save,GameOver,GameWon,Novel,Swap,PortLand],
	scale: {
		//mode: Phaser.Scale.RESIZE//enable this for Test.js
		mode: Phaser.Scale.FIT
    },
	render: {
		//pixelArt: true
		antialias:true
	}
}
let game =new Phaser.Game(config);
export default game
