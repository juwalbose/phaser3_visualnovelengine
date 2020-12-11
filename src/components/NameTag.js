export default class NameTag extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, width,base,fontSize)
	{
        super(scene, x, y);
        this.margin=20;
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ninepatch/
        this.base=scene.add.rexNinePatch({x: 0, y: 0, width:width, height: this.margin,key: 'theme',baseFrame:base,
          columns: [10, undefined, 10],
          rows: [10, undefined, 10],
        });
        this.add(this.base);
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/bbcodetext/
        this.textField = scene.add.rexBBCodeText(this.margin, 0, "", {
            //backgroundColor: '#555',
            fontFamily: 'Arial',
            fontSize: fontSize+'px',
            //align: 'left',
            halign: 'left', // 'left'|'center'|'right'
            valign: 'top',
            maxLines: 1,
            stroke: 'red',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                blur: 0,
                color: 'black'
            }
        });
        this.base.setOrigin(0,0.5);
        this.textField.setOrigin(0,0.5);

        this.add(this.textField);

        this.setSize(width, 80);
    }

    setText(str){
        this.textField.text=`[shadow]`+str+`[/shadow]`;
        this.base.resize(this.textField.width+(2*this.margin), 80);
        this.setSize(this.textField.width+(2*this.margin), 80);
    }
}