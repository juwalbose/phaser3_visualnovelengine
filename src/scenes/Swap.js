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
        /*
        this.load.dragonbone(
            "mecha_1004d",
            "src/assets/mecha_1004d_show/mecha_1004d_show_tex.png",
            "src/assets/mecha_1004d_show/mecha_1004d_show_tex.json",
            "src/assets/mecha_1004d_show/mecha_1004d_show_ske.json"
        );
        this.load.dragonbone(
            "weapon_1004",
            "src/assets/weapon_1004_show/weapon_1004_show_tex.png",
            "src/assets/weapon_1004_show/weapon_1004_show_tex.json",
            "src/assets/weapon_1004_show/weapon_1004_show_ske.json"
        );
        
        this.load.dragonbone(
            "MultiFaceTest",
            "src/assets/multiface/MultiFaceTest_tex.png",
            "src/assets/multiface/MultiFaceTest_tex.json",
            "src/assets/multiface/MultiFaceTest_ske.json"
        );

        this.load.dragonbone(
            "Sam",
            "src/assets/Anims/Sam_tex.png",
            "src/assets/Anims/Sam_tex.json",
            "src/assets/Anims/Sam_ske.json"
        );*/

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
        /*
        this.WEAPON_RIGHT_LIST = ["weapon_1004_r", "weapon_1004b_r", "weapon_1004c_r", "weapon_1004d_r", "weapon_1004e_r"];

        this._leftWeaponIndex = 0;
        this._rightWeaponIndex = 0;
        this._factory = null;
        this._armatureDisplay;
        this._logoText;

        this._factory = this.dragonbone.factory;

        this._armatureDisplay = this.add.armature("mecha_1004d", "mecha_1004d");
        this._armatureDisplay.animation.play();

        this.add.armature("weapon", "weapon_1004");
        //
        this._armatureDisplay.x = this.cameras.main.centerX + 100.0;
        this._armatureDisplay.y = this.cameras.main.centerY + 200.0;
        //
        this.input.on('pointerdown', () => {
            const localX = this.input.x - this._armatureDisplay.x;
            if (localX < -150.0)
                this._replaceDisplay(-1);
            else if (localX > 150.0)
                this._replaceDisplay(1);
            else
                this._replaceDisplay(0);
        });
        //
        console.log("Touch screen left / center / right to replace slot display.");
        */

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
    /*
    _replaceDisplay(type) {
        if (type === -1) {
            this._rightWeaponIndex++;
            this._rightWeaponIndex %= this.WEAPON_RIGHT_LIST.length;
            const displayName = this.WEAPON_RIGHT_LIST[this._rightWeaponIndex];
            this._factory.replaceSlotDisplay("weapon_1004", "weapon", "weapon_r", displayName, this._armatureDisplay.armature.getSlot("weapon_hand_r"));
        }
        else if (type === 1) {
            this._leftWeaponIndex++;
            this._leftWeaponIndex %= 5;
            this._armatureDisplay.armature.getSlot("weapon_hand_l").displayIndex = this._leftWeaponIndex;
        }
        else {
            const logoSlot = this._armatureDisplay.armature.getSlot("logo");
            if (logoSlot.display === this._logoText) {
                logoSlot.display = logoSlot.rawDisplay;
            }
            else {/*
                if (!this._logoText) {
                    // mix skew component into Text class (also if you want to use some customized display object you must mix skew component into it, too)
                    dragonBones.phaser.util.extendSkew(Phaser.GameObjects.Text);

                    const style = { fontSize: 30, color: "#FFFFFF", align: "center" };
                    this._logoText = this.add.text(0.0, 0.0, "Core Element", style);

                    this._logoText.setPipeline("PhaserTextureTintPipeline");  // and use this customized pipeline to support skew

                    this._logoText.setOrigin(.5, .5);
                }
                logoSlot.display = this._logoText;
            }
        }
    }*/
}
