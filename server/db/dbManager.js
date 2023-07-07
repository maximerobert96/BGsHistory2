const fs = require('fs');


function isActiveCard( currentCard ) {
    return (currentCard["battlegroundsHero"] && currentCard["battlegroundsHero"] == true)
    || (currentCard["isBattlegroundsPoolMinion"] && currentCard["isBattlegroundsPoolMinion"] == true);
}

function getActiveCards() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let activeCards = [];
    

    for(let id in jsonDB) {
        let currentCard = jsonDB[id];

        if( isActiveCard(currentCard) ){
            activeCards.push(keepSpecificFields(currentCard));
        }
        
    }

    return activeCards;
}



function keepSpecificFields( cardObj ) {
    let newCardObj = {};
    
    if( !cardObj["name"] || !cardObj["dbfId"] || !cardObj["type"] ) {
        console.error(JSON.stringify(cardObj));
        return newCardObj;
    }

    newCardObj["name"] = cardObj["name"];
    newCardObj["id"] = cardObj["dbfId"];
    newCardObj["type"] = cardObj["type"];

    if(cardObj["type"] == "MINION") {
        newCardObj["tavernTier"] = cardObj["techLevel"];
    }

    return newCardObj;
}

function getCardById( id ) {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let currentCard = jsonDB[id];
    if(!currentCard) {
        throw new Error(`The card with the id ${id} doesn't exist.`);
    }
    currentCard = formatFields(currentCard, jsonDB);

    return currentCard;
}

function formatFields(card, jsonDB) {
    if(card.battlegroundsBuddyDbfId) {
        let buddyId = card.battlegroundsBuddyDbfId;
        let buddyName = jsonDB[buddyId].name;
        card.buddy = { name: buddyName, id: buddyId}
        delete card.battlegroundsBuddyDbfId;
    }
    if(card.heroPowerDbfId) {
        let hpId = card.heroPowerDbfId;
        let hpObj = jsonDB[hpId];
        if(hpObj.hideCost && hpObj.hideCost == true){
            card.heroPower = { name: hpObj.name, id: hpId, text: hpObj.text }
        } else {
            card.heroPower = { name: hpObj.name, id: hpId, cost: hpObj.cost, text: hpObj.text }
        }
        delete card.heroPowerDbfId;
    }
    if(card.relatedCards) {
        let relatedCardIds = card.relatedCards;
        let relatedCards = [];
        for (id of relatedCardIds){
            let cardName = jsonDB[id].name;
            relatedCards.push( {id: id, name: cardName} );
        }
        card.relatedCards = relatedCards;
    }
    if(card.techLevel){
        card.tavernTier = card.techLevel;
        delete card.techLevel;
    }

    card.id = card.dbfId;
    delete card.dbfId;

    return card;
}


// try {
//     console.log(JSON.stringify(getCardById( "101574" ), null, 2));
// } catch (error) {
//     console.error(error.message);
// }


module.exports = { 
    getActiveCards, getCardById
}