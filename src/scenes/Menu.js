import Phaser from 'phaser'

export default class Menu extends Phaser.Scene
{
	constructor()
	{
		super('Menu')
    }
    preload() {                              // override
      this.load.dragonbone(
        "Dragon",
        "src/assets/Dragon_tex.png",
        "src/assets/Dragon_tex.json",
        "src/assets/Dragon_ske.json",
    );
  }

  create() {                              // override
    const arm = this.add.armature("Dragon", "Dragon");
    arm.x = 600;
    arm.y = 800;
    arm.animation.play("walk");
  }
}