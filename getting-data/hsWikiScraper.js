const { JSDOM } = require("jsdom");

function addNewPatches() {
    JSDOM.fromURL("https://hearthstone.wiki.gg/wiki/Category:Patches")
    .then((dom) => {
        let elements = dom.window.document.getElementsByTagName("a");
        for(let element of elements){
            if(element.getAttribute("title")){
                let textOfElement = element.textContent;

                if(textOfElement.includes("Patch ") && textOfElement.indexOf(".") != -1) {
                    let indexLastPeriod = textOfElement.lastIndexOf(".");
                    let buildNumber = textOfElement.substring(indexLastPeriod + 1);
                    if(buildNumber >= 179020) { // arbitrary patch number for testing
                        let urlOfElem = `https://hearthstone.wiki.gg${element.getAttribute("href")}`;
                        
                        // TODO call the function that adds the patch info to my document
                        console.log(urlOfElem);
                    }
                }
            }
            
        }
    })
    .catch( error => console.log(error.message));
}

