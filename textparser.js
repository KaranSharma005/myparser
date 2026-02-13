class MyValidator{
    constructor(){
        this.states = {
            DATA_STATE : 0,
            START_TAG_STATE : 1,
            ENG_TAG_START_STATE : 2,

        }
    }

    processOpenTag(tagName, stack){
        console.log(tagName);
        stack.push(tagName);
    }

    processCloseTag(tagName, stack){
        console.log(tagName);
        if(stack.length == 0){
            console.log("Closing tag without opening found");
            return;
        }
        else{
            if(stack[stack.length - 1] != tagName){
                console.log("Wrong nesting, mismatch of opening and closing tag");
                return;
            }
            else{
                stack.pop();
            }
        }
    }

    processText(rawText)
    {
        let currentState = this.states.DATA_STATE;
        let i = 0;
        let currentTagName = "";
        let stack = [];

        while(i < rawText.length)
        {
            const currentChar = rawText.charAt(i).toLowerCase();
            switch(currentState) {
                case this.states.DATA_STATE :
                    if(currentChar == '<'){
                        currentState = this.states.START_TAG_STATE;
                    }
                    break;
                
                case this.states.START_TAG_STATE :
                    if(currentChar == '/'){
                        currentState = this.states.ENG_TAG_START_STATE;
                    }
                    else if(currentChar == '>'){
                        currentState = this.states.DATA_STATE;
                        this.processOpenTag(currentTagName, stack);
                        currentTagName = "";
                    }
                    else{
                        if(currentChar >= 'a' && currentChar <= 'z')
                        currentTagName= currentTagName + currentChar;
                        else{
                            console.log("Wrong tag name found");
                            return;
                        }
                    }
                    break;

                case this.states.ENG_TAG_START_STATE :
                    if(currentChar == '>')
                    {
                        this.processCloseTag(currentTagName, stack);
                        currentTagName = "";
                        currentState = this.states.DATA_STATE;
                    }
                    else{
                        if(currentChar >= 'a' && currentChar <= 'z')
                        currentTagName+=currentChar;
                        else{
                            console.log("Wrong tag name found");
                            return;
                        }

                    }
                    break;
            }
            i+=1;
        }
        if(stack.length > 0){
            console.log("Open tags found that are not closed!!!");
            return ;
        }
        else{
            console.log("Valid");
        }
    }
}

let obj = new MyValidator();

obj.processText("<div>");

obj.processText("<div>this is a div</div>");

obj.processText("<p>this is <span> span</span> </p>")