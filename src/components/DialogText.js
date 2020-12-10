export default class DialogText extends Phaser.GameObjects.Container
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
                mode: 'word',
                width: (width-(2*this.margin))
            },
            maxLines: 5,
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

        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/texttyping/
        this.typing = scene.plugins.get('rexTextTyping').add(this.textField, {
            speed: 20,       // typing speed in ms
            //typeMode: 0,      //0|'left-to-right'|1|'right-to-left'|2|'middle-to-sides'|3|'sides-to-middle'
            //setTextCallback: function(text, isLastChar, insertIdx){ return text; }  // callback before set-text
            //setTextCallbackScope: null
        });

        this.setSize(width, this.margin);
    }

    say(dialog){
        this.typing.start(dialog);
    }

    assignNewSize(width,height){
        this.base.resize(width, height);
        this.textField.setWrapWidth((width-(2*this.margin)));
        this.textField.setWrapMode('word');
        this.setSize(width,height);
    }
}