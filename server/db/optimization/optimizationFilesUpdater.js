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

