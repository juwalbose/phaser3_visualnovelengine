import Phaser from 'phaser'
import DialogText from '../components/DialogText';
import Choice from '../components/Choice';
import ViewManager from '../utils/ViewManager';
import StoryManager from '../utils/StoryManager';
import NameTag from '../components/NameTag';
import ItemBox from '../components/ItemBox';

export default class Novel extends Phaser.Scene
{
	constructor()
	{
		super('Novel')
    }
    
    create()
    {
      let jData=this.cache.json.get('story');
      this.storyManager = new StoryManager(this, jData);
      if(this.storyManager.parseLoadAndInitStory(true)){//enable disable logging parsing data
          let jDataNew=this.cache.json.get('data');
          this.viewManager = new ViewManager(this,jDataNew);
          console.log("Story data validated!");
      }else{
        console.log("Story data validation failed!");
        return;
      }
      
      
      this.currentOrientation="landscape";
      this.viewManager.characterOnScene=false;
      this.viewManager.characterOnLeft=false;

      this.onSceneCharacters={};

      let itemTypeEnum = {background:"background",character:"character",choice:"choice", dialog:"dialog",dialogWick:"dialogWick",nameTag:"nameTag",item:'item'};
    
      this.bg=this.add.sprite(0,0,this.storyManager.gameLocations[Object.keys(this.storyManager.gameLocations)[0]].cfName);
      this.viewManager.addToDisplayList(this.bg,itemTypeEnum.background);
      
      for (var key of Object.keys(this.storyManager.gameCharacters)) {
        let armature=this.add.armature(this.storyManager.gameCharacters[key].cfName,this.storyManager.gameCharacters[key].cfName);
        armature.animation.play();
        this.viewManager.addToDisplayList(armature,itemTypeEnum.character,this.storyManager.gameCharacters[key].height);
        this.onSceneCharacters[this.storyManager.gameCharacters[key].cfName]={model:armature,name:this.storyManager.gameCharacters[key].name};
        armature.visible=false;
      }

      this.dialog = new DialogText(this,0,0,500,'dialogbase','46');
      this.add.existing(this.dialog);
      this.viewManager.addToDisplayList(this.dialog,itemTypeEnum.dialog);
      this.dialog.visible=false;

      this.talkWick=this.add.sprite(0,0,'theme','say');
      this.viewManager.addToDisplayList(this.talkWick,itemTypeEnum.dialogWick);
      this.thinkWick=this.add.sprite(0,0,'theme','think');
      this.viewManager.addToDisplayList(this.thinkWick,itemTypeEnum.dialogWick);
      this.thinkWick.visible=false;
      this.talkWick.visible=false;

      this.nameTag=new NameTag(this,0,0,500,'dialogbase','40');
      this.add.existing(this.nameTag);
      this.viewManager.addToDisplayList(this.nameTag,itemTypeEnum.nameTag);
      this.nameTag.visible=false;

      this.maxChoices=6;
      for (let index = 0; index < this.maxChoices; index++) {
        this["choice"+index] = new Choice(this,0,0,500,'dialogbase','40',index);
        this.add.existing(this["choice"+index]);
        this["choice"+index].setText(`[shadow][stroke=blue]Some random text with choice no.[/stroke][/shadow]`+index);
        this.viewManager.addToDisplayList(this["choice"+index],itemTypeEnum.choice);
        this["choice"+index].visible=false;
      }

      this.itemBox=new ItemBox(this,0,0,500,'dialogbase');
      this.add.existing(this.itemBox);
      this.viewManager.addToDisplayList(this.itemBox,itemTypeEnum.item);
      this.itemBox.visible=false;

      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/quest/ //incremental choice progression
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/fsm/ //finite shate machine
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/flash/ flash effect
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shake-position/ //shake effect
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/ //various UI 
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/ //ui dialog box with choice buttons
      //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-sizer/ //sizer for layout

      this.scale.on('orientationchange', this.orientationResponder,this);

      this.input.setTopOnly(true);
      this.input.on('gameobjectover',this.enterButtonHoverState,this);
      this.input.on('gameobjectout',this.enterButtonRestState,this);
      this.input.on('gameobjectdown',this.enterButtonActiveState,this);
      this.input.on('gameobjectup',this.handleChoicePress,this);

      this.bg.setInteractive();
      
      this.resize();

      this.storyManager.on('showLocation', this.handleShowLocation,this);
      this.storyManager.on('showChoices', this.handleShowChoices,this);
      this.storyManager.on('showDialog', this.handleShowDialog,this);
      this.storyManager.on('showItem', this.handleShowItem,this);
      this.storyManager.nextStep();

    }
    handleShowLocation(loc){
      this.bg.setTexture(loc);
    }
    handleShowItem(itm){
      this.itemBox.setItem(itm);
      this.itemBox.visible=true;
    }
    handleShowChoices(choices){
      for (let index = 0; index < choices.length; index++) {
        this["choice"+index].setText(choices[index]);
        this["choice"+index].visible=true;
      }
    }
    handleShowDialog(character,moodIndex,action,dialog,removeCharacters,replaceCharacter){
      //console.log("h dialog",character,moodIndex,action,dialog,removeCharacters,replaceCharacter);
      if(character!==null){
        this.viewManager.characterOnScene=true;
        this.nameTag.visible=true;
        this.nameTag.setText(this.onSceneCharacters[character].name);
        for (var key of Object.keys(this.onSceneCharacters)) {
          if(key===character){
            this.onSceneCharacters[character].model.visible=true;
            this.onSceneCharacters[character].model.armature.getSlot("Face").displayIndex =moodIndex;
          }else{
            this.onSceneCharacters[key].model.visible=false;
          }
        }
        if(action==='say'){
          this.talkWick.visible=true;
          this.thinkWick.visible=false;
        }else{
          this.thinkWick.visible=true;
          this.talkWick.visible=false;
        }
      }else{
        this.viewManager.characterOnScene=false;
        this.thinkWick.visible=false;
        this.talkWick.visible=false;
        this.nameTag.visible=false;
        for (var key of Object.keys(this.onSceneCharacters)) {
          this.onSceneCharacters[key].model.visible=false;
        }
      }
      this.dialog.say(dialog);
      this.dialog.visible=true;

      if(Object.keys(this.onSceneCharacters)[0]===character){
        this.viewManager.characterOnLeft=true;
      }else{
        this.viewManager.characterOnLeft=false;
      }
      this.viewManager.layout(this.currentOrientation);
    }

