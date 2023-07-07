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
        newCardObj["techLevel"] = cardObj["techLevel"];
    }

    return newCardObj;
}

function getCardById( id ) {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let currentCard = jsonDB[id];
    if(!currentCard) {
        throw new Error(`The card with the id ${id} doesn't exist.`);
    }

    return currentCard;
}

// try {
//     console.log(JSON.stringify(getCardById( "101574" ), null, 2));
// } catch (error) {
//     console.error(error.message);
// }


module.exports = { 
    getActiveCards, getCardById
}