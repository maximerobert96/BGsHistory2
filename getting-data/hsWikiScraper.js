const { JSDOM } = require("jsdom");

function addNewPatches() {
    let newPatches = {};
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
                        getPatchFromUrl.then(patchObj => {
                            newPatches = {...newPatches, [patchObj.build]: patchObj};
                        });
                        console.log(urlOfElem);
                    }
                }
            }
            
        }
    })
    .catch( error => console.log(error.message));
}

function getPatchFromUrl(patchUrl) {
    let patch = null;
    JSDOM.fromURL(patchUrl).then( dom => {
        let releaseDate;
        let patchNumber;
        let build;
        let patchNotesUrl;
        let elements = dom.window.document.getElementsByClassName("pi-item pi-data pi-item-spacing pi-border-color");
        let externalTextElements = dom.window.document.getElementsByClassName("external text");

        for (let element of elements){
            let attr = element.getAttribute("data-source");
            switch (attr) {
                case "releaseDate": {
                    releaseDate = element.lastElementChild.textContent;
                    break;
                }
                case "version": {
                    patchNumber = element.lastElementChild.textContent;
                    break;
                }
                case "build": {
                    build = element.lastElementChild.textContent;
                    break;
                }
            }
            
        }

        for(let externalTextElem of externalTextElements){

            if (externalTextElem.textContent === "Patch Notes") {
                patchNotesUrl = externalTextElem.getAttribute("href");
                break;
            }

        }

        patchNotesUrl = patchNotesUrl ? patchNotesUrl : patchUrl;

        let patchObj = { patchNotes: patchNotesUrl, build: build, releaseDate: releaseDate, patchNumber: patchNumber };
        console.log(JSON.stringify(patchObj));
        // resolve(patchObj);

        // console.log(releaseDate, patchNumber, build, patchNotesUrl);
    });
    


}
getPatchFromUrl("https://hearthstone.wiki.gg/wiki/Patch_23.6.2.144772");
// getPatchFromUrl("https://hearthstone.wiki.gg/wiki/Patch_28.0.0.189017");

