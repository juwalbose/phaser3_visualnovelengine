import DynamicScalePosItem from "./DynamicScalePosItem";

export default class ViewManager 
{
    
    constructor(width,height,marginX,marginY)
	{
        this.designWidth=width;
        this.designHeight=height;
        this.horizontalMargin=marginX;
        this.verticalMargin=marginY;

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
        //console.log('fsdl',this.fullscreenDisplayList.length);
        //console.log('hbdl',this.heightBasedDisplayList.length);
    }

    resizeAndLayout(newWidth,newHeight){
        let currentWidthRatio=this.designWidth/newWidth;
        let currentHeightRatio=this.designHeight/newHeight;
        let availableWidth=newWidth-2*(newWidth*this.horizontalMargin/this.designWidth);

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
            if(element.isNinePatch){
                //console.log(element.originalWidth*ratio,availableWidth);
                if(element.originalWidth*ratio>availableWidth){
                    ratio=availableWidth/element.originalWidth;
                }
                element.item.resize(element.originalWidth*ratio, element.originalHeight*ratio);
            }else{
                element.item.setScale(ratio);
            }
            element.item.x=element.x*newWidth;
            element.item.y=element.y*newHeight;
        }

    }
    
}