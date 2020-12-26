export default class ItemBox extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, width,base)
	{
        super(scene, x, y);
        this.margin=10;
        this.spriteOriginalWidth;
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ninepatch/
        this.base=scene.add.rexNinePatch({x: 0, y: 0, width:width, height: this.margin,key: 'theme',baseFrame:base,
          columns: [10, undefined, 10],
          rows: [10, undefined, 10],
        });
        this.add(this.base);
        
        this.base.setOrigin(0.5,0.5);
        this.setSize(width, width);
        this.sprite=null;
    }
    assignNewSize(width,height){
        this.base.resize(width, height);
        this.setSize(width,height);
        if(this.sprite!==null){
            let newScale=(this.width-this.margin)/this.spriteOriginalWidth;
            this.sprite.setScale(newScale); 
        }
    }

    setItem(item){
        if(this.sprite===null){
            this.sprite=this.scene.add.sprite(0,0,item);
            this.add(this.sprite);
            this.sprite.setOrigin(0.5,0.5);
            this.spriteOriginalWidth=this.sprite.width;

            let newScale=(this.width-this.margin)/this.spriteOriginalWidth;
            this.sprite.setScale(newScale); 
        }else{
            this.sprite.setTexture(item);
            this.spriteOriginalWidth=this.sprite.width;
            let newScale=(this.width-this.margin)/this.spriteOriginalWidth;
            this.sprite.setScale(newScale); 
        }
    }
}