const dbManager = require('../dbManager');
const optimizerFunctions = require("./optimizationFilesFunctions");

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
    let associatedTribes = card.new.hasOwnProperty("associatedTribes") ? card.new.associatedTribes : ["GENERAL"] ;
    let isGolden = card.new.hasOwnProperty("battlegroundsNormalDbfId");
    let commonFields = {associatedTribes};
    if(isGolden) {
        commonFields = {...commonFields, battlegroundsNormalDbfId: card.new.battlegroundsNormalDbfId};
    }



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
        changesArray.push({changeType, newVersion, ...commonFields});
    }

    // returning
    if(olderVersionExists && (itIsNowAnActiveMinion || itIsNowAnActiveHero)) {
        let changeType = "returning";
        let newVersion = card.new.version;
        changesArray.push({changeType, newVersion, ...commonFields});
    }

    // removal
    if(itIsNoLongerAnActiveHero || itIsNoLongerAnActiveMinion) {
        let changeType = "removal";
        let oldVersion = card.old.version;
        
        changesArray.push({changeType, oldVersion, ...commonFields});
    }

    // change
    if((olderVersionExists && !allChangesAreNew && !allChangesAreOld) || changesArray.length === 0){
        let changeType = "change";
        let changes = card.changes;
        let oldVersion = card.old.version;
        let newVersion = card.new.version;
        changesArray.push({changeType, changes, oldVersion, newVersion, ...commonFields});
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
 

// createFullActiveCardsFile();
// createFullCardChangesFile();

function updateActiveCardsForPatch(patch) {
    let activeCardsJson = dbManager.getJsonFromFile("./optimization/active-cards.json");
    activeCardsJson[patch] = getOptimizedActiveCardsOfPatch(patch);
    dbManager.saveJsonToFile("./optimization/active-cards.json", activeCardsJson);
}

function updateCardChangesForPatch(patch) {
    let cardChangesJson = dbManager.getJsonFromFile("./optimization/card-changes.json");
    cardChangesJson[patch] = getCardChangesForAPatch(patch);
    dbManager.saveJsonToFile("./optimization/card-changes.json", cardChangesJson);
}


function createPutriFile(){
    // putri file would look like
        // [ patchWherePoolChanged: { pool1: [], pool2: [] } ]

    const PUTRI_POOL_1 = [
85651, 99117, 100775, 85152, 99116,
80084, 99122, 102298, 42782, 99573,
84370, 99118,    397, 69680, 99167,
99200, 95255,  95256, 99156, 91216,
96780, 95265,  95266,  2884, 99166,
47516, 58378,  99157, 95273, 95275,
99202, 99203,  95263, 95264
];

const PUTRI_POOL_2 = [
86190,  99120, 69661, 98735,
42773,  99576, 95246, 95248,
99159,  53402, 99577, 42777,
99578,  54002, 99524, 99160,
99201,  99162, 99161, 95253,
95254, 102938, 80087, 99121,
103579,  42446, 99527, 98867,
98868
];

    let putriObj = [];
    let patch = 205267;
    putriObj.push({[patch]: { pool1: PUTRI_POOL_1, pool2: PUTRI_POOL_2}
    });

    dbManager.saveJsonToFile("./optimization/putricide_pools.json", putriObj);


}



// function createBuddyFile() {
//     let currentPatch = 210009;
//     let activeCards = optimizerFunctions.getActiveCardsOfPatch(currentPatch);
//     let banned = [];
//     let nonBanned = [];
//     activeCards.forEach((card) => {
//         if(card.hasOwnProperty("battlegroundsBuddyDbfId")){
//             let buddyId = card.battlegroundsBuddyDbfId;
//             let buddy = dbManager.getCardById(buddyId, currentPatch);
//             // let buddyShortObj = { hero: card.name, name: buddy.name, techLevel: buddy.techLevel, text: buddy.text, buddyDbfId: buddy.dbfId }
//             if(buddy.hasOwnProperty("bannedFromFoaF")){
//                 banned.push(buddy.dbfId);
//             } else {
//                 nonBanned.push(buddy.dbfId);
//             }
//         }
//     })

//     let buddyPoolObj = [];
//     buddyPoolObj.push({[currentPatch]: { banned: banned, nonBanned: nonBanned}
//     });

//     dbManager.saveJsonToFile("./optimization/buddy_pools.json", buddyPoolObj);
// }

function createBuddyFile() {
    let currentPatch = 210009;
    let activeCards = optimizerFunctions.getActiveCardsOfPatch(currentPatch);
    let buddies = [];
    activeCards.forEach((card) => {
        if(card.hasOwnProperty("battlegroundsBuddyDbfId")){
            buddies.push(card.battlegroundsBuddyDbfId);
        }
    })

    let buddyPoolObj = [];
    buddyPoolObj.push({[currentPatch]: buddies});

    dbManager.saveJsonToFile("./optimization/buddy_pools.json", buddyPoolObj);
}

// maybe todo, do it like the active card file. Not a high priority
// function createBuddyOptimizationFile() {
//     let currentPatch = 210009;
//     let activeCards = optimizerFunctions.getActiveCardsOfPatch(currentPatch);
//     let buddies = [];
//     activeCards.forEach((card) => {
//         if(card.hasOwnProperty("battlegroundsBuddyDbfId")){
//             let buddyId = card.battlegroundsBuddyDbfId;
//             let buddy = dbManager.getCardById(buddyId, currentPatch);
//             // let buddyShortObj = { hero: card.name, name: buddy.name, techLevel: buddy.techLevel, text: buddy.text, buddyDbfId: buddy.dbfId }
//             if(buddy.hasOwnProperty("bannedFromFoaF")){
//                 banned.push(buddy.dbfId);
//             } else {
//                 nonBanned.push(buddy.dbfId);
//             }
//         }
//     })

//     let buddyPoolObj = [];
//     buddyPoolObj.push({[currentPatch]: { banned: banned, nonBanned: nonBanned}
//     });

//     dbManager.saveJsonToFile("./optimization/buddy_pools.json", buddyPoolObj);
// }

// console.log(dbManager.getCardById(113629, 210009));
// createBuddyFile();

function getPatchesAfterPatch(patchId) {
    let patchesJson = dbManager.getJsonFromFile("../patches.json");
    let patches = [];
    for(let patch in patchesJson) {
        if(parseInt(patch) > patchId) {
            patches.push(patch);
        }
    }
    return patches;
}

let patches = getPatchesAfterPatch(213852); // 213852 is the patch where the active cards file was last updated
console.log(patches);

//TODO there is currently a bug with the active cards. Gotta fix that

for(let patch of patches){
    updateActiveCardsForPatch(patch);
    updateCardChangesForPatch(patch);
}


// createFullCardChangesFile();