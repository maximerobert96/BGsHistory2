const dbManager = require('../db/dbManager');
const { saveJsonToFile, saveJsonDBOfPatch } = require('./dbUpdater');

/**
 * 
 * @param {*} build 
 * @param {*} cardId 
 * @param {*} newFields 
 * @param {*} removedFields 
 * @param {*} areReplacing 
 * @param {*} affectedBuilds "ALL_FROM_NOW", "ONLY_THIS", "RANGE"
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
    if(modifyGolden) {
        mappingFile.cards[goldenId] = patchesOfChangeForGolden;
    } 
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
    let build = 35747;
    let cardId = 57956; // giantfin
    let newFields = {"battlegroundsHero": true};
    let removedFields;
    let areReplacing = false;
    let affectedBuilds = "ALL_FROM_NOW";
    let build2;
    let modifyGolden = false;
    let goldenText;
    addNewChange(build, cardId, newFields, removedFields, areReplacing, affectedBuilds, build2, modifyGolden, goldenText);
}

function firstPatchChanges() {
    const heroesToAdd = ["King Mukla", "Patches the Pirate", "Ragnaros the Firelord", "Trade Prince Gallywix"]
    const minionsToAdd = ["Mecharoo", "Micro Machine", "Murloc Tidecaller", "Righteous Protector", "Voidwalker", "Annoy-o-Tron", "Kindly Grandmother", "Mounted Raptor", "Nightmare Amalgam", "Pogo-Hopper", "Shielded Minibot", "Zoobot", "Cobalt Guardian", "Crowd Favorite", "Crystalweaver", "Imp Gang Boss", "Infested Wolf", "Pack Leader", "Piloted Shredder", "Phalanx Commander", "Psych-o-Tron", "Shifter Zerus", "Tortollan Shellraiser", "Bolvar, Fireblood", "Festeroot Hulk", "Iron Sensei", "Siegebreaker", "Security Rover", "Piloted Sky Golem", "Menagerie Magician", "Junkbot", "The Beast", "Toxfin", "Virmen Sensei", "Ironhide Direhorn", "Mal'Ganis", "Sated Threshadon", "The Boogeymonster", "Gentle Megasaur", "Sneed's Old Shredder"];
    const heroesToRemove = ["Elise Starseeker", "Sir Finley Mrrgglton", "Sindragosa"];
    /*
	Change MechanoEgg to tier 5
	Change Voidlord to tier 6
    */
   for(let cardName of minionsToAdd) {
    let cardId = tempLookForCardId(cardName);
    if(cardId === undefined)
        continue;
    makeMinionActive(cardId, 35747);
   }
   for(let cardName of heroesToAdd) {
    let cardId = tempLookForCardId(cardName);
    if(cardId === undefined)
        continue;
    makeHeroActive(cardId, 35747);
   }
   for(let cardName of heroesToRemove) {
    let cardId = tempLookForCardId(cardName);
    if(cardId === undefined)
        continue;
    removeActiveHero(cardId, 35747);
   }
}

function makeMinionActive(cardId, buildId) {
    addNewChange(buildId, cardId, {"isBattlegroundsPoolMinion": true});
}

function makeHeroActive(cardId, buildId) {
    addNewChange(buildId, cardId, {"battlegroundsHero": true});
}

function removeActiveHero(cardId, buildId) {
    addNewChange(buildId, cardId, undefined, ["battlegroundsHero"]);
}

function tempLookForCardId(cardName) {
    let jsonDB = dbManager.getJsonDBOfPatch(35747);
    let cardsOfPatch = Object.values(jsonDB);
    let result = cardsOfPatch.find(card => card.name === cardName && (card.type === "HERO" || (card.hasOwnProperty("battlegroundsPremiumDbfId"))));
    if(result === undefined) {
        console.log(`Couldn't find the card for ${cardName}`);
        return;
    }
    return result.dbfId;
}

