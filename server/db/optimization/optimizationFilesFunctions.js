const dbManager = require('../dbManager');


function getActiveCardsMappingJson(){
    return dbManager.getJsonFromFile("./optimization/active-cards.json");    
}

function getChangesMappingJson(){
    return dbManager.getJsonFromFile("./optimization/card-changes.json");    
}

function getPutricidePoolJson() {
    return dbManager.getJsonFromFile("./optimization/putricide_pools.json");   
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

function getPutricideCards(patchId) {
    let putriPoolJson = getPutricidePoolJson();

    let mostRecentPools;

    for(let patchObj of putriPoolJson) {
        let currentPatchId = Object.keys(patchObj)[0];
        if(parseInt(patchId) >= parseInt(currentPatchId)) {
            mostRecentPools = patchObj;
        } else {
            break;
        }
    }
    let recentPool1 = Object.values(mostRecentPools)[0].pool1;
    let recentPool2 = Object.values(mostRecentPools)[0].pool2;

    let currentCardsInPool1 = [];
    let currentCardsInPool2 = [];

    for(let cardId of recentPool1) {
        currentCardsInPool1.push(dbManager.getCardById(cardId));
    }
    for(let cardId of recentPool2) {
        currentCardsInPool2.push(dbManager.getCardById(cardId));
    }

    return {pool1: currentCardsInPool1, pool2: currentCardsInPool2};

    // dbManager.getCardById(patchId)
    console.log(recentPool1);


    // console.log(putriPoolJson[0]);

}

// getPutricideCards(205267);

module.exports = {
    getActiveCardsOfPatch, getChangesOfPatch, getPutricideCards
}