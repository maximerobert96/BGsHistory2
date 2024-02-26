const dbManager = require('../dbManager');

function optimizeActiveCardsFirstPatch() {
    let activeCards = dbManager.getActiveCardsOfPatch("35747");
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
    console.log(optimized);
}

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
    // TODO: for each patch
    let activeCardsForAll = {};
    activeCardsForAll["35747"] = getOptimizedActiveCardsOfPatch(35747);
    activeCardsForAll["144772"] = getOptimizedActiveCardsOfPatch(144772);
    return activeCardsForAll;
}

// right now this operation overwrites the file
function updateActiveCardsFile(){
    let jsonObj = getOptimizedActiveCardsForAllPatches();
    dbManager.saveJsonToFile("./optimization/active-cards.json", jsonObj);
}

// updateActiveCardsFile();