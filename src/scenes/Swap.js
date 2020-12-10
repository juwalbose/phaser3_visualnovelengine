import Phaser from 'phaser'

//https://github.com/DragonBones/DragonBonesJS/blob/master/Phaser/Demos/src/ReplaceSlotDisplay.ts

//http://developer.egret.com/en/github/egret-docs/DB/dbLibs/replaceTexture/index.html

export default class Swap extends Phaser.Scene
{
	constructor()
	{
		super('Swap')
    }
    preload()
    {
        this.load.dragonbone(
            "Sam",
            "src/assets/Anims/SamSimple_tex.png",
            "src/assets/Anims/SamSimple_tex.json",
            "src/assets/Anims/SamSimple_ske.json"
        );

        this.load.dragonbone(
            "Lucy",
            "src/assets/Anims/Lucy_tex.png",
            "src/assets/Anims/Lucy_tex.json",
            "src/assets/Anims/Lucy_ske.json"
        );
        
        
    }

    create()
    {
       this.sam = this.add.armature("Sam", "Sam");//check 2 names in the ske json matches
       this.sam.x = 300;
       this.sam.y = 600;
       this.sam.scale=0.3;
       this.sam.animation.play();

       this.lucy = this.add.armature("Lucy", "Lucy");//check 2 names in the ske json matches
       this.lucy.x = 600;
       this.lucy.y = 600;
       this.lucy.scale=0.3;
       this.lucy.animation.play();

       this.factory = this.dragonbone.factory;

       this.input.on('pointerdown', () => {
            this.swapDisplay();  
        });
    }
    swapDisplay(){
        let newIndex=Phaser.Math.Between(0, 5);
        this.sam.armature.getSlot("Face").displayIndex = newIndex;
        this.lucy.armature.getSlot("Face").displayIndex = newIndex;
    }
}