    sayDialog(){
      let s1 = `[shadow][stroke=blue]Some random text which I am writing here to test this dialog box. Does this work?
What should I do[color=blue]??[/color][i][b][color=red]FIGHT[/color]!![/b][/i]H[size=45]M[size=40]M[size=35]M[/size]FLIGHT[color=white] DO NOTHING SOMETHING[/stroke][/shadow]`;
      this.dialog.say(s1);
    }

    
    handleChoicePress (pointer,gameObject) {
      if(gameObject===this.bg){
        //console.log("mouse");
        if(!this.storyManager.makingChoice){
          this.itemBox.visible=false;
          this.storyManager.nextStep();
        }
      }else{
        //console.log("tapped "+gameObject.parentContainer.choiceId);
        if(this.storyManager.makingChoice){
          let choice=gameObject.parentContainer.choiceId;
          this.storyManager.makeChoice(choice);

          for (let index = 0; index < this.maxChoices; index++) {
            this["choice"+index].visible=false;
          }
        }
      }
      
    }
   
    enterButtonHoverState(pointer,gameObject){
      //gameObject.hover();
    }
    enterButtonRestState(pointer,gameObject){
      if(gameObject!==this.bg)
      gameObject.parentContainer.rest();
    }
    enterButtonActiveState(pointer,gameObject){
      if(gameObject!==this.bg)
      gameObject.parentContainer.press();
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