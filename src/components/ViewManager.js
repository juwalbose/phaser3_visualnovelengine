import DynamicScalePosItem from "./DynamicScalePosItem";

export default class ViewManager 
{
    
    constructor(width,height)
	{
        this.designWidth=width;
        this.designHeight=height;
        this.heightBasedDisplayList=[];
        this.fullscreenDisplayList=[];
    }
    clearDisplayList(){
        this.heightBasedDisplayList=[];
        this.fullscreenDisplayList=[];
    }
    addToDisplayList(dynamicItem){
        if(dynamicItem.heightRatio===0){
            this.fullscreenDisplayList.push(dynamicItem);
        }else{
            this.heightBasedDisplayList.push(dynamicItem);
        }
    }

    resizeAndLayout(newWidth,newHeight){
        let currentWidthRatio=this.designWidth/newWidth;
        let currentHeightRatio=this.designHeight/newHeight;

        for (let index = 0; index < this.fullscreenDisplayList.length; index++) {
            const element = this.fullscreenDisplayList[index];
            if(currentWidthRatio<=currentHeightRatio){
                element.item.setDisplaySize(newWidth,this.designHeight/currentWidthRatio);
            }else{
                element.item.setDisplaySize(this.designWidth/currentHeightRatio,newHeight);
            }
            element.item.x=element.x*newWidth;
            element.item.y=element.y*newHeight;
        }

        for (let index = 0; index < this.heightBasedDisplayList.length; index++) {
            const element = this.heightBasedDisplayList[index];
            let ratio=element.heightRatio*(newHeight/this.designHeight);
            element.item.setScale(ratio);
            element.item.x=element.x*newWidth;
            element.item.y=element.y*newHeight;
        }

    }
    
}