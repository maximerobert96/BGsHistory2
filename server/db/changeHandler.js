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
function addNewChange(build, cardId, newFields, removedFields = [], areReplacing = false, affectedBuilds = "CURRENT", build2, modifyGolden = false, goldenText) {
    let mappingFile = dbManager.getJsonMappingFile();
    if(mappingFile.cards.hasOwnProperty(cardId) && mappingFile.cards[cardId].includes(build)) {
        console.log("test");
    }
    
    /*
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

function testAddingTribeToMurkeye(){
    let build = 35747; // first patch
    let cardId = 736; // old murkeye
    let affects = "ALL"; //updates all patches. CURRENT, RANGE, ALL are the valid options. RANGE needs field build2
    let newFields = {"associatedTribes": [ "MURLOC" ]};
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

testAddingTribeToMurkeye();