import LayoutItem from "../components/LayoutItem";

export default class ViewManager 
{
    constructor(jsonData)
	{
        this.designSize=jsonData.designSize;
        this.layoutData=jsonData.layoutData;
        this.currentOrientation="landscape";
        this.characterOnScene=false;
        this.characterOnLeft=false;
        
        this.backgroundObjects=[];
        this.characterObjects=[];
        this.dialogObjects=[];
        this.choiceObjects=[];
    }
    resizeAndLayout(orientation){//"landscape", "portrait"
        this.currentOrientation=orientation;
        let newDesignSize={width:0,height:0};
        if(orientation==="landscape"){
            newDesignSize.width=Math.max(this.designSize.width,this.designSize.height);
            newDesignSize.height=Math.min(this.designSize.width,this.designSize.height);
        }else{
            newDesignSize.width=Math.min(this.designSize.width,this.designSize.height);
            newDesignSize.height=Math.max(this.designSize.width,this.designSize.height);
        }
        for (let index = 0; index < this.backgroundObjects.length; index++) {
            const element = this.backgroundObjects[index];
            let newScale=this.layoutData[orientation].background.size.height/element.originalHeight;
            element.item.setScale(newScale);
        }
       
        for (let index = 0; index < this.characterObjects.length; index++) {
            const element = this.characterObjects[index];
            //if(this.characterOnScene){
                let newScale=this.layoutData[orientation].character.size.height/element.originalHeight;
                element.item.setScale(newScale); 
            //}
        }
        for (let index = 0; index < this.dialogObjects.length; index++) {
            const element = this.dialogObjects[index];
            element.item.assignNewSize(this.layoutData[orientation].dialog.size.width, this.layoutData[orientation].dialog.size.height);
        }
        for (let index = 0; index < this.choiceObjects.length; index++) {
            const element = this.choiceObjects[index];
            element.item.assignNewSize(this.layoutData[orientation].choice.size.width, this.layoutData[orientation].choice.size.height);
        }
        this.layout(orientation);
    }
    layout(orientation){//"landscape", "portrait"
        this.currentOrientation=orientation;
        let newDesignSize={width:0,height:0};
        if(orientation==="landscape"){
            newDesignSize.width=Math.max(this.designSize.width,this.designSize.height);
            newDesignSize.height=Math.min(this.designSize.width,this.designSize.height);
        }else{
            newDesignSize.width=Math.min(this.designSize.width,this.designSize.height);
            newDesignSize.height=Math.max(this.designSize.width,this.designSize.height);
        }
        for (let index = 0; index < this.backgroundObjects.length; index++) {
            const element = this.backgroundObjects[index];
            if(this.characterOnScene){
                if(this.characterOnLeft){
                    element.item.x=this.layoutData[orientation].background.position.x+this.layoutData[orientation].background.slide;
                }else{
                    element.item.x=this.layoutData[orientation].background.position.x-this.layoutData[orientation].background.slide;
                }
            }else{
                element.item.x=this.layoutData[orientation].background.position.x;
            }
            element.item.y=this.layoutData[orientation].background.position.y;
        }
       
        for (let index = 0; index < this.characterObjects.length; index++) {
            const element = this.characterObjects[index];
            if(this.characterOnScene){
                if(this.characterOnLeft){
                    element.item.x=this.layoutData[orientation].character.slide;
                }else{
                    element.item.x=newDesignSize.width-this.layoutData[orientation].character.slide;
                }
                element.item.y=this.layoutData[orientation].character.position.y;
            }else{
                element.item.x=2*newDesignSize.width;
            }
        }
        
        for (let index = 0; index < this.dialogObjects.length; index++) {
            const element = this.dialogObjects[index];
            if(this.characterOnScene){
                if(orientation==="portrait"){
                    element.item.x=this.layoutData[orientation].background.position.x;
                }else{
                    if(this.characterOnLeft){
                        element.item.x=newDesignSize.width-this.layoutData[orientation].dialog.slide;
                    }else{
                        element.item.x=this.layoutData[orientation].dialog.slide;
                    }
                }
            }else{
                element.item.x=this.layoutData[orientation].background.position.x;
            }
            element.item.y=this.layoutData[orientation].dialog.position.y;
        }
        for (let index = 0; index < this.choiceObjects.length; index++) {
            const element = this.choiceObjects[index];
            if(this.characterOnScene){
                if(this.characterOnLeft){
                    element.item.x=newDesignSize.width-this.layoutData[orientation].choice.slide;
                }else{
                    element.item.x=this.layoutData[orientation].choice.slide;
                }
            }else{
                element.item.x=this.layoutData[orientation].background.position.x;
            }
            element.item.y=this.layoutData[orientation].choice.position.y+(index*this.layoutData[orientation].choice.size.height*1.1);
        }
    }
    addToDisplayList(item,itemType){
        let itemTypeEnum = {background:"background",character:"character",choice:"choice", dialog:"dialog"};
        switch(itemType){
            case itemTypeEnum.background:
                item.setOrigin(this.layoutData[this.currentOrientation].background.origin.x,this.layoutData[this.currentOrientation].background.origin.y);
                this.backgroundObjects.push(new LayoutItem(item,itemTypeEnum.background));
            break;
            case itemTypeEnum.character:
                //item.setOrigin(this.layoutData[this.currentOrientation].character.origin.x,this.layoutData[this.currentOrientation].character.origin.y);
                this.characterObjects.push(new LayoutItem(item,itemTypeEnum.character));
            break;
            case itemTypeEnum.dialog:
                //item.setOrigin(this.layoutData[this.currentOrientation].background.origin.x,this.layoutData[this.currentOrientation].background.origin.y);
                this.dialogObjects.push(new LayoutItem(item,itemTypeEnum.dialog));
            break;
            case itemTypeEnum.choice:
                //item.setOrigin(this.layoutData[this.currentOrientation].choice.origin.x,this.layoutData[this.currentOrientation].choice.origin.y);
                this.choiceObjects.push(new LayoutItem(item,itemTypeEnum.choice));
            break;
        }
    }
    clearChoiceList(){
        for (let index = 0; index < this.choiceObjects.length; index++) {
            const element = this.choiceObjects[index];
            element.item.destroy();
        }
        this.choiceObjects=[];
    }
    
}