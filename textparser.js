class MyValidator{
    constructor(){
        this.states = {
            DATA_STATE : 0,
            START_TAG_STATE : 1,
            ENG_TAG_START_STATE : 2,
            BEFORE_ATTRIBUTE_NAME_STATE : 3,
            ATTRIBUTE_NAME_STATE : 4,
            BEFORE_ATTRIBUTE_VALUE_STATE : 5,
            ATTRIBUTE_VALUE_STATE : 6,
        }
    }



    processOpenTag(tagName, stack, endTag){
        // console.log(tagName);
        if(stack.includes("p") && (tagName === "p" || tagName === "div")){
            console.log("p tag can't contain p or div element");
            return "Invalid";
        }

        stack.push(tagName);
    }

    processCloseTag(tagName, stack){
        if(stack.length == 0){
            console.log("Closing tag without opening found");
            return "Invalid";
        }
        else{
            if(stack[stack.length - 1] != tagName){
                console.log("Wrong nesting, mismatch of opening and closing tag");
                return "Invalid";
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
        let currentArrributeName = "";
        let currentAttributeValue = "";

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
                        if(this.processOpenTag(currentTagName, stack, false) == "Invalid")
                        return;
                        currentTagName = "";
                    }
                    else{
                        if(currentTagName == "" && currentChar == ' '){
                            console.log("Unexpected space in tag name");
                            return;
                        }
                        else if(currentChar >= 'a' && currentChar <= 'z')
                        currentTagName= currentTagName + currentChar;
                        else if(currentChar == ' '){                //if space encounter after tag name then switch state
                            currentState = this.states.BEFORE_ATTRIBUTE_NAME_STATE;
                        }
                        else{
                            console.log("Wrong tag name found");
                            return;
                        }
                    }
                    break;

                case this.states.ENG_TAG_START_STATE :
                    if(currentChar == '>')
                    {
                        if(this.processCloseTag(currentTagName, stack, true) == "Invalid")
                        return;
                        currentTagName = "";
                        currentState = this.states.DATA_STATE;
                    }
                    else{
                        if(currentTagName == "" && currentChar == ' '){
                            console.log("Unexpected space in tag name");
                            return;
                        }
                        if(currentChar >= 'a' && currentChar <= 'z')
                        currentTagName+=currentChar;
                        else if(currentChar == ' '){
                            while(rawText[i] != '>'){           //this will ignore all the character after tag name in case of ending tag
                                i+=1;
                            }
                            i-=1;
                        }
                        else{
                            console.log("Wrong tag name found");
                            return;
                        }

                    }
                    break;

                case this.states.BEFORE_ATTRIBUTE_NAME_STATE:
                    if(currentChar == ' ')
                    {
                    }
                    else if (currentChar == '>'){
                        if(this.processOpenTag(currentTagName, stack, false) == "Invalid")
                        return;
                        currentTagName = "";
                        currentState = this.states.DATA_STATE;
                    }
                    else if(currentChar >= 'a' && currentChar <= 'z')
                    {
                        currentArrributeName = currentChar;
                        currentState = this.states.ATTRIBUTE_NAME_STATE;
                    }
                    else
                    {
                        console.log("Unexpected character before attribute name");
                        return;
                    }
                    break;


                case this.states.ATTRIBUTE_NAME_STATE:
                    if(currentChar >= 'a' && currentChar <= 'z')
                    {
                        currentArrributeName += currentChar;
                    }
                    else if(currentChar == '=')
                    {
                        currentState = this.states.BEFORE_ATTRIBUTE_VALUE_STATE;
                    }
                    else if(currentChar == ' ')
                    {
                        
                    }
                    else if(currentChar == '>'){
                        if(this.processOpenTag(currentTagName, stack, false) == "Invalid")
                        return;
                        currentTagName = "";
                        currentState = this.states.DATA_STATE;
                    }
                    else {
                        console.log("Invalid character in attribute name");
                        return;
                    }
                    break;


                case this.states.BEFORE_ATTRIBUTE_VALUE_STATE:
                    if(currentChar == ' '){
                    }
                    else if (currentChar == '=')
                    {
                        // currentState = this.states.BEFORE_ATTRIBUTE_VALUE_STATE;
                        console.log("Multiple = are not allowed in attribute name");
                        return;
                    }
                    else if(currentChar == '"' || currentChar == "'") {
                        currentAttributeValue = "";
                        let quote = currentChar;
                        i++;

                        while(i < rawText.length && rawText[i] != quote) {
                            currentAttributeValue += rawText[i];
                            i++;
                        }

                        if(rawText[i] != quote)
                        {
                            console.log("Attribute value o not closed properly");
                            return;
                        }
                        currentState = this.states.BEFORE_ATTRIBUTE_NAME_STATE;
                    }
                    else
                    {
                        console.log("Attribute value must start with quote");
                        return;
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

obj.processText("<p>this is <span><div></div></span> </p>")

obj.processText("<div>this is a div</div>")

obj.processText("<div></div tfberkf ;rlfjor>")

obj.processText("< p>This is a paragraph</p>")

obj.processText("<p>This is a paragraph</ p>")

obj.processText("<p class = '>This is a paragraph</ p>")

obj.processText("<p class = 'para>This is a paragraph</ p>")

obj.processText("<p class == 'para>This is a paragraph</ p>")

obj.processText("<p class='hdhjs' id = 'name'>This is a paragraph</p >")