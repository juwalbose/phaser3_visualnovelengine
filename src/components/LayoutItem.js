export default class LayoutItem 
{
    constructor(item,itemType)
	{
        let itemTypeEnum = {background:"background",character:"character",choice:"choice", dialog:"dialog"};
        this.item=item;
        this.itemType=itemType;
        if(itemType===itemTypeEnum.character){
            this.originalWidth=item.width;
            this.originalHeight=1700;
        }else{
            this.originalWidth=item.width;
            this.originalHeight=item.height;
        }
    }
}