const { getJsonMappingFile } = require('../server/db/dbManager');
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
        // import custom fields from the last version we have
        let oldVersion = {}; // TODO: find the previous version in my db
        let newVersion = card;
        cardWithCustomFields = {...oldVersion, ...newVersion}; // keeps the custom fields of the old ones, and adds new values to existing ones

    } else {
        // create associatedTribes field
        // create relatedCards field (by getting tokens) (this will use cardsArray)
    }


    return cardWithCustomFields;
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

let oldVersionWithCustomFields = { attack: 1, health: 2, customField1: "field"};
let newestVersion = {attack: 5, health: 2};

let newestVersionWithCustomFields = { ...oldVersionWithCustomFields, ...newestVersion};
console.log(JSON.stringify(newestVersionWithCustomFields, null, 2));