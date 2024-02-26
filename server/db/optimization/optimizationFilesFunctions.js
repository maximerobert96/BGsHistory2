const dbManager = require('../dbManager');
const path = require('path');


function getActiveCardsMappingJson(){
    return dbManager.getJsonFromFile("./optimization/active-cards.json");    
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

    // return dbManager.getJsonDBOfPatch("35747");
}

module.exports = {
    getActiveCardsOfPatch
}