function testAddingChangeToNonexistentPatch() {
    let build = 36500;
    let cardId = 60213; // elise
    let newFields = {"battlegroundsHero": true};
    let removedFields;
    let areReplacing = false;
    let affectedBuilds = "ALL_FROM_NOW";
    let build2;
    let modifyGolden = false;
    let goldenText;
    addNewChange(build, cardId, newFields, removedFields, areReplacing, affectedBuilds, build2, modifyGolden, goldenText);
}

function moreToFirstPatch() {
    let build = 35747;
    addNewChange(build, 2074, {"techLevel": 4}, undefined, undefined, undefined, undefined, true, undefined, undefined);
    addNewChange(build, 962, {"techLevel": 4}, undefined, undefined, undefined, undefined, true, undefined, undefined);
    addNewChange(build, 49169, {"techLevel": 5}, undefined, undefined, undefined, undefined, true, undefined, undefined);
    addNewChange(build, 96797, {"techLevel": 6}, undefined, undefined, undefined, undefined, true, undefined, undefined);
}

function patch36500() {
    let build = 36500;
    // new heroes
    // elise already done
    addNewChange(build, 58435, {"battlegroundsHero": true}); // sindy
    addNewChange(build, 60214, {"battlegroundsHero": true}); // brann
    addNewChange(build, 60211, {"battlegroundsHero": true}); // finley
    // removed heroes
    addNewChange(build, 59814, undefined, ["battlegroundsHero"], undefined, "ONLY_THIS"); // mukla
    addNewChange(build, 57956, undefined, ["battlegroundsHero"]); // giantfin
    addNewChange(build, 57946, undefined, ["battlegroundsHero"], undefined, "ONLY_THIS"); // millificent
    addNewChange(build, 58044, undefined, ["battlegroundsHero"], undefined, "ONLY_THIS"); // lich
    // minions changed
    addNewChange(build, 60028, {"techLevel": 4}, undefined, undefined, undefined, undefined, true, undefined, undefined); // primalfin
    addNewChange(build, 96797, {"techLevel": 5}, undefined, undefined, undefined, undefined, true, undefined, undefined); // voidlord
    addNewChange(build, 2074, {"techLevel": 5}, undefined, undefined, undefined, undefined, true, undefined, undefined); // junkbot
    addNewChange(build, 96773, {"techLevel": 2}, undefined, undefined, undefined, undefined, true, undefined, undefined); // seer
    
}

function patch37060() {
    let build = 37060;
    // returning heroes
    addNewChange(build, 57946, {"battlegroundsHero": true}, undefined, undefined, "ONLY_THIS"); // milli
    addNewChange(build, 58044, {"battlegroundsHero": true}, undefined, undefined, "ONLY_THIS"); // lich
    // removed heroes
    addNewChange(build, 57947, undefined, ["battlegroundsHero"]); // patches
    addNewChange(build, 58546, undefined, ["battlegroundsHero"]); // bartendotron
    addNewChange(build, 59831, undefined, ["battlegroundsHero"]); // pyramad
    addNewChange(build, 57961, undefined, ["battlegroundsHero"]); // putri
    addNewChange(build, 57891, undefined, ["battlegroundsHero"]); // gally
    // other changes
    addNewChange(build, 2068, {"isBattlegroundsPoolMinion": true}); // floating watcher
    addNewChange(build, 58510, undefined, ["isAkamSecret"]); // hand of salvation
    
}

// patch37060();
// patch36500();
// temp();
// testAddingChangeToNonexistentPatch();

// manuallyAddingChange();

// testAddingTribeToMurkeye();
// test2();

// firstPatchChanges();
// makeMinionActive(2026, 35747);
// makeMinionActive(2030, 35747);
// makeMinionActive(38526, 35747);

// addNewChange(38203, 60028, {"techLevel": 5}, undefined, undefined, undefined, undefined, true, undefined, undefined); // primalfin

// moreToFirstPatch();