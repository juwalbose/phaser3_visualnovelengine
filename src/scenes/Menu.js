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
    this.viewManager.addToDisplayList(new DynamicScalePosItem(arm,0.9,0.8,1));

    //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ninepatch/
    let box=this.add.rexNinePatch({
      x: 0, y: 0,
      width: 1000, height: 300,
      key: 'ninepatch',
      columns: [20, undefined, 20],
      rows: [20, undefined, 20],
    });
    this.viewManager.addToDisplayList(new DynamicScalePosItem(box,0.5,0.3,1,true,true));

    //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/bbcodetext/
    let s1 = `What should I do[color=blue]??[/color]
    [i][b][color=red]FIGHT[/color]!![/b][/i]
    H[size=26]M[size=24]M[size=22]M[/size]
    [shadow]FLIGHT[/shadow]
    [color=white][stroke]DO NOTHING[/stroke]
    [stroke=blue]SOMETHING[/stroke]`;
    let text = this.add.rexBBCodeText(0, 0, s1, {
      backgroundColor: '#555',
      fontSize: '30px',
      //align: 'left',
      wrap: {
          mode: 'word',
          width: 500
      },

      stroke: 'red',
      strokeThickness: 1,
      shadow: {
          offsetX: 3,
          offsetY: 3,
          blur: 2,
          color: 'black'
      }
    });
    text.setOrigin(0.5,0);
    this.viewManager.addToDisplayList(new DynamicScalePosItem(text,0.5,0.5,2,true,false,true));

    //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/texttyping/
    var typing = this.plugins.get('rexTextTyping').add(text, {
      speed: 40,       // typing speed in ms
      //typeMode: 0,      //0|'left-to-right'|1|'right-to-left'|2|'middle-to-sides'|3|'sides-to-middle'
      //setTextCallback: function(text, isLastChar, insertIdx){ return text; }  // callback before set-text
      //setTextCallbackScope: null
    });
    typing.start(s1);
    

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