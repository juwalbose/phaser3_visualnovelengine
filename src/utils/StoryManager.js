export default class StoryManager 
{
    
    constructor(storyData)
	{
        this.storyData=storyData;
        this.gameVariables={};
        this.gameCharacters={};
        this.gameCharacterExpressions={};
        this.gameLocations={};

        /*this.directiveEnum = {location:"|LOCATION|",choice:"|CHOICE|", branch:"|GOTO|", check:"|IF|", label:"|LABEL"};
        this.directiveDelimiter = "|";
        this.variableTag="$";
        this.variationTag="_";
        this.separationTag=":";
        this.expSeparationTag="*";*/

        this.storyName=this.storyData.storyName.name;
        this.cfStoryName=this.storyData.storyName.aka;//computer friendly name

        this.directiveEnum = this.storyData.directiveEnum;
        this.directiveDelimiter = this.storyData.directiveDelimiter;
        this.variableTag=this.storyData.variableTag;
        this.variationTag=this.storyData.variationTag;
        this.separationTag=this.storyData.separationTag;
        this.expSeparationTag=this.storyData.expSeparationTag;

        this.storyFlow=this.storyData.storyFlow;
        this.currentChapter=0;
        this.currentSequence=-1;
        this.branchingData={};
        this.gameHasStarted=false;
        this.makingChoice=false;
    }
    parseLoadAndInitStory(logging=false){
        localStorage.clear();//comment off to enable loading from save

        let parseResult= this.parseAndValidateStory(logging);
        let file = JSON.parse(localStorage.getItem(this.cfStoryName+'_saveFile'));
        if(file){
            console.log("Loaded data :"+file);
            this.updateGameVariables(file);
            this.currentChapter=file.currentChapter;
            this.currentSequence=file.currentSequence-1;
        }else{
            console.log("No save data for "+this.storyName);
        }
        if(logging)console.log(this.gameVariables);

        return parseResult;
    }
    saveProgress(){
        let file = this.gameVariables;
        file.currentChapter=this.currentChapter;
        file.currentSequence=this.currentSequence;
        localStorage.setItem(this.cfStoryName+'_saveFile',JSON.stringify(file));

        // remove an item
        //localStorage.removeItem("item-key");
        // remove all items
        //localStorage.clear();
    }
    nextStep(){
        if(this.makingChoice){
            console.log("Need to make a choice");
            return;
        }
        if(!this.gameHasStarted)this.gameHasStarted=true;
        if(this.safeIncrementSequence()){
            const chapterObj = this.storyFlow[this.currentChapter];
            for (var key of Object.keys(chapterObj)) {
                //console.log(key + " -> " + chapterObj[key]);
                //let chapterName=key;
                let chapterData=chapterObj[key];
                let lineStr=chapterData[this.currentSequence].repeat(1);//passing by value not referecne
                if(this.evaluateLine(lineStr,null,null,null,true)){//enable disable logging
                    //autonext
                    this.nextStep();
                }
            }
        }else{
            console.log("No more chapters");
        }
    }
    makeChoice(whichChoice){
        if(this.makingChoice){
            console.log("choosing "+(whichChoice+1));
            this.makingChoice=false;
            const chapterObj = this.storyFlow[this.currentChapter];
            for (var key of Object.keys(chapterObj)) {
                let chapterData=chapterObj[key];
                let lineStr=chapterData[this.currentSequence].repeat(1);//passing by value not referecne
                if(this.evaluateLine(lineStr,null,null,null,true,whichChoice)){
                    //autonext
                    this.nextStep();
                }
            }
        }else{
            console.log("No choices available");
        }
    }
    safeIncrementSequence(){
        this.currentSequence++;
        let chapterObj = this.storyFlow[this.currentChapter];
        for (var key of Object.keys(chapterObj)) {
            let chapterData=chapterObj[key];
            if(this.currentSequence>=chapterData.length){
                this.currentSequence=0;
                this.currentChapter++;
            }
        }
        if(this.currentChapter>=this.storyFlow.length){
            return false;
        }else{
            chapterObj = this.storyFlow[this.currentChapter];
            for (var key of Object.keys(chapterObj)) {
                let chapterData=chapterObj[key];
                if(chapterData.length==0){
                    return false;
                }
            }
            return true;
        }
    }
    updateGameVariables(newGameVariables){
        for (var key of Object.keys(newGameVariables)) {
            //console.log(key + " -> " + newGameVariables[key]);
            if(this.gameVariables.hasOwnProperty(key)){
                this.gameVariables[key]=newGameVariables[key];
            }else{
                console.log("There is no gamevariable :"+key);
            }
        }
    }
    parseAndValidateStory(logging=false){
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

        let gameBranches={branchStarts:[],branchEnds:[]};

        for (let innerIndex = 0; innerIndex < this.storyFlow.length; innerIndex++) {
            const chapterObj = this.storyFlow[innerIndex];
            let chapterName="";
            let chapterData=[];
            //console.log(chapterObj);
            for (var key of Object.keys(chapterObj)) {
                //console.log(key + " -> " + chapterObj[key]);
                chapterName=key;
                chapterData=chapterObj[key];
                for (let sequenceIndex = 0; sequenceIndex < chapterData.length; sequenceIndex++) {
                    let lineStr=chapterData[sequenceIndex].repeat(1);//passing by value not referecne
                    this.evaluateLine(lineStr,innerIndex,sequenceIndex,gameBranches,logging);
                }
            }
        }

        if(logging){
            console.log(this.branchingData);
        }
        
        //console.log(this.gameBranches.branchEnds);
        let allbranchesOk=true;
        for (const key in gameBranches.branchStarts) {
            const element = gameBranches.branchStarts[key];
            if(gameBranches.branchEnds.indexOf(element)==-1){
                console.log("branch end not found for "+element);
                allbranchesOk=false;
            }
        }
        for (const key in gameBranches.branchEnds) {
            const element = gameBranches.branchEnds[key];
            if(gameBranches.branchStarts.indexOf(element)==-1){
                console.log("branch start not found for "+element);
                allbranchesOk=false;
            }
        }

        return allbranchesOk;
    }
    evaluateLine(lineStr,chapterIndex=-1,sequenceIndex=-1,gameBranches,logging,choiceMade=-1){
        let delimSplit=lineStr.split(this.directiveDelimiter);
        let autoNext=false;
        if(lineStr.startsWith(this.directiveEnum.location)){
            if(logging){console.log("set location :"+this.evaluateLocation(delimSplit[2]));}
            autoNext=true;
        }else if(lineStr.startsWith(this.directiveEnum.label)){
            if(logging){console.log("set label :"+delimSplit[1]);}
            if(!this.gameHasStarted){
                gameBranches.branchEnds.push(delimSplit[1]);
                this.branchingData[delimSplit[1]]={chapter:chapterIndex,sequence:sequenceIndex};
            }
            autoNext=this.evaluateLine(delimSplit[2],chapterIndex,sequenceIndex,gameBranches,logging);
        }else if(lineStr.startsWith(this.directiveEnum.choice)){
            let trimStr=lineStr.slice(this.directiveEnum.choice.length);
            let sepSplit=trimStr.split(this.separationTag);
            if(choiceMade!==-1){
                if(logging){console.log("choice made "+(choiceMade+1)+": "+sepSplit[choiceMade*2]+"="+sepSplit[1+(choiceMade*2)]);}
                //choice could be label or an expression to evaluate
                if(sepSplit[1+(choiceMade*2)].startsWith(this.directiveEnum.label)){
                    //|GOTO|:|LABEL3|
                    autoNext=this.evaluateLine(this.directiveEnum.branch+this.separationTag+sepSplit[1+(choiceMade*2)],chapterIndex,sequenceIndex,gameBranches,logging);
                }else{
                    autoNext=this.evaluateLine(sepSplit[1+(choiceMade*2)],chapterIndex,sequenceIndex,gameBranches,logging);
                }
                
            }else{
                if(logging)console.log(lineStr);
                for (let i = 0; i < sepSplit.length/2; i++) {
                    if(logging){
                        console.log("choice "+(i+1)+": "+sepSplit[i*2]+"="+sepSplit[1+(i*2)]);
                    }
                    if(!this.gameHasStarted){
                        //choice could be label or an expression to evaluate
                        if(sepSplit[1+(i*2)].startsWith(this.directiveEnum.label)){
                            //|GOTO|:|LABEL3|
                            autoNext=this.evaluateLine(this.directiveEnum.branch+this.separationTag+sepSplit[1+(i*2)],chapterIndex,sequenceIndex,gameBranches,logging);
                        }else{
                            autoNext=this.evaluateLine(sepSplit[1+(i*2)],chapterIndex,sequenceIndex,gameBranches,logging);
                        }
                    }
                }
                if(this.gameHasStarted)
                this.makingChoice=true;
            }
            
        }else if(lineStr.startsWith(this.directiveEnum.check)){
            let trimStr=lineStr.slice(this.directiveEnum.check.length);
            let sepSplit=trimStr.split(this.separationTag);
            if(logging){console.log("evaluate "+sepSplit[0]+" : "+sepSplit[1]);}
            //could be a label, if eval fails just continue on
            if(this.evaluateExpression(sepSplit[0].replaceAll(this.directiveDelimiter,"").replaceAll(this.variableTag,""),logging)){
                if(logging){console.log("evaluated true");}
                if(sepSplit[1].startsWith(this.directiveEnum.label)){
                    //|GOTO|:|LABEL3|
                    autoNext=this.evaluateLine(this.directiveEnum.branch+this.separationTag+sepSplit[1],chapterIndex,sequenceIndex,gameBranches,logging);
                }else{
                    autoNext=this.evaluateLine(sepSplit[1],chapterIndex,sequenceIndex,gameBranches,logging);
                }
            }else{
                if(logging){console.log("evaluated false");}
                if(!this.gameHasStarted){
                    if(sepSplit[1].startsWith(this.directiveEnum.label)){
                        //|GOTO|:|LABEL3|
                        autoNext=this.evaluateLine(this.directiveEnum.branch+this.separationTag+sepSplit[1],chapterIndex,sequenceIndex,gameBranches,logging);
                    }else{
                        autoNext=this.evaluateLine(sepSplit[1],chapterIndex,sequenceIndex,gameBranches,logging);
                    }
                }else{
                    autoNext=true;
                }
            }
        }else if(lineStr.startsWith(this.directiveEnum.branch)){
            let sepSplit=lineStr.split(this.separationTag);
            if(logging){console.log("branch to label :"+sepSplit[1]);}
            if(!this.gameHasStarted){
                gameBranches.branchStarts.push(sepSplit[1].replaceAll(this.directiveDelimiter,""));
            }else{
                this.assignBranch(sepSplit[1]);
                autoNext=true;
            }
        }else{
            //choice could be dialog or an expression to evaluate
            if(lineStr.startsWith(this.directiveDelimiter+this.variableTag)){
                this.evaluateExpression(lineStr.replaceAll(this.directiveDelimiter,"").replaceAll(this.variableTag,""),logging);
                autoNext=true;
            }else{
                //console.log("no special start :"+lineStr);
                let sepSplit=lineStr.split(this.separationTag);
                if(sepSplit.length>1){
                    if(sepSplit[1].includes(this.variableTag)){
                        sepSplit[1]=this.replaceVariables(sepSplit[1]);
                    }
                    if(logging){console.log(this.evaluateCharacter(sepSplit[0])+" says "+sepSplit[1]);}
                }else{
                    if(lineStr.includes(this.variableTag)){
                        lineStr=this.replaceVariables(lineStr);
                    }
                    if(logging){console.log("narrator says "+lineStr);}
                }
                //auto save here
                if(this.gameHasStarted){
                    this.saveProgress();
                }
            }
        }
        if(this.gameHasStarted){
            return autoNext;
        }
    }
    assignBranch(label){
        label=label.replaceAll(this.directiveDelimiter,"");
        this.currentChapter=this.branchingData[label].chapter;
        this.currentSequence=this.branchingData[label].sequence-1;
        console.log("New branch, chapter="+this.currentChapter+", sequence ="+this.currentSequence);
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
    evaluateExpression(exp,logging){
        let sepSplit=exp.split(this.expSeparationTag);
        let operatorStr=sepSplit[1];
        let lhsStr=sepSplit[0];
        let rhsStr=sepSplit[2];
        switch(operatorStr){
            case "+":
                if(!this.gameHasStarted){
                    if(logging){console.log("should increment "+lhsStr +" with "+rhsStr);}
                }else{
                    this.gameVariables[lhsStr]+=parseInt(rhsStr);
                    if(logging){console.log("updated "+lhsStr +" to "+this.gameVariables[lhsStr]);}
                }
                break;
            case "-":
                if(!this.gameHasStarted){
                    if(logging){console.log("should decrement "+lhsStr +" with "+rhsStr);}
                }else{
                    this.gameVariables[lhsStr]-=parseInt(rhsStr);
                    if(logging){console.log("updated "+lhsStr +" to "+this.gameVariables[lhsStr]);}
                }
                break;
            case "=":
                if(!this.gameHasStarted){
                    if(logging){console.log("should assign "+lhsStr +" with "+rhsStr);}
                }else{
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
                    if(logging){console.log("updated "+lhsStr +" to "+this.gameVariables[lhsStr]);}
                }
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