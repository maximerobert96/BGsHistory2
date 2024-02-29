const dbManager = require('../dbManager');


function getActiveCardsMappingJson(){
    return dbManager.getJsonFromFile("./optimization/active-cards.json");    
}

function getChangesMappingJson(){
    return dbManager.getJsonFromFile("./optimization/card-changes.json");    
}

function getActiveCardsOfPatch(patchId){
    let activeCardsMappingJson = getActiveCardsMappingJson();
    let mappingActiveCardsOfPatch = activeCardsMappingJson[patchId];
    let activeCards = [];

    for(let version in mappingActiveCardsOfPatch){
        let cards = mappingActiveCardsOfPatch[version];
        let jsonOfPatch = dbManager.getJsonDBOfPatch(version);
        for(let card of cards){
            let activeCard = jsonOfPatch[card];
            activeCard.version = parseInt(version);
            activeCards.push(activeCard);
        }
    }
    return activeCards;
}

function getChangesOfPatch(patchId) {
    let changesMappingJson = getChangesMappingJson();
    return changesMappingJson[patchId];
}

module.exports = {
    getActiveCardsOfPatch, getChangesOfPatch
}