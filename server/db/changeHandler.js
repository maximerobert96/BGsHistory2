const dbManager = require('../db/dbManager');
const { saveJsonToFile, saveJsonDBOfPatch } = require('./dbUpdater');

/**
 * 
 * @param {*} build 
 * @param {*} cardId 
 * @param {*} newFields 
 * @param {*} removedFields 
 * @param {*} areReplacing 
 * @param {*} affectedBuilds 
 * @param {*} build2 
 * @param {*} modifyGolden 
 * @param {*} goldenText 
 */
function addNewChange(build, cardId, newFields, removedFields = [], areReplacing = false, affectedBuilds = "ALL_FROM_NOW", build2, modifyGolden = false, goldenText, goldenId) {
    let mappingFile = dbManager.getJsonMappingFile();   

    if(!mappingFile.cards.hasOwnProperty(cardId)) {
        mappingFile.cards[cardId] = [];
    }    
    let patchesOfChange = mappingFile.cards[cardId];
    patchesOfChange = addToSortedArray(patchesOfChange, build);
    
    let cardsAffectedByBuild = mappingFile.patches[build];
    cardsAffectedByBuild = addToSortedArray(cardsAffectedByBuild, cardId);

    if(modifyGolden) {
        if(goldenId === undefined){
            goldenId = getGoldenId(cardId);
        }
        cardsAffectedByBuild = addToSortedArray(cardsAffectedByBuild, goldenId);
    }

    if(affectedBuilds === "ALL_FROM_NOW"){
        updateAllFromNow(patchesOfChange, build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);
    } else if (affectedBuilds === "ONLY_THIS") {
        updateOnlyCurrent(build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);
    } else if (affectedBuilds === "RANGE" && build !== undefined && build2 !== undefined) {
        updateRange(patchesOfChange, build, build2, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);
    } else {
        throw new Error("this shouldn't happen");
    }

    // mappingFile = removeUnnecessaryChanges(mappingFile, build, cardId, goldenId);

    mappingFile.cards[cardId] = patchesOfChange;
    mappingFile.patches[build] = cardsAffectedByBuild;
    saveJsonToFile("./mapping.json", mappingFile);
    
    /*
    Do the changes. Verify the cards. Remove unnecessary changes.

    tests:
        Modify a card for all versions since the current one. The cardId already exists, the build already exists. (example: murloc tribe to old murkeye)
        Add a change to only one patch. The patch already exists. (example: changing tavern tier of boogeymonster)
        Further changing a card that is already being changed by a patch
        Add a change that doesn't change anything to the card, and when you compare the previous version to the current one, you realize there's no need for a new version
        Same thing, but it was a valid change at first, and now that we modified the change, it's back to the previous version
        Add a new card
        Change associated tribes of micro mummy until patch with dual-tribes
        Remove field isBattlegroundsHero from brann bronzebeard in one of the first few patches (when brann was removed)
    */
}

function removeUnnecessaryChanges(mappingFile, build, cardId, goldenId) {
    // TODO remove duplicate cards, changes that didn't change anything, etc.
}

function getGoldenId(cardId) {
    let mappingJson = dbManager.getJsonMappingFile();
    let firstPatch = mappingJson.cards[cardId][0];
    let firstPatchJson = dbManager.getJsonDBOfPatch(firstPatch);
    let cardObj = firstPatchJson[cardId];
    let goldenId = undefined;
    if(cardObj.hasOwnProperty("battlegroundsPremiumDbfId")) {
        goldenId = cardObj.battlegroundsPremiumDbfId;
    } else {
        throw new Error("No golden id could be found");
    }
    return goldenId;
}

function addToSortedArray(sortedArray, entry) {
    if(!(sortedArray.includes(entry) || sortedArray.includes(entry.toString()))) {
        sortedArray.push(entry);
        sortedArray = sortedArray.sort((a,b) => a - b);
    }
    return sortedArray;
}

function updateAllFromNow(patchesOfChange, build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId) {
    for(let currentPatch of patchesOfChange) {
        if(currentPatch < build) {
            continue;
        }
        updateFieldsToCurrentCard(currentPatch, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);

    }
}

/**
 * Second build is not included in the range. [build1,build2[
 * @param {*} patchesOfChange 
 * @param {*} build 
 * @param {*} build2 
 * @param {*} cardId 
 * @param {*} newFields 
 */
function updateRange(patchesOfChange, build, build2, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId) {
    if(build > build2) {
        let buildtemp = build;
        build = build2;
        build2 = buildtemp;
    }
    for(let currentPatch of patchesOfChange) {
        if(currentPatch < build || currentPatch >= build2) {
            continue;
        }
        updateFieldsToCurrentCard(currentPatch, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);

    }
}

function updateOnlyCurrent(build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId) {
    updateFieldsToCurrentCard(build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);
}

