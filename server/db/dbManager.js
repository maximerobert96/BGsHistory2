const fs = require('fs');
const poolManager = require("./poolManager");


function isActiveCard( currentCard ) {
    return (currentCard["battlegroundsHero"] && currentCard["battlegroundsHero"] == true)
    || (currentCard["isBattlegroundsPoolMinion"] && currentCard["isBattlegroundsPoolMinion"] == true);
}

function getActiveCards(tribes) {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    if(arguments.length > 0) {
        jsonDB = keepCardsFromTribes(jsonDB, tribes);
    }
    let activeCards = [];
    

    for(let id in jsonDB) {
        let currentCard = jsonDB[id];

        if( isActiveCard(currentCard) ){
            activeCards.push(keepSpecificFields(currentCard));
        }
        
    }

    return activeCards;
}

function findMostRecentVersionLowerThanRef(referencePatch, patchesOfCardChange) {
    let highestPatch;
    for(let patch of patchesOfCardChange) {
        if(patch > referencePatch) {
            break;
        }
        highestPatch = patch;
    }
    return highestPatch;
}

function getActiveCardsOfPatch(patchId, tribes) {
    let mappingJson = getJsonFromFile("./mapping.json");
    let cards = mappingJson.cards;
    let activeCards = [];
    for(let cardId in cards) {
        let patchesOfCardChange = cards[cardId];
        if(patchId >= patchesOfCardChange[0]) {
            let highestPatch = findMostRecentVersionLowerThanRef(patchId, patchesOfCardChange);
            let jsonHighestPatch = getJsonFromFile(`./patches/enUS/${highestPatch}.json`);
            if(tribes) {
                jsonHighestPatch = keepCardsFromTribes(jsonHighestPatch, tribes);
            }
            let mostRecentVersionCard = jsonHighestPatch[cardId];
            if(mostRecentVersionCard && isActiveCard(mostRecentVersionCard)){
                activeCards.push(keepSpecificFields(mostRecentVersionCard));
            }

        }
    }
    
    return activeCards;
}

function getJsonFromFile(file) {
    return JSON.parse(fs.readFileSync(file));
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
    if(cardObj["associatedTribes"])
        newCardObj["tribes"] = cardObj["associatedTribes"];

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

function tempGetCardPoolNames(){
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let cardPools = [];
    for(let card of cards) {
        if(card.pools) {
            let pools = card.pools;
            for(let pool of pools) {
                if(!cardPools.includes(pool)) {
                    cardPools.push(pool);
                }
            }
        }
    }
    return cardPools;
}

// console.log(tempGetCardPoolNames());

function getCardsOfPool(cards, pool) {
    let cardsInPool = poolManager.getMinionsForPool(cards, pool);
    let cardsInPoolFormatted = [];
    for (let card of cardsInPool) {
        cardsInPoolFormatted.push(keepSpecificFields(card));
    }
    return cardsInPoolFormatted;
}

function keepCardsFromTribes(jsonDB, tribes) {
    let cardsFittingTribes = {};
    for(let id in jsonDB) {
        let card = jsonDB[id];
        if(isCardValidForTribes(card, tribes)){
            cardsFittingTribes[card.dbfId] = card;
        }
    }
    return cardsFittingTribes;
}

function isCardValidForTribes(card, tribes) {
    let isInTribes = false;
    if(card.associatedTribes) {
        for(let tribe of card.associatedTribes) {
            if(tribes.includes(tribe)){
                isInTribes = true;
            }
        }
    }
    let isBanned = false;
    if(card.bannedFromLobbies) {
        for(let tribe of card.bannedFromLobbies) {
            if(tribes.includes(tribe)){
                isBanned = true;
            }
        }
    }
    // return !isBanned && (!card.associatedTribes || isInTribes);
    return !isBanned && isInTribes;
}

// function temp(){
//     let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
//     let dbSubset = keepCardsFromTribes(jsonDB, ["MECHANICAL", "MURLOC"]);
//     let cards = getCardsOfPool(dbSubset, "DEATHRATTLE_POOL");
//     console.log(cards);
// }

// temp();



module.exports = { 
    getActiveCards, getActiveCardsOfPatch, getCardById, getCardsOfPool
}