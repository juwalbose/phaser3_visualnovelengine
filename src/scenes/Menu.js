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
    this.load.image('ninepatch', 'src/assets/images/ninepatch.png');
  }

  create() {   

    let bg=this.add.image(0,0,'bg');
    this.viewManager.addToDisplayList(new DynamicScalePosItem(bg,0.5,0.5));

    let arm = this.add.armature("Dragon", "Dragon");
    arm.animation.play("walk");
    this.viewManager.addToDisplayList(new DynamicScalePosItem(arm,0.5,0.5,1));

    //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ninepatch/
    let box=this.add.rexNinePatch({
      x: 0, y: 0,
      width: 1000, height: 300,
      key: 'ninepatch',
      columns: [20, undefined, 20],
      rows: [20, undefined, 20],
    });
    this.viewManager.addToDisplayList(new DynamicScalePosItem(box,0.5,0.3,1,true));

    this.scale.on('resize',this.resizeResponder,this);
    this.scale.on('orientationchange', this.orientationResponder,this);

    this.resize();
  }
  resize(){
    //this.scale.stopFullscreen();
    this.viewManager.resizeAndLayout(window.innerWidth,window.innerHeight);
    //this.scale.startFullscreen();
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