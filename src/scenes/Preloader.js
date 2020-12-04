import Phaser from 'phaser'
import ViewManager from '../components/ViewManager';

export default class Preloader extends Phaser.Scene
{
    constructor()
	{
        super('Preloader')

    }

    preload() {
        this.load.json('data', 'src/assets/data/data.json');
        //this.load.once('filecomplete', this.jsonComplete, this);
        this.load.once('filecomplete', this.complete, this);
    }
    /*
    jsonComplete(){
        console.log("JSON Loaded!");
        this.jpgsToLoad=[];
        this.pngsToLoad=[];
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

            this.graphics = this.add.graphics();
            this.loaderGraphics = this.add.graphics();
            var progressBar = new Phaser.Geom.Rectangle((this.width/2)-200, (this.height/2)-25, 400, 50);
            var progressBarFill = new Phaser.Geom.Rectangle((this.width/2)-195, (this.height/2)-20, 290, 40);

            this.graphics.fillStyle(0xf68712, 1);
            this.graphics.fillRectShape(progressBar);

            this.loaderGraphics.fillStyle(0xbf1b2c, 1);
            this.loaderGraphics.fillRectShape(progressBarFill);

            this.loadingText = this.add.text(this.width/2,(this.height/2)+55,"Loading: ", { fontSize: '32px', fill: '#FFF' });
            this.loadingText.setOrigin(0.5, 0.5);
            //console.log(this.jpgsToLoad);

            this.loadSeparately();

            this.load.on('progress', this.updateBar, {loaderGraphics:this.loaderGraphics,loadingText:this.loadingText,width:this.width,height:this.height});
            this.load.on('complete', this.complete, {scene:this.scene});
        
    }

    loadSeparately(){
        console.log("Files loading!");
        if(this.parseAndValidateJSON()){

            for (let index = 0; index < this.jpgsToLoad.length; index++) {
                const element = this.jpgsToLoad[index];
                this.load.image(element, 'images/'+element+'.jpg');
                //console.log("loading "+'images/'+element+'.jpg');
            }
            for (let index = 0; index < this.pngsToLoad.length; index++) {
                const element = this.pngsToLoad[index];
                this.load.image(element, 'images/'+element+'.png');
                //console.log("loading "+'images/'+element+'.png');
            }
            this.load.image('logo', 'images/VvLogoPng.png');
            this.load.image('greenlogo', 'images/GreenCityLogoPng.png');
            this.load.image('rocketlogo', 'images/RocketLogoPng.png');
            
            this.load.image('dialog', 'images/speechbubble.png');
            this.load.image('choice', 'images/ChoiceBox.jpg');
            this.load.image('tick', 'images/tickIcon.png');
            this.load.image('next', 'images/nextIcon.png');
            this.load.image('coin', 'images/coinIcon.png');
            this.load.image('earth', 'images/earthIcon.png');
            this.load.image('human', 'images/humanIcon.png');
            this.load.image('n95', 'images/n95Icon.png');
            this.load.image('o2', 'images/o2Icon.png');
            this.load.image('skip', 'images/skipIcon.png');
            this.load.image('surgical', 'images/surgicalIcon.png');
            this.load.image('treasure', 'images/treasureIcon.png');
            this.load.image('treasureClosed', 'images/treasureClosed.png');
            this.load.image('treasureOpen', 'images/treasureOpen.png');

            this.load.image('bg', 'images/menubg.jpg');
            this.load.image('menu1', 'images/menu1.png');
            this.load.image('menu2', 'images/menu2.png');
            this.load.image('title', 'images/title.png');
            
            this.load.audio('positive', 'audio/positive.mp3');
            this.load.audio('negative', 'audio/negative.mp3');

        }else{
            this.loadingText.text="Invalid JSON structure! Aborting.";
        }
    }

    updateBar(percentage) {

        this.loaderGraphics.clear();
        this.loaderGraphics.fillStyle(0xbf1b2c, 1);
        this.loaderGraphics.fillRectShape(new Phaser.Geom.Rectangle((this.width/2)-195, (this.height/2)-20, percentage*390, 40));
                
        percentage = percentage * 100;
        this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
        //console.log("P:" + percentage);
    }
    parseAndValidateJSON(){
        console.log("Trying to parse game data...");
        var jsonData=this.cache.json.get('data');
        if(jsonData===null){
            console.log("Game Data JSON file missing!");
            return false;
        }else{
            if(jsonData.selection.length<2){
                console.log("Characters not defined for selection!");
                return false;
            }else{
                for (let innerIndex = 1; innerIndex <= jsonData.selection.length; innerIndex++) {
                    const chara = jsonData.selection[innerIndex-1];
                    //console.log("Adding "+chara);
                    if(chara!=='SelectedChar' && this.pngsToLoad.indexOf(chara)===-1){
                        this.pngsToLoad.push(chara);
                    }
                }
            }
            let levelData=[];
            let levelInd=1;
            while (jsonData["level"+levelInd]!==undefined) {
                levelData.push(jsonData["level"+levelInd]);
                levelInd++;
            }
            if(levelData.length==0){
                console.log("Levels are not defined in JSON file!");
                return false;
            }else{
                console.log("Found "+levelData.length+" levels.");
                for (let index = 0; index < levelData.length; index++) {
                    const level = levelData[index];
                    if(level.location===undefined){
                        console.log("Level "+(index+1)+" location is not defined!");
                        return false;
                    }else{
                        //console.log("Adding "+level.location);
                        if(this.jpgsToLoad.indexOf(level.location)===-1){
                            this.jpgsToLoad.push(level.location);
                        }
                    }
                    if(level.characters===undefined){
                        console.log("Level "+(index+1)+" characters are not defined!");
                        return false;
                    }else{
                        if(level.characters.length<2){
                            console.log("Level "+(index+1)+" needs atleast 2 characters!");
                            return false;
                        }else if(level.characters.length>2){
                            console.log("Level "+(index+1)+" has more than 2 characters!");
                            return false;
                        }else{
                            for (let innerIndex = 1; innerIndex <= level.characters.length; innerIndex++) {
                                const chara = level.characters[innerIndex-1];
                                //console.log("Adding "+chara);
                                if(chara!=='SelectedChar' && this.pngsToLoad.indexOf(chara)===-1){
                                    this.pngsToLoad.push(chara);
                                }
                            }
                        }
                    }
                    if(level.reward===undefined){
                        console.log("Level "+(index+1)+" rewards are not defined!");
                    }else{
                        if(level.reward.length>3){
                            console.log("Level "+(index+1)+" has "+level.reward.length+" rewards defined, we need only 3!");
                        }else{
                            console.log("Level "+(index+1)+" has "+level.reward.length+" rewards defined!");
                        }
                        
                    }
                    if(level.sequence===undefined){
                        console.log("Level "+(index+1)+" dialog/quiz sequence is not defined!");
                        return false;
                    }else{
                        let dialogCount=0;
                        let quizCount=0;
                        console.log("Level "+(index+1)+" has "+Object.keys(level.sequence).length+" sequences defined!");
                        for (let innerIndex = 1; innerIndex <= Object.keys(level.sequence).length; innerIndex++) {
                            const sequenceElement = level.sequence[innerIndex.toString()];
                            switch (sequenceElement.type) {
                                case "dialog":
                                    dialogCount++;
                                    if(sequenceElement.character===undefined){
                                        console.log("Level "+(index+1)+" character not defined for dialog sequence :"+innerIndex);
                                        return false;
                                    }
                                    if(sequenceElement.dialog===undefined){
                                        console.log("Level "+(index+1)+" dialog not defined for dialog sequence :"+innerIndex);
                                    }
                                    break;
                                case "quiz":
                                    quizCount++;
                                    if(sequenceElement.question===undefined){
                                        console.log("Level "+(index+1)+" question not defined for quiz sequence :"+innerIndex);
                                        return false;
                                    }
                                    
                                    if(sequenceElement.choices===undefined){
                                        console.log("Level "+(index+1)+" choices not defined for quiz sequence :"+innerIndex);
                                        return false;
                                    }else{
                                        if(sequenceElement.choices.length>3){
                                            console.log("Level "+(index+1)+" more than 3 choices for quiz sequence :"+innerIndex);
                                            return false;
                                        }else{
                                            for (let innerInerIndex = 0; innerInerIndex < sequenceElement.choices.length; innerInerIndex++) {
                                                const choiceElement = sequenceElement.choices[innerInerIndex];
                                                if(choiceElement.choice===undefined){
                                                    console.log("Level "+(index+1)+" choice text not defined for choice :"+innerInerIndex);
                                                    return false;
                                                }
                                                if(choiceElement.points===undefined){
                                                    console.log("Level "+(index+1)+" choice points not defined for choice :"+innerInerIndex);
                                                }
                                                if(choiceElement.impact===undefined){
                                                    console.log("Level "+(index+1)+" choice impact not defined for choice :"+innerInerIndex);
                                                }
                                                if(choiceElement.price===undefined){
                                                    console.log("Level "+(index+1)+" choice price not defined for choice :"+innerInerIndex);
                                                }
                                                if(choiceElement.description===undefined){
                                                    console.log("Level "+(index+1)+" choice description not defined for choice :"+innerInerIndex);
                                                }
                                                if(choiceElement.image===undefined){
                                                    console.log("Level "+(index+1)+" choice image not defined for choice :"+innerInerIndex);
                                                }else{
                                                    if(this.jpgsToLoad.indexOf(choiceElement.image)===-1){
                                                        this.jpgsToLoad.push(choiceElement.image);
                                                    }
                                                    
                                                }
                                            }
                                        }
                                    }
                                    break;
                            
                                default:
                                    break;
                            }
                        }
                        console.log("Level "+(index+1)+" has "+dialogCount+" dialogs & "+quizCount+ " questions.");
                    }
                }
            }
        }
        return true;
    }
*/

	complete() {
        let vm = new ViewManager(1920,1080);
        console.log("Load Complete!");
        this.scene.start("Menu",{ viewManager:vm });
	}
}
