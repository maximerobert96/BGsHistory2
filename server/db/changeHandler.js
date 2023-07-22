const dbManager = require('../db/dbManager');

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
function addNewChange(build, cardId, newFields, removedFields = [], areReplacing = false, affectedBuilds = "ALL_FROM_NOW", build2, modifyGolden = false, goldenText) {
    let mappingFile = dbManager.getJsonMappingFile();
    let cardInMapping = mappingFile.cards[cardId];
    let patchInMapping = mappingFile.patches[build];

    if(!mappingFile.cards.hasOwnProperty(cardId)) {
        mappingFile.cards[cardId] = [];
    }    
    let patchesOfChange = mappingFile.cards[cardId];
    
    if(!patchesOfChange.includes(build)) {
        patchesOfChange.push(build);
        patchesOfChange = patchesOfChange.sort((a,b) => a - b);
    }
    if(affectedBuilds === "ALL_FROM_NOW"){
        updateAllFromNow(patchesOfChange, build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText);
    } else if (affectedBuilds === "ONLY_THIS") {
        updateOnlyCurrent(build, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText);
    } else if (affectedBuilds === "RANGE" && build !== undefined && build2 !== undefined) {
        updateRange(patchesOfChange, build, build2, cardId, newFields, removedFields, areReplacing, modifyGolden, goldenText);
    } else {
        console.log("this shouldn't happen");
    }

    

    
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

function updateAllFromNow(patchesOfChange, build, cardId, newFields) {
    for(let currentPatch of patchesOfChange) {
        if(currentPatch < build) {
            continue;
        }
        addFieldsToCurrentCard(currentPatch, cardId, newFields);

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
function updateRange(patchesOfChange, build, build2, cardId, newFields) {
    if(build > build2) {
        let buildtemp = build;
        build = build2;
        build2 = buildtemp;
    }
    for(let currentPatch of patchesOfChange) {
        if(currentPatch < build || currentPatch >= build2) {
            continue;
        }
        addFieldsToCurrentCard(currentPatch, cardId, newFields);

    }
}

function updateOnlyCurrent(build, cardId, newFields) {
    addFieldsToCurrentCard(build, cardId, newFields);
}

function addFieldsToCurrentCard(currentPatch, cardId, newFields){
    let currentDb = dbManager.getJsonDBOfPatch(currentPatch);
    if(!currentDb.hasOwnProperty(cardId)) {
        currentDb[cardId] = getPreviousPatchCardObj(currentPatch, cardId);
    }
    for(let field in newFields) {
        currentDb[cardId][field] = newFields[field];
    }
    let newVersion = {[currentPatch]: currentDb[cardId]};
    console.log(JSON.stringify(newVersion));
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
    let build = 38377;
    let cardId = 59940;
    let newFields = {"name": "Pinocchio", "text": "I eat lizards"};
    let removedFields;
    let areReplacing;
    let affectedBuilds = "RANGE";
    let build2 = 79904;
    let modifyGolden = true;
    let goldenText = "LIZARDS!";
    addNewChange(build, cardId, newFields, removedFields, areReplacing, affectedBuilds, build2, modifyGolden, goldenText);
}

// testAddingTribeToMurkeye();
test2();