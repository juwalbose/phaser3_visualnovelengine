import Phaser from 'phaser'
import DynamicScalePosItem from '../components/DynamicScalePosItem';

export default class Menu extends Phaser.Scene
{
	constructor()
	{
	super('Menu')
  }

  init(data){
    if(data!=undefined){
        
        if(data.viewManager!=undefined){
            this.viewManager=data.viewManager;
        }
    }
}

  preload() {                              // override
      this.load.dragonbone(
        "Dragon",
        "src/assets/Dragon_tex.png",
        "src/assets/Dragon_tex.json",
        "src/assets/Dragon_ske.json",
    );
    this.load.image('bg', 'src/assets/images/test_bg.jpg');
  }

  create() {   

    this.bg=this.add.image(0,0,'bg');
    this.viewManager.addToDisplayList(new DynamicScalePosItem(this.bg,0.5,0.5));

    this.arm = this.add.armature("Dragon", "Dragon");
    this.arm.animation.play("walk");
    this.viewManager.addToDisplayList(new DynamicScalePosItem(this.arm,0.8,0.8,0.5));

    this.scale.on('resize',this.resizeResponder,this);

    this.scale.on('orientationchange', this.orientationResponder,this);

    this.resize();
  }
  resize(){
    this.viewManager.resizeAndLayout(window.innerWidth,window.innerHeight);
  }
  resizeResponder(gameSize, baseSize, displaySize, resolution){
    this.resize();
  }
  orientationResponder(orientation){
    if (orientation === Phaser.Scale.PORTRAIT) {
      //console.log('portrait');
    } else if (orientation === Phaser.Scale.LANDSCAPE) {
      //console.log('landscape');
    }
    this.resize();
  }
}