function updateFieldsToCurrentCard(currentPatch, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId){
    let currentDb = dbManager.getJsonDBOfPatch(currentPatch);
    let previousVersionObj = getPreviousPatchCardObj(currentPatch, cardId);
    let goldenVersionObj = {};
    
    if(!currentDb.hasOwnProperty(cardId)) {
        currentDb[cardId] = previousVersionObj;
    }
    let currentVersionObj = currentDb[cardId];
    
    if(modifyGolden) {
        goldenVersionObj = getGoldenVersionObj(currentDb, currentPatch, currentVersionObj, cardId, goldenId);
    }
    currentVersionObj = addFieldsToCard(currentVersionObj, newFields, areReplacing);
    currentVersionObj = deleteFieldsToCard(currentVersionObj, removedFields);

    if(modifyGolden) {
        let newFieldsForGolden = transformFieldsToGolden(newFields, goldenText, cardId);
        goldenVersionObj = addFieldsToCard(goldenVersionObj, newFieldsForGolden);
        goldenVersionObj = deleteFieldsToCard(goldenVersionObj, removedFields);
        currentDb[goldenId] = goldenVersionObj;
    }
    currentDb[cardId] = currentVersionObj;

    saveJsonDBOfPatch(currentDb, currentPatch);

    // let newVersion = {[currentPatch]: [currentVersionObj, goldenVersionObj]};
    // console.log(JSON.stringify(newVersion));
} 


function getGoldenVersionObj(currentDb, currentPatch, regularCardObj, cardId, goldenId) {
    let goldenVersionObj;
    let previousGoldenVersion = getPreviousPatchCardObj(currentPatch, goldenId);
    if(currentDb.hasOwnProperty(goldenId)) {
        goldenVersionObj = currentDb[goldenId];
    } else if (Object.keys(previousGoldenVersion).length) {
        goldenVersionObj = previousGoldenVersion;
    } else {
        goldenVersionObj = transformFieldsToGolden(regularCardObj, undefined, cardId);
        goldenVersionObj.dbfId = goldenId;
    }
    return goldenVersionObj;
}

function transformFieldsToGolden(newFields, goldenText, regularCardId) {
    let goldenNewFields = {...newFields};
    goldenNewFields.battlegroundsNormalDbfId = regularCardId;
    for(let field in goldenNewFields) {
        if(field === "attack" || field === "health") {
            goldenNewFields[field] = 2 * goldenNewFields[field];
        }
        if(field === "text" && goldenText !== undefined) {
            goldenNewFields[field] = goldenText;
        }
        if(isNotGoldenField(field)) {
            delete goldenNewFields[field];
        }
    }
    return goldenNewFields;
}

function isNotGoldenField(field) {
    return field === "associatedTribes" || field === "battlegroundsPremiumDbfId" || field === "isBattlegroundsPoolMinion";
}

function addFieldsToCard(card, newFields, areReplacing) {
    if(areReplacing) {
        card = newFields;
    } else {
        for(let field in newFields) {
            card[field] = newFields[field];
        }
    }
    
    return card;
}

function deleteFieldsToCard(card, removedFields) {
    for(let field of removedFields) {
        delete card[field];
    }
    return card;
}

function getPreviousPatchCardObj(currentPatch, cardId) {
    let mappingJson = dbManager.getJsonMappingFile();
    let previousPatch = dbManager.getPreviousPatchIdOfCard(currentPatch, cardId, mappingJson);
    if(previousPatch === undefined) {
        return {};
    } else {
        let jsonDB = dbManager.getJsonDBOfPatch(previousPatch);
        return jsonDB[cardId];
    }
}




function testAddingTribeToMurkeye(){
    let build = 35747; // first patch
    let cardId = 736; // old murkeye
    let affects = "ALL_FROM_NOW"; //updates all patches. ONLY_THIS, RANGE, ALL_FROM_NOW are the valid options. RANGE needs field build2
    let newFields = {associatedTribes: [ "MECHANICAL" ]};
    addNewChange(build, cardId, newFields, undefined, undefined, affects);
}

function testChangingBoogeymonstersTier(){
    // TODO: techLevel is already set to 4 everywhere. It should be at 5 since the first patch.
    // TODO: no link to the golden version in the first few patches
    let build = 38377;
    let cardId = 38895;
    let newFields = {"techLevel": 4};
    let modifyGolden = true;
}

function test2() {
    let build = 35747;
    let cardId = 96782; // hydra
    let newFields = {"panda" : 2};
    let removedFields;
    let areReplacing = false;
    let affectedBuilds = "ONLY_THIS";
    let build2;
    let modifyGolden;
    let goldenText;
    addNewChange(build, cardId, newFields, removedFields, areReplacing, affectedBuilds, build2, modifyGolden, goldenText);
}

function manuallyAddingChange() {
    let build = 38377;
    let cardId = 38895; // boogeymonster
    let newFields = {"techLevel": 4};
    let removedFields;
    let areReplacing = false;
    let affectedBuilds = "ALL_FROM_NOW";
    let build2;
    let modifyGolden = true;
    let goldenText;
    addNewChange(build, cardId, newFields, removedFields, areReplacing, affectedBuilds, build2, modifyGolden, goldenText);
}

// manuallyAddingChange();

// testAddingTribeToMurkeye();
// test2();
