const dbManager = require('./dbManager');

// for each card in the patch db, verify that cards in relatedCards, premiumid, normalid, hpid, etc. exist

function verifyId(card, jsonDB, property) {
    if(card.hasOwnProperty(property)){
        let idToVerify = card[property];
        if(!jsonDB.hasOwnProperty(idToVerify)) {
            console.log(`could not verify id ${idToVerify} for ${card.dbfId}. ${card.name} doesn't have ${property}`);
        }
    }
}

const jsonDB = dbManager.getJsonDBOfPatch(35747);
let cards = Object.values(jsonDB);
for(let card of cards) {
    verifyId(card, jsonDB, "battlegroundsNormalDbfId");
    verifyId(card, jsonDB, "battlegroundsPremiumDbfId");
    verifyId(card, jsonDB, "dbfId");
    verifyId(card, jsonDB, "heroPowerDbfId");
    if(card.hasOwnProperty("relatedCards")){
        let idsToVerify = card.relatedCards;
        for(let idToVerify of idsToVerify) {
            if(!jsonDB.hasOwnProperty(idToVerify)) {
                console.log(`could not verify id ${idToVerify} for ${card.dbfId}`);
            }
        }
        
    }
}