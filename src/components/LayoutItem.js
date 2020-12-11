export default class LayoutItem 
{
    constructor(item,itemType,height=0)
	{
        this.item=item;
        this.itemType=itemType;
        this.originalWidth=item.width;
        if(itemType==="character"){
            this.originalHeight=height;
        }else{
            this.originalHeight=item.height;
        }
    }
}