export default class DynamicScalePosItem 
{
    /**
     * 
     * @param {*} item The item in scene
     * @param {*} posX % position from 0-1
     * @param {*} posY % position from 0-1
     * @param {*} heightRatio height of item as a ratio of design height (1080)
     */
    constructor(item,posX=0,posY=0,heightRatio=0)
	{
        this.item=item;
        this.x=posX;
        this.y=posY
        this.heightRatio=heightRatio;
    }
}