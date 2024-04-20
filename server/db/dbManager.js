const fs = require('fs-extra');
const poolManager = require("./poolManager");
const path = require('path');
const { generateCard } = require('../generate/generatePhImage');


function isActiveCard( currentCard ) {
    return (currentCard.hasOwnProperty("battlegroundsHero") && currentCard["battlegroundsHero"] == true)
    || (currentCard.hasOwnProperty("isBattlegroundsPoolMinion") && currentCard["isBattlegroundsPoolMinion"] == true)
    || (currentCard.hasOwnProperty("isBattlegroundsPoolSpell") && currentCard["isBattlegroundsPoolSpell"] == true);
}

function getMostRecentPatch() {
    let mappingJson = getJsonMappingFile();
    let patchesOfMapping = Object.keys(mappingJson.patches);
    let mostRecentPatch = patchesOfMapping[patchesOfMapping.length - 1];

    return mostRecentPatch;
}

function getActiveCardsOfRecentPatch() {
    return getActiveCardsOfPatch(getMostRecentPatch());
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
    let mappingJson = getJsonFromFile("../mapping.json");
    let cards = mappingJson.cards;
    let activeCards = [];
    let patchIdNum = parseInt(patchId);
    for(let cardId in cards) {
        let patchesOfCardChange = cards[cardId];
        if(patchIdNum >= patchesOfCardChange[0]) {
            let highestPatch = findMostRecentVersionLowerThanRef(patchIdNum, patchesOfCardChange);
            let jsonHighestPatch = getJsonFromFile(`../patches/enUS/${highestPatch}.json`);
            if(tribes) {
                jsonHighestPatch = keepCardsFromTribes(jsonHighestPatch, tribes);
            }
            let mostRecentVersionCard = jsonHighestPatch[cardId];
            if(mostRecentVersionCard && isActiveCard(mostRecentVersionCard)){
                mostRecentVersionCard["version"] = highestPatch;
                activeCards.push(mostRecentVersionCard);
            }

        }
    }
    
    return activeCards;
}

