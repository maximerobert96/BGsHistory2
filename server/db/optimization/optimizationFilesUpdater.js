const dbManager = require('../dbManager');

/**
 * Gives an object of the format 
 * {
    "35747": [ "248", "1008", ... ],
    "36393": ["6788", "10023", ...]
  }

 * @param {*} patchId 
 * @returns 
 */
function getOptimizedActiveCardsOfPatch(patchId) {
    let activeCards = dbManager.getActiveCardsOfPatch(patchId);
    let optimized = {};
    let currentVersion;
    activeCards.forEach((card) => {
        currentVersion = parseInt(card.version);
        if(optimized.hasOwnProperty(currentVersion)){
            optimized[currentVersion].push(card.dbfId);
        } else {
            optimized[currentVersion] = [card.dbfId];
        }
    });
    return optimized;
}

function getOptimizedActiveCardsForAllPatches(){
    let activeCardsForAll = {};
    let patchesJson = dbManager.getJsonFromFile("../patches.json");
    for(let patchId in patchesJson){
        activeCardsForAll[patchId] = getOptimizedActiveCardsOfPatch(patchId);
    }

    return activeCardsForAll;
}

// takes several minutes to run
function createFullActiveCardsFile(){
    let jsonObj = getOptimizedActiveCardsForAllPatches();
    dbManager.saveJsonToFile("./optimization/active-cards.json", jsonObj);
}


function createFullCardChangesFile(){
    let changesForAll = {};
    let patchesJson = dbManager.getJsonFromFile("../patches.json");
    for(let patchId in patchesJson){
        try {
            changesForAll[patchId] = getCardChangesForAPatch(patchId);
        } catch (error) {
            console.error(error.message);
        }
        
    }
    dbManager.saveJsonToFile(`./optimization/card-changes.json`, changesForAll);
}

function getCardChangesForAPatch(patchId){
    let changesSecondPatch = dbManager.getChangesOfPatch(patchId).cardChanges;
    let changesJson = {};
    for(let change of changesSecondPatch) {
        try {
            let cardDbfId = Object.keys(change)[0];
            let changesArray = convertToChangesArray(change);
        
            changesJson[cardDbfId] = changesArray;
        } catch (error) {
            console.error(error.message);
        }
        
    }
    

    return changesJson;
}

/**
 * Types of change that can automatically be determined: change, new, returning, removal
 * @param {*} card 
 * @returns 
 */
function convertToChangesArray(change){
    let cardDbfId = Object.keys(change)[0];
    let card = change[cardDbfId];
    let changesArray = [];
    let olderVersionExists = parseInt(card.old.version) !== parseInt(card.new.version);
    let itIsNowAnActiveMinion = (card.changes.hasOwnProperty("isBattlegroundsPoolMinion") && card.changes.isBattlegroundsPoolMinion.new !== undefined);
    let itIsNowAnActiveHero = (card.changes.hasOwnProperty("battlegroundsHero") && card.changes.battlegroundsHero.new !== undefined);
    let itIsNoLongerAnActiveMinion = (card.changes.hasOwnProperty("isBattlegroundsPoolMinion") && card.changes.isBattlegroundsPoolMinion.old !== undefined);
    let itIsNoLongerAnActiveHero = (card.changes.hasOwnProperty("battlegroundsHero") && card.changes.battlegroundsHero.old !== undefined);
    let allChangesAreNew = true;
    for(let field in card.changes){
        if(card.changes[field].old !== undefined) {
            allChangesAreNew = false;
            break;
        }
    }

    let allChangesAreOld = true;
    for(let field in card.changes){
        if(card.changes[field].new !== undefined) {
            allChangesAreOld = false;
            break;
        }
    }

    // new
    if(!olderVersionExists) {
        let changeType = "new";
        let newVersion = card.new.version;
        changesArray.push({changeType, newVersion});
    }

    // returning
    if(olderVersionExists && (itIsNowAnActiveMinion || itIsNowAnActiveHero)) {
        let changeType = "returning";
        let newVersion = card.new.version;
        changesArray.push({changeType, newVersion});
    }

    // removal
    if(itIsNoLongerAnActiveHero || itIsNoLongerAnActiveMinion) {
        let changeType = "removal";
        let oldVersion = card.old.version;
        
        changesArray.push({changeType, oldVersion});
    }

    // change
    if((olderVersionExists && !allChangesAreNew && !allChangesAreOld) || changesArray.length === 0){
        let changeType = "change";
        let changes = card.changes;
        let oldVersion = card.old.version;
        let newVersion = card.new.version;
        changesArray.push({changeType, changes, oldVersion, newVersion});
    }

    return changesArray;
}

// getCardChangesForAPatch();

// createFullCardChangesFile();


// how the card changes file could look:
// {
//     "36393": {
        // "208": [
        //     {
        //         "comment": "Leapfrogger got added",
        //         "changeType": "new",
        //         "changes": { ... },
        //         "oldVersion": 35747,
        //         "newVersion": 36393
        //     },
//             {
//                 "comment": "Leapfrogger got temporarily disabled due to crashes",
//                 "changeType": "disabled",
//                 "changes": { ... },
//                 "oldVersion": 35747,
//                 "newVersion": 36393
//             },
//         ]
//     }
// }

// change types: new, returning, removal, buff, nerf, change, disable, hidden, enable, bugfix, related
// related: if a card got changed because of a related card that got changed, could just point to that card.
// for example, Zephrys buddy got nerfed, so Zephrys got nerfed. Mukla's hero power got nerfed, so Mukla got nerfed.
// "103": [
//     {
//         "comment": "Mukla's hero power got changed",
//         "changeType": "related",
//         "heroPowerDbfId": 104
//     }
// ],
// "104": [
//     {
//         "comment": "Nerf to Bananarama",
//         "changeType": "nerfed",
//         "changes": { ... },
//         "oldVersion": 35747,
//         "newVersion": 36393
//     }
// ],
// "108": [
//     {
//         "comment": "Zephrys' buddy got nerfed",
//         "changeType": "related",
//         "buddyDbfId": 110
//     }
// ]
 

createFullActiveCardsFile();
createFullCardChangesFile();