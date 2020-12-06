export default class StoryManager 
{
    
    constructor(storyData)
	{
        this.storyData=storyData;
        this.gameVariables={};
        this.gameCharacters={};
        this.gameCharacterExpressions={};
        this.gameLocations={};

        this.gameBranches={branchStarts:[],branchEnds:[]};

        this.directiveEnum = {location:"|LOCATION|",choice:"|CHOICE|", branch:"|GOTO|", check:"|IF|", label:"|LABEL"};
        this.directiveDelimiter = "|";
        this.variableTag="$";
        this.variationTag="_";
        this.separationTag=":";
        this.expSeparationTag="*";
    }
    parseAndValidateStory(){
        for (var key of Object.keys(this.storyData.gameVariables)) {
            //console.log(key + " -> " + this.storyData.gameVariables[key])
            this.gameVariables[key]=this.storyData.gameVariables[key];
        }
        for (let innerIndex = 0; innerIndex < this.storyData.locations.length; innerIndex++) {
            const loc = this.storyData.locations[innerIndex];
            this.gameLocations[loc.aka]=loc;
        }

        for (let innerIndex = 0; innerIndex < this.storyData.characters.length; innerIndex++) {
            const character = this.storyData.characters[innerIndex];
            this.gameCharacters[character.aka]=character;
        }

        for (let innerIndex = 0; innerIndex < this.storyData.characterExpressionTags.length; innerIndex++) {
            const expressionTag = this.storyData.characterExpressionTags[innerIndex];
            this.gameCharacterExpressions[expressionTag.aka]=expressionTag.name;
        }
        
        /*
        this.gameVariables.charm++;
        this.gameVariables.obtainedKey=true;
        console.log(this.gameVariables.obtainedKey);
        console.log(this.gameVariables.name);
        console.log(this.gameVariables.charm);
        */

        let storyFlow=this.storyData.storyFlow;
        for (let innerIndex = 0; innerIndex < storyFlow.length; innerIndex++) {
            const chapterObj = storyFlow[innerIndex];
            let chapterName="";
            let chapterData=[];
            //console.log(chapterObj);
            for (var key of Object.keys(chapterObj)) {
                //console.log(key + " -> " + chapterObj[key]);
                chapterName=key;
                chapterData=chapterObj[key];
                for (let sequenceIndex = 0; sequenceIndex < chapterData.length; sequenceIndex++) {
                    let lineStr=chapterData[sequenceIndex];
                    this.evaluateLine(lineStr);
                }
            }
        }
        //console.log(this.gameBranches.branchStarts);
        //console.log(this.gameBranches.branchEnds);
        let allbranchesOk=true;
        for (const key in this.gameBranches.branchStarts) {
            const element = this.gameBranches.branchStarts[key];
            if(this.gameBranches.branchEnds.indexOf(element)==-1){
                console.log("branch end not found for "+element);
                allbranchesOk=false;
            }
        }
        for (const key in this.gameBranches.branchEnds) {
            const element = this.gameBranches.branchEnds[key];
            if(this.gameBranches.branchStarts.indexOf(element)==-1){
                console.log("branch start not found for "+element);
                allbranchesOk=false;
            }
        }

        return allbranchesOk;
    }
    evaluateLine(lineStr){
        let delimSplit=lineStr.split(this.directiveDelimiter);
        if(lineStr.startsWith(this.directiveEnum.location)){
            console.log("set location :"+this.evaluateLocation(delimSplit[2]));
        }else if(lineStr.startsWith(this.directiveEnum.label)){
            console.log("set label :"+delimSplit[1]);
            this.gameBranches.branchStarts.push(delimSplit[1]);
            this.evaluateLine(delimSplit[2]);
        }else if(lineStr.startsWith(this.directiveEnum.choice)){
            let trimStr=lineStr.slice(this.directiveEnum.choice.length);
            let sepSplit=trimStr.split(this.separationTag);
            for (let i = 0; i < sepSplit.length/2; i++) {
                console.log("choice "+(i+1)+": "+sepSplit[i*2]+"="+sepSplit[1+(i*2)]);
                //choice could be label or an expression to evaluate
                if(sepSplit[1+(i*2)].startsWith(this.directiveEnum.label)){
                    //|GOTO|:|LABEL3|
                    this.evaluateLine(this.directiveEnum.branch+this.separationTag+sepSplit[1+(i*2)]);
                }else{
                    this.evaluateLine(sepSplit[1+(i*2)]);
                }
            }
        }else if(lineStr.startsWith(this.directiveEnum.check)){
            let trimStr=lineStr.slice(this.directiveEnum.check.length);
            let sepSplit=trimStr.split(this.separationTag);
            console.log("evaluate "+sepSplit[0]+" : "+sepSplit[1]);
            //could be a label, if eval fails just continue on
            if(this.evaluateExpression(sepSplit[0].replaceAll(this.directiveDelimiter,"").replaceAll(this.variableTag,""))){
                console.log("evaluated true");
                if(sepSplit[1].startsWith(this.directiveEnum.label)){
                    //|GOTO|:|LABEL3|
                    this.evaluateLine(this.directiveEnum.branch+this.separationTag+sepSplit[1]);
                }else{
                    this.evaluateLine(sepSplit[1]);
                }
            }else{
                console.log("evaluated false");
                if(sepSplit[1].startsWith(this.directiveEnum.label)){
                    //|GOTO|:|LABEL3|
                    this.evaluateLine(this.directiveEnum.branch+this.separationTag+sepSplit[1]);
                }else{
                    this.evaluateLine(sepSplit[1]);
                }
            }
        }else if(lineStr.startsWith(this.directiveEnum.branch)){
            let sepSplit=lineStr.split(this.separationTag);
            console.log("branch to label :"+sepSplit[1]);
            this.gameBranches.branchEnds.push(sepSplit[1].replaceAll(this.directiveDelimiter,""));
        }else{
            //choice could be dialog or an expression to evaluate
            if(lineStr.startsWith(this.directiveDelimiter+this.variableTag)){
                this.evaluateExpression(lineStr.replaceAll(this.directiveDelimiter,"").replaceAll(this.variableTag,""));
            }else{
                //console.log("no special start :"+lineStr);
                let sepSplit=lineStr.split(this.separationTag);
                if(sepSplit.length>1){
                    if(sepSplit[1].includes(this.variableTag)){
                        sepSplit[1]=this.replaceVariables(sepSplit[1]);
                    }
                    console.log(this.evaluateCharacter(sepSplit[0])+" says "+sepSplit[1]);
                }else{
                    if(lineStr.includes(this.variableTag)){
                        lineStr=this.replaceVariables(lineStr);
                    }
                    console.log("narrator says "+lineStr);
                }
            }
        }
    }
    replaceVariables(str){
        let spaceSplit=str.split(" ");
        for (let i = 0; i < spaceSplit.length; i++) {
            let word=spaceSplit[i];
            if(word.startsWith(this.variableTag)){
                let sWord=word.slice(1);
                if(this.gameVariables[sWord]!==undefined){
                    str=str.replaceAll(word,this.gameVariables[sWord]);
                }
            }
        }
        return str;
    }
    evaluateLocation(exp){
        return this.gameLocations[exp].name;
    }
    evaluateCharacter(exp){
        let sepSplit=exp.split(this.variationTag);
        return this.gameCharacters[sepSplit[0]].name+" ("+this.gameCharacterExpressions[sepSplit[1]]+")";
    }
    evaluateExpression(exp){
        let sepSplit=exp.split(this.expSeparationTag);
        let operatorStr=sepSplit[1];
        let lhsStr=sepSplit[0];
        let rhsStr=sepSplit[2];
        switch(operatorStr){
            case "+":
                this.gameVariables[lhsStr]+=parseInt(rhsStr);
                console.log("updated "+lhsStr +" to "+this.gameVariables[lhsStr]);
                break;
            case "-":
                this.gameVariables[lhsStr]-=parseInt(rhsStr);
                console.log("updated "+lhsStr +" to "+this.gameVariables[lhsStr]);
                break;
            case "=":
                if(this.isNumber(rhsStr)){
                    this.gameVariables[lhsStr]=parseInt(rhsStr);
                }else{
                    if(rhsStr==="true"){
                        this.gameVariables[lhsStr]=true;
                    }else if(rhsStr==="false"){
                        this.gameVariables[lhsStr]=false;
                    }else{
                        this.gameVariables[lhsStr]=rhsStr;
                    }
                }
                console.log("updated "+lhsStr +" to "+this.gameVariables[lhsStr]);
                break;
            case ">":
                if(this.gameVariables[lhsStr]>parseInt(rhsStr)){
                    return true;
                }else{
                    return false;
                }
                break;
            case "<":
                if(this.gameVariables[lhsStr]<parseInt(rhsStr)){
                    return true;
                }else{
                    return false;
                }
                break;
            case ">=":
                if(this.gameVariables[lhsStr]>=parseInt(rhsStr)){
                    return true;
                }else{
                    return false;
                }
                break;
            case "<=":
                if(this.gameVariables[lhsStr]<=parseInt(rhsStr)){
                    return true;
                }else{
                    return false;
                }
                break;
            case "==":
                if(this.isNumber(rhsStr)){
                    if(this.gameVariables[lhsStr]===parseInt(rhsStr)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(rhsStr==="true"){
                        if(this.gameVariables[lhsStr]){
                            return true;
                        }else{
                            return false;
                        }
                    }else if(rhsStr==="false"){
                        if(!this.gameVariables[lhsStr]){
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        if(this.gameVariables[lhsStr]===rhsStr){
                            return true;
                        }else{
                            return false;
                        }
                    }
                }
                break;                       
        }
        
    }
    isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0); }
}