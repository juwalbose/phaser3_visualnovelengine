import Phaser from 'phaser'
import DialogText from '../components/DialogText';
import Choice from '../components/Choice';

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
      this.load.image('bluebase', 'src/assets/images/bluebase.png');    
      this.load.dragonbone(
        "Sam",
        "src/assets/Anims/Sam_tex.png",
        "src/assets/Anims/Sam_tex.json",
        "src/assets/Anims/Sam_ske.json"
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

      this.dialog = new DialogText(this,0,0,500,'bluebase','46');
      this.add.existing(this.dialog);
      this.viewManager.addToDisplayList(this.dialog,itemTypeEnum.dialog);

      let numChoices=5;
      for (let index = 0; index < numChoices; index++) {
        let choice = new Choice(this,0,0,500,'bluebase','40');
        this.add.existing(choice);
        choice.setText(`[shadow][stroke=blue]Some random text with choice no.[/stroke][/shadow]`+index);
        this.viewManager.addToDisplayList(choice,itemTypeEnum.choice);
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

      //let timedEvent = this.time.delayedCall(1000, this.clearChoices, [], this);
      this.time.delayedCall(3000, this.sayDialog(), [], this);
    }
    sayDialog(){
      let s1 = `[shadow][stroke=blue]Some random text which I am writing here to test this dialog box. Does this work?
What should I do[color=blue]??[/color][i][b][color=red]FIGHT[/color]!![/b][/i]H[size=45]M[size=40]M[size=35]M[/size]FLIGHT[color=white] DO NOTHING SOMETHING[/stroke][/shadow]`;
      this.dialog.say(s1);
    }
    clearChoices(arg){
      this.viewManager.clearChoiceList();
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