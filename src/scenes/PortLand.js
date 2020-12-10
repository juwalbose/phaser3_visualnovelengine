import Phaser from 'phaser'

export default class PortLand extends Phaser.Scene
{
	constructor()
	{
		super('PortLand')
    }
    init(data){
      if(data!=undefined){
          if(data.viewManager!=undefined){
              this.viewManager=data.viewManager;
          }
          if(data.storyManager!=undefined){
            this.storyManager=data.storyManager;
        }
      }
    }
    preload()
    {
      this.load.image('bg', 'src/assets/images/supermarket_bg.jpg');
      this.load.image('ninepatch', 'src/assets/images/ninepatch.png');  
      this.load.dragonbone(
        "Sam",
        "src/assets/Anims/SamSimple_tex.png",
        "src/assets/Anims/SamSimple_tex.json",
        "src/assets/Anims/SamSimple_ske.json"
      );
    }

    create()
    {
      this.currentOrientation="landscape";

      let itemTypeEnum = {background:"background",character:"character",choice:"choice", dialog:"dialog"};
      
      this.viewManager.addToDisplayList(this.add.image(0,0,'bg'),itemTypeEnum.background);
      
      this.sam = this.add.armature("Sam", "Sam");
      this.sam.animation.play();
      this.viewManager.addToDisplayList(this.sam,itemTypeEnum.character);


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

      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/texttyping/
      var typing = this.plugins.get('rexTextTyping').add(text, {
        speed: 40,       // typing speed in ms
        //typeMode: 0,      //0|'left-to-right'|1|'right-to-left'|2|'middle-to-sides'|3|'sides-to-middle'
        //setTextCallback: function(text, isLastChar, insertIdx){ return text; }  // callback before set-text
        //setTextCallbackScope: null
      });
      typing.start(s1);

      this.viewManager.addToDisplayList(text,itemTypeEnum.dialog);

      let numChoices=5;

      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ninepatch/
      for (let index = 0; index < numChoices; index++) {
        let box=this.add.rexNinePatch({x: 0, y: 0,width: 100, height: 100,key: 'ninepatch',
          columns: [20, undefined, 20],
          rows: [20, undefined, 20],
        });
        this.viewManager.addToDisplayList(box,itemTypeEnum.choice);
      }

      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/zone/
      var zone = this.add.zone(300, 400, 200, 200).setInteractive({ useHandCursor: true}).on('pointerdown',this.zoneCallback);
      

      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/quest/ //incremental choice progression
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/fsm/ //finite shate machine
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/flash/ flash effect
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shake-position/ //shake effect
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/ //various UI 
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/restorabledata/ //key value data store
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/xor/ //xor string encryption
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/ //ui dialog box with choice buttons
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-sizer/ //sizer for layout

      this.input.on('pointerdown', this.handleMousePress, this);
      this.scale.on('orientationchange', this.orientationResponder,this);
      
      this.resize();

      this.storyManager.nextStep();
    }

    handleMousePress (pointer) {
      if(this.storyManager.makingChoice){
        let choice=Phaser.Math.Between(0, 1);
        this.storyManager.makeChoice(choice);
      }else{
        this.storyManager.nextStep();
      }
    }
    zoneCallback(){
      console.log('zone');
    }
   

    resize(){
      if(window.innerWidth>window.innerHeight){
        this.currentOrientation="landscape";
        this.scale.setGameSize(this.viewManager.designSize.width, this.viewManager.designSize.height);
      }else{
        this.currentOrientation="portrait";
        this.scale.setGameSize(this.viewManager.designSize.height, this.viewManager.designSize.width);
      }
      this.viewManager.resizeAndLayout(this.currentOrientation);
      this.scale.on('resize',this.resizeResponder,this);
    }
    resizeResponder(gameSize, baseSize, displaySize, resolution){
      this.scale.off('resize',this.resizeResponder,this);
      this.resize();
    }
    orientationResponder(orientation){
      if (orientation === Phaser.Scale.PORTRAIT) {
        //this.currentOrientation="portrait";
      } else if (orientation === Phaser.Scale.LANDSCAPE) {
        //this.currentOrientation="landscape";
      }
      this.scale.off('resize',this.resizeResponder,this);
      this.resize();
    }
}