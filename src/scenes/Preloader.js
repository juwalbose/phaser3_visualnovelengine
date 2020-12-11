import Phaser from 'phaser'
import ViewManager from '../utils/ViewManager';
import StoryManager from '../utils/StoryManager';

export default class Preloader extends Phaser.Scene
{
    constructor()
	{
        super('Preloader')

    }

    preload() {
        this.load.json('data', 'src/assets/data/data.json');
        this.load.once('filecomplete', this.dataComplete, this);
    }

    dataComplete() {
        console.log("Data json loaded!");
        let storyFile="story.json";
        let jsonData=this.cache.json.get('data');
        if(jsonData===null){
            console.log("Game Data JSON file missing!");
            return false;
        }else{
            if(jsonData.story===undefined){
                console.log("Story JSON file missing!");
            }else{
                if(jsonData.story.file_name===undefined){
                    console.log("Story JSON file missing!");
                }else{
                    if(jsonData.story.default_language===undefined){
                        storyFile=jsonData.story.file_name+"_en.json";
                    }else{
                        storyFile=jsonData.story.file_name+"_"+jsonData.story.default_language+".json";  
                    }
                    this.load.json('story', 'src/assets/data/'+storyFile);
                    this.load.once('filecomplete', this.jsonComplete, this);
                    return true;
                }  
            }
        }
        console.log("Cannot proceed without story json file!");
    }
    
    jsonComplete(){
        console.log("Story JSON Loaded!");

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
            this.load.on('complete', this.storyComplete, {scene:this.scene});

     
        
    }

    loadSeparately(){
        console.log("Assets loading!");
        let jsonDataNew=this.cache.json.get('data');
        if(jsonDataNew===null){
            console.log("Data JSON corrupt!");
            return false;
        }
        this.load.image(jsonDataNew.ui_base.name, jsonDataNew.ui_base.image);
        let jsonData=this.cache.json.get('story');
        if(jsonData===null){
            console.log("Story JSON corrupt!");
            return false;
        }
        for (let innerIndex = 0; innerIndex < jsonData.locations.length; innerIndex++) {
            const loc = jsonData.locations[innerIndex];
            this.load.image(loc.cfName, loc.image);
        }
        for (let innerIndex = 0; innerIndex < jsonData.characters.length; innerIndex++) {
            const character = jsonData.characters[innerIndex];
            this.load.dragonbone(
                character.cfName,
                character.texture,
                character.textureData,
                character.skeletonData
            );
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

    storyComplete(){
        console.log("Assets loaded!");
        this.scene.start("PortLand");
    }
}
