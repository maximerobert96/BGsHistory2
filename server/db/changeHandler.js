const dbManager = require('../db/dbManager');

/**
 * 
 * @param {*} build 
 * @param {*} cardId 
 * @param {*} newFields 
 * @param {*} removedFields 
 * @param {*} areReplacing 
 * @param {*} affectedBuilds "ALL_FROM_NOW", "ONLY_THIS", "RANGE" : for range [build1, build2[, "FIRST" or "RECENT" for bugfixes
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

    // affects the latest build only
    if(affectedBuilds === "RECENT") {
        build = patchesOfChange[patchesOfChange.length - 1];
    }

    if(affectedBuilds === "FIRST") {
        build = patchesOfChange[0];
    }

    patchesOfChange = addToSortedArray(patchesOfChange, build);
    let patchesOfChangeForGolden;

    if(!mappingFile.patches.hasOwnProperty(build)) {
        mappingFile.patches[build] = [];
        dbManager.addServerPatchToPatchesFile(build);
    }
    
    let cardsAffectedByBuild = mappingFile.patches[build];
    cardsAffectedByBuild = addToSortedArray(cardsAffectedByBuild, cardId);

    if(modifyGolden) {
        if(goldenId === undefined){
            goldenId = getGoldenId(cardId);
        }
        cardsAffectedByBuild = addToSortedArray(cardsAffectedByBuild, goldenId);
        if(!mappingFile.cards.hasOwnProperty(goldenId)) {
            mappingFile.cards[goldenId] = [];
        }
        patchesOfChangeForGolden = mappingFile.cards[goldenId];
        patchesOfChangeForGolden = addToSortedArray(patchesOfChangeForGolden, build);
    }

    if(affectedBuilds === "ALL_FROM_NOW" || affectedBuilds === "FIRST"){
        updateAllFromNow(patchesOfChange, build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);
    } else if (affectedBuilds === "ONLY_THIS" || affectedBuilds === "RECENT") {
        updateOnlyCurrent(build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);
    } else if (affectedBuilds === "RANGE" && build !== undefined && build2 !== undefined) {
        updateRange(patchesOfChange, build, build2, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);
    } else {
        throw new Error("this shouldn't happen");
    }

    // mappingFile = removeUnnecessaryChanges(mappingFile, build, cardId, goldenId);

    mappingFile.cards[cardId] = patchesOfChange;
    mappingFile.patches[build] = cardsAffectedByBuild;
    if(modifyGolden) {
        mappingFile.cards[goldenId] = patchesOfChangeForGolden;
    } 
    dbManager.saveJsonToFile("../mapping.json", mappingFile);
    
    
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
        try {
            updateFieldsToCurrentCard(currentPatch, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText, goldenId);
        } catch (error) {
            console.error(`card id: ${cardId}, current patch: ${currentPatch}`);
        }
        

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
    let currentDb;
    try{
        currentDb = dbManager.getJsonDBOfPatch(currentPatch);
    } catch(e) {
        currentDb = {};
    }
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

    dbManager.saveJsonDBOfPatch(currentDb, currentPatch);

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




module.exports = { addNewChange };