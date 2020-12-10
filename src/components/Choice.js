export default class Choice extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, width,base,fontSize)
	{
        super(scene, x, y);
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

        this.setSize(width, this.margin);
    }

    setText(str){
        this.textField.text=str;
    }

    assignNewSize(width,height){
        //console.log(this.textField.style.wrapWidth);
        //let str=this.textField.text;
        this.base.resize(width, height);
        this.textField.setWrapWidth((width-(2*this.margin)));
        //this.textField.text=str;
        this.textField.setWrapMode('character');
        this.setSize(width,height);
        //console.log(this.textField.style.wrapWidth);
    }
}