const { getJsonMappingFile, getCardById } = require('../server/db/dbManager');
const { getJsonFromFile, saveJsonToFile } = require('./blizzApiHandler');

// compare a card to itself from the previous patch
//      if it didn't exist, add the change
//      if the fields are different, add the change
//       adding the change = updating the mapping file and adding the card to [CURRENT_PATCH].json
//       when adding the card version to the patch, also update non-standard fields 
//          for updating non-standard fields:
//              copy over those fields from the last previous version if it exists
//              if it doesn't, relatedCards, associatedTribes can be generated

// that means I need to format the card "[CARD_DBFID]": {} for each cards

function comparePatches(bgCardsOfPrevious, bgCardsOfCurrent, currentPatchId){
    let previousPatch = formatCards(bgCardsOfPrevious);
    let currentPatch = formatCards(bgCardsOfCurrent);

    let directoryMapping = "./temp/"; //TODO update to real one later when everything works
    let directoryPatches = "./temp/patches/"; //TODO update to real one later when everything works
    let mapping = getJsonFromFile(`${directoryMapping}mapping.json`); 
    mapping.patches[currentPatchId] = [];

    let newVersionsInPatch = {};

    for(let id in currentPatch) {
        let cardAlreadyExists = mapping.cards.hasOwnProperty(id);
        if(cardAlreadyExists) {
            let currentVersion = currentPatch[id];
            let previousVersion = previousPatch[id];
            
            if(previousVersion === undefined) {
                console.error(`${id} already exists in the mapping file, but it's not in the patch before ${currentPatchId}.`);
                continue;
            }

            if(areVersionsDifferent(currentVersion, previousVersion)) {
                mapping.cards[id].push(currentPatchId);
                mapping.patches[currentPatchId].push(id);

                newVersionsInPatch[id] = addCustomFields(currentPatch[id], currentPatch);
            }

        } else {
            mapping.cards[id] = [ currentPatchId ];
            mapping.patches[currentPatchId].push(id);
        }
    }

    // TODO think about downloading images

    saveJsonToFile(`${directoryMapping}mapping.json`, mapping); // save mapping file
    saveJsonToFile(`${directoryPatches}${currentPatchId}.json`, newVersionsInPatch); // save newVersions file
}

function addCustomFields(card, cardsInPatch){
    let directory = "./temp/"; //TODO update to real one later when everything works
    let mapping = getJsonFromFile(`${directory}mapping.json`); 
    let cardWithCustomFields = card;
    let cardsArray = Object.values(cardsInPatch);

    if(mapping.cards.hasOwnProperty(card.dbfId)){
        let oldVersion = getCardById(card.dbfId); // should give the last version of the card since no patch is specified
        let newVersion = card;
        cardWithCustomFields = {...oldVersion, ...newVersion}; // keeps the custom fields of the old ones, and adds new values to existing ones.
        // FIXME: the problem is that it'll always add isBattlegroundsMinion (and other similar fields) instead of tracking the removal of that field.

    } else {
        cardWithCustomFields = addTribes(cardWithCustomFields);
        cardWithCustomFields = addTokens(cardWithCustomFields, cardsArray);
    }

    return cardWithCustomFields;
}

function addTribes(card) {

    // ignore cards that are not active
    if (!(card.hasOwnProperty("isBattlegroundsPoolMinion") || card.hasOwnProperty("battlegroundsHero"))){
        return card;
    }

    // ALL becomes GENERAL, others with card types keep them as tribes, and the
    // rest become GENERAL
    if (card.hasOwnProperty(races) && card.races.toString() === ["ALL"].toString()) {
        card.associatedTribes = ["GENERAL"];
    } else if (card.hasOwnProperty(races)) {
        card.associatedTribes = races;
    } else {
        card.associatedTribes = ["GENERAL"];
    }

    return card;
}

function addTokens(card, cardsArray) {

    let token = cardsArray.find( c =>
        c.id === card.id + "t");

    if(token !== undefined){
        card.relatedCards = [ token ];
    } 

    return card;
}

function formatCards(cardsArray){
    let formatted = {};
    for(let card of cardsArray) {
        formatted[card.dbfId] = card;
    }
    return formatted;
}


function areVersionsDifferent(currentVersion, previousVersion) {
    let areDifferent = false;
    let basicFieldsToCompare = [ "name", "techLevel", "races", "attack", "health", "cost", "text", "battlegroundsDarkmoonPrizeTurn"];
    let fieldsTrackAdditionOrRemoval = ["armor", "battlegroundsArmorTier", "isBattlegroundsPoolMinion", "battlegroundsHero", "battlegroundsBuddyDbfId"];

    for(let field of basicFieldsToCompare) {
        if(!(bothVersionsFieldDontExist(currentVersion, previousVersion, field) || onlyOneVersionExists(currentVersion, previousVersion, field) || bothVersionsFieldExistAndHaveSameValue(currentVersion, previousVersion, field))) {
            areDifferent = true;
            break;
        }
    }
    for(let field of fieldsTrackAdditionOrRemoval) {
        if(!(bothVersionsFieldDontExist(currentVersion, previousVersion, field) || bothVersionsFieldExistAndHaveSameValue(currentVersion, previousVersion, field))) {
            areDifferent = true;
            break;
        }
    }

    return areDifferent;
}

function bothVersionsFieldDontExist(currentVersion, previousVersion, field) {
    return !currentVersion[field] && !previousVersion[field];
}

function bothVersionsFieldExistAndHaveSameValue(currentVersion, previousVersion, field) {
    return currentVersion[field] && previousVersion[field] && currentVersion[field].toString() === previousVersion[field].toString();
}

function onlyOneVersionExists(currentVersion, previousVersion, field) {
    return (!currentVersion[field] && previousVersion[field]) || (currentVersion[field] && !previousVersion[field]);
}

module.exports = { comparePatches }