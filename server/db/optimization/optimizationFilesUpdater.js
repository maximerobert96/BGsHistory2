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

}

function getCardChangesForSecondPatch(){
    let changesSecondPatch = dbManager.getChangesOfPatch(36393);
    console.log(changesSecondPatch);
}

getCardChangesForSecondPatch();

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

// change types: new, returning, removal, buff, nerf, change, disable, hidden, bugfix, related
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
 