function getJsonFromFile(file) {
    return JSON.parse(fs.readFileSync(absolutePath(file)));
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

function getCardById( cardId, patch ) {
    if(patch === undefined) {
        patch = getMostRecentPatch();
    }
    let patchOfCurrentVersion = getPreviousOrEqualPatchIdOfCard(patch, cardId, getJsonMappingFile());
    let jsonDB = getJsonDBOfPatch(patchOfCurrentVersion);
    let currentCard = jsonDB[cardId];
    if(!currentCard) {
        throw new Error(`The card with the id ${cardId} doesn't exist.`);
    }
    // currentCard = formatFields(currentCard, jsonDB);
    currentCard["version"] = patchOfCurrentVersion;

    return currentCard;
}

function formatFields(card, jsonDB) {
    if(card.battlegroundsBuddyDbfId) {
        let buddyId = card.battlegroundsBuddyDbfId;
        // let buddyName = jsonDB[buddyId].name;
        card.buddy = jsonDB[buddyId];
        // card.buddy = { name: buddyName, id: buddyId}
        // delete card.battlegroundsBuddyDbfId;
    }
    if(card.heroPowerDbfId) {
        let hpId = card.heroPowerDbfId;
        let hpObj = jsonDB[hpId];
        card.heroPower = hpObj;
        // if(hpObj.hideCost && hpObj.hideCost == true){
        //     card.heroPower = { name: hpObj.name, id: hpId, text: hpObj.text }
        // } else {
        //     card.heroPower = { name: hpObj.name, id: hpId, cost: hpObj.cost, text: hpObj.text }
        // }
        // delete card.heroPowerDbfId;
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

    // card.id = card.dbfId;
    // delete card.dbfId;

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

function getCardsOfPool(patchId, pool) {
    let tempJson = getActiveCardsOfPatch(patchId);
    return poolManager.getCardsForPool(tempJson, pool);
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

function getJsonMappingFile() {
    return getJsonFromFile("../mapping.json");
}

function getJsonDBOfPatch(patchId) {
    return getJsonFromFile(`../patches/enUS/${patchId}.json`);
}

function absolutePath(relativePath){
    return path.resolve(__dirname, relativePath);
}


function getChangesOfPatch(patchId) {
    let mappingJson = getJsonMappingFile();
    let idsChangesOfPatch = mappingJson.patches[patchId];
    let currentPatchJson = getJsonDBOfPatch(patchId);
    let patchInfo = getJsonFromFile("../patches.json")[patchId];
    let cardsChanged = {"patchInfo": patchInfo, "cardChanges": []};

    for(let id of idsChangesOfPatch) {
        let currentChange = {};
        currentChange[id] = {};
        let previousPatchId = getPreviousPatchIdOfCard(patchId, id, mappingJson);
        let newVersion = currentPatchJson[id];
        let oldVersion;
        if(previousPatchId.toString() === patchId.toString()) {
            oldVersion = {};
        } else {
            oldVersion = getJsonDBOfPatch(previousPatchId)[id];
        }
        currentChange[id].changes = getChangesBetweenVersions(newVersion, oldVersion);
        newVersion.version = patchId;
        oldVersion.version = previousPatchId;
        
        currentChange[id].new = newVersion;
        currentChange[id].old = oldVersion;
        
        cardsChanged.cardChanges.push(currentChange);
    }

    return cardsChanged;
}

function getChangesBetweenVersions(newVersion, oldVersion) {
    let fieldsNew = Object.keys(newVersion);
    let fieldsOld = Object.keys(oldVersion);
    let allFields = concatAndDedupArrays(fieldsNew, fieldsOld);
    let fieldsBeingChanged = {};

    for(let field of allFields) {
        if(!existsInBothAndSame(newVersion, oldVersion, field)) {
            fieldsBeingChanged[field] = {};
            fieldsBeingChanged[field] = {};
            fieldsBeingChanged[field].new = newVersion[field];
            fieldsBeingChanged[field].old = oldVersion[field];
        }
    }
    return fieldsBeingChanged;
}

function existsInBothAndSame(version1, version2, field) {
    return version1.hasOwnProperty(field) && version2.hasOwnProperty(field) && version1[field].toString() === version2[field].toString();
}

function concatAndDedupArrays(array1, array2) {
    return array1.concat(array2.filter((item) => array1.indexOf(item) < 0));
}

function getPreviousPatchIdOfCard(currentPatchId, cardId, mappingJson) {
    if(!mappingJson.cards.hasOwnProperty(cardId)){
        return undefined;
    }
    let cardVersions = mappingJson.cards[cardId];
    let previousPatchId;
    let patch;
    for(patch of cardVersions) {
        if(patch >= currentPatchId) {
            break;
        }
        previousPatchId = patch;
    }
    return previousPatchId === undefined ? patch : previousPatchId;
}

function getPreviousOrEqualPatchIdOfCard(currentPatchId, cardId, mappingJson) {
    if(!mappingJson.cards.hasOwnProperty(cardId)){
        return undefined;
    }
    let cardVersions = mappingJson.cards[cardId];
    let previousPatchId;
    for(let patch of cardVersions) {
        if(parseInt(patch) > parseInt(currentPatchId)) {
            break;
        }
        previousPatchId = patch;
    }
    return previousPatchId;
}

function getCardChangesOfId(cardId) {
    let mappingJson = getJsonMappingFile();
    let patchOfChanges = mappingJson.cards[cardId];
    let currentCard;
    let previousCard = {};
    let cardChangesObj = {};
    let changes;

    for(let patch of patchOfChanges) {
        currentCard = getJsonDBOfPatch(patch)[cardId];
        changes = getChangesBetweenVersions(currentCard, previousCard);
        previousCard = currentCard;
        cardChangesObj[patch] = {changes: changes, cardVersion: currentCard};
    }

    return cardChangesObj;
}

function addServerPatchToPatchesFile(build) {
    let patches = getJsonFromFile("./patches.json");
    patches[build] = {build: build, patchNotes: "", releaseDate: "", serverSide: true};
    saveJsonToFile("./patches.json", patches);
}

function saveJsonToFile(filename, jsonObj) {
    fs.writeFileSync(absolutePath(filename), JSON.stringify(jsonObj, null , 2));
}

function saveJsonDBOfPatch(jsonObj, patch, locale) {
    if(locale === undefined){
        locale = "enUS";
    }
    saveJsonToFile(`../patches/${locale}/${patch}.json`, jsonObj);
}

function generatePlaceholder(dbfId, version, locale){
    if(locale === undefined){
        locale = "enUS";
    }
    let card = getCardById(dbfId, version);
    generateCard(card).then((res) => {
        if(res !== undefined){
            fs.ensureDirSync(absolutePath(`../../client/public/placeholder/${locale}/${version}`));
            fs.writeFileSync(absolutePath(`../../client/public/placeholder/${locale}/${version}/${dbfId}.png`), res);
        }
    })
}

/**
 * Gets an array of patchIds in a range. [oldest, ..., newest]
 * 
 * @param {*} oldestPatchId first id being included
 * @param {*} newestPatchId last id being included. If no newest id is there, newest is the most current one
 * 
 * @returns 
 */
function getPatchIdsInRange(oldestPatchId, newestPatchId){
    if(oldestPatchId === undefined){
        throw Error("getPatchIdsInRange should have at least one argument.");
    }
    let mappingJson = getJsonMappingFile();
    let patchesOfMapping = Object.keys(mappingJson.patches);

    if(newestPatchId === undefined){
        newestPatchId = patchesOfMapping[patchesOfMapping.length - 1];
    }

    let oldestPatchNum = parseInt(oldestPatchId);
    let newestPatchNum = parseInt(newestPatchId);
    let range = [];

    for(let patch of patchesOfMapping){
        let patchNum = parseInt(patch);
        if(patchNum >= oldestPatchNum && patchNum <= newestPatchNum ){
            range.push(patchNum);
        }
    }

    return range;
}

module.exports = { 
    getActiveCards: getActiveCardsOfRecentPatch, getActiveCardsOfPatch, getCardById, getCardsOfPool, getChangesOfPatch, getCardChangesOfId, getJsonDBOfPatch, getJsonMappingFile, getPreviousPatchIdOfCard: getPreviousOrEqualPatchIdOfCard, addServerPatchToPatchesFile, saveJsonToFile, absolutePath, getJsonFromFile, saveJsonDBOfPatch, generatePlaceholder, getPatchIdsInRange
}