export default class Choice extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, width,base,fontSize,choiceId)
	{
        super(scene, x, y);
        this.choiceId=choiceId;
        this.margin=10;
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ninepatch/
        this.base=scene.add.rexNinePatch({x: 0, y: 0, width:width, height: this.margin,key: base,
          columns: [10, undefined, 10],
          rows: [10, undefined, 10],
        });
        this.add(this.base);
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/bbcodetext/
        this.textField = scene.add.rexBBCodeText(0, 0, "", {
            //backgroundColor: '#555',
            fontFamily: 'Arial',
            fontSize: fontSize+'px',
            //align: 'left',
            halign: 'left', // 'left'|'center'|'right'
            valign: 'top',
            wrap: {
                mode: 'character',
                width: (width-(2*this.margin))
            },
            maxLines: 2,
            stroke: 'red',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                blur: 0,
                color: 'black'
            }
        });
        this.textField.setOrigin(0.5,0.5);

        this.add(this.textField);

        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/zone/
        this.zone = scene.add.zone(0, 0, width, this.margin).setInteractive({ useHandCursor: true});
        this.add(this.zone);

        this.setSize(width, this.margin);

        //this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width,this.margin), Phaser.Geom.Rectangle.Contains);
        //this.input.useHandCursor=true;
    }

    setText(str){
        this.textField.text=str;
    }

    hover(){
        this.scale=1.05;
    }
    rest(){
        this.scale=1;
    }
    press(){
        this.scale=.95;
    }

    assignNewSize(width,height){
        this.removeInteractive();
        this.base.resize(width, height);
        this.textField.setWrapWidth((width-(2*this.margin)));
        this.textField.setWrapMode('character');
        this.setSize(width,height);
        //this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width,height), Phaser.Geom.Rectangle.Contains);
        //this.input.useHandCursor=true;
        this.zone.setSize(width,height);
    }
}