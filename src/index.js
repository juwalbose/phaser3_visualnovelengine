import Phaser from "phaser";
import dragonBones from "./lib/dragonBones";
import NinePatchPlugin from 'phaser3-rex-plugins/plugins/ninepatch-plugin.js';
import TextTypingPlugin from 'phaser3-rex-plugins/plugins/texttyping-plugin.js';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';
import XORPlugin from 'phaser3-rex-plugins/plugins/xor-plugin.js';


import Preloader from './scenes/Preloader'
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
	scene: [Preloader,Novel],
	scale: {
		mode: Phaser.Scale.FIT
    },
	render: {
		//pixelArt: true
		antialias:true
	}
}
let game =new Phaser.Game(config);
export default game
