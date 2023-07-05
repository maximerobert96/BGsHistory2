const fs = require('fs');



function getFirstFive(){
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let values = Object.values(jsonDB);
    let value;
    let subset = [];
    for(let i = 0; i < 5; ++i) {
        value = values[i];
        subset.push(value);
    }
    return subset;
}

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

// function keepIdAndName( cardObj ) {
//     return { 
//         "name": cardObj["name"], 
//         "id": cardObj["dbfId"] 
//     }
// }

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

module.exports = { 
    getActiveCards
}