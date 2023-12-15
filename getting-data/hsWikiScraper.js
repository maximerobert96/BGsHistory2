const { JSDOM } = require("jsdom");
const { getJsonFromFile, saveJsonToFile } = require('./blizzApiHandler');
const axios = require('axios').default;
const { getJsonMappingFile } = require('../server/db/dbManager');

async function getNewPatches(lastPatch) {
    
    return JSDOM.fromURL("https://hearthstone.wiki.gg/wiki/Category:Patches")
    .then(async (dom) => {
        let newPatches = {};
        let elements = dom.window.document.getElementsByTagName("a");
        const promises = [];
        for(let element of elements){
            if(element.getAttribute("title")){
                let textOfElement = element.textContent;

                if(textOfElement.includes("Patch ") && textOfElement.indexOf(".") != -1) {
                    let indexLastPeriod = textOfElement.lastIndexOf(".");
                    let buildNumber = textOfElement.substring(indexLastPeriod + 1);
                    if(buildNumber > lastPatch) {
                        let urlOfElem = `https://hearthstone.wiki.gg${element.getAttribute("href")}`;
                        
                        
                        promises.push(
                            getPatchFromUrl(urlOfElem).then(patchObj => {
                                newPatches = {...newPatches, [patchObj.build]: patchObj};
                                
                            })
                        );
                        
                        
                    }
                }
            }
            
        }
        await Promise.all(promises);
        return newPatches;
    })
    .catch( error => console.log(error.message));
    
}

async function getPatchFromUrl(patchUrl) {
    let patch = null;
    return JSDOM.fromURL(patchUrl).then( dom => {
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
        return patchObj;
    });
    


}

    
function getLastPatch(patches){
    let buildNumbersS = Object.keys(patches);
    // convert strings to numbers
    let buildNumbers = buildNumbersS.map(Number);
    return Math.max(...buildNumbers);
}

function saveNewPatches(oldPatches, newPatches){
    let updatedPatches = {...oldPatches, newPatches};
    saveJsonToFile("../server/patches2.json", updatedPatches);
}

function keepBgCards(json){
    let mappingJson = getJsonMappingFile();
    let cardsInMapping = mappingJson.cards;
    return json.filter(card => isValidBgCard(card, cardsInMapping));
}

function isValidBgCard(card, cardsInMapping){
    return cardsInMapping.hasOwnProperty(card.dbfId) || ((card.techLevel || card.set === "BATTLEGROUNDS") && card.type !== "ENCHANTMENT");
}

function getPatch(buildNumber) {
    return getJsonFromUrl(`https://api.hearthstonejson.com/v1/${buildNumber}/enUS/cards.json`)
        .then(json => {
            let bgCards = keepBgCards(json);
            return bgCards;
        });
}

function getJsonFromUrl(url){
    return axios.get(url, {responseType: "json"}).then((response) => {
        let json = response.data;
        return json;
    });
}

function main(){
    let patchesObj = getJsonFromFile("../server/patches.json");
    let lastPatch = getLastPatch(patches);
    getNewPatches(lastPatch).then( newPatchesObj => {
        // for each new build, compare to the previous one
        let previousPatch = getPatch(lastPatch);
        let newPatches = Object.keys(newPatchesObj)
            .sort((a,b) => a - b);
        for(let patch of newPatches){
            let currentPatch = getPatch(patch);
            comparePatches(previousPatch, currentPatch);
            previousPatch = currentPatch;
        }

        
        // at the end, save the new patches to the patches.json
        // saveNewPatches(patchesObj, newPatchesObj);
    });

}

// main();



// getPatch(190920).then( bgCards => {
//     let i = 0;
//     for(let card of bgCards){
//         if(i > 10)
//             break;
//         console.log(card);
//         i++;

//     }
// });