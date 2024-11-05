const fs = require("fs");
const dbManager = require('./dbManager');

function addField(cardIds, field, value){
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    for(let id of cardIds) {
        let currentCard = jsonDB[id];
        currentCard[field] = value;
    }
    fs.writeFileSync("./db/currentDb.json", JSON.stringify(jsonDB, null , 2));
}

function listBuddiesAndIds(){
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let buddies = [];
    for(let id in jsonDB){
        let currentCard = jsonDB[id];
        if(currentCard.type && currentCard.type === "HERO" && currentCard.battlegroundsBuddyDbfId){
            let buddyId = currentCard.battlegroundsBuddyDbfId;
            let buddy = jsonDB[buddyId];
            if(!buddies.includes(buddy)){
                buddies.push(buddy);
            }
        }
    }
    buddies.sort((a,b) =>
        a.techLevel - b.techLevel
    );
    for(let buddy of buddies){
        console.log(`id: ${buddy.dbfId}, name: ${buddy.name}, tavern tier: ${buddy.techLevel}`);
    }
}

function addingTribes() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    for(let id in jsonDB) {
        let currentCard = jsonDB[id];
        if(currentCard.races && !currentCard.races.includes("ALL")) {
            currentCard.associatedTribes = currentCard.races;
        } else if (currentCard.type && (currentCard.type === "HERO" || currentCard.type === "MINION")) {
            currentCard.associatedTribes = [ "GENERAL" ];
        }
    }
    fs.writeFileSync("./db/currentDb.json", JSON.stringify(jsonDB, null , 2));
}

function removingAssociatedTribesFromSkins() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    for(let id in jsonDB) {
        let currentCard = jsonDB[id];
        if(currentCard.associatedTribes && currentCard.battlegroundsSkinParentId) {
            delete currentCard.associatedTribes;
        }
    }
    fs.writeFileSync("./db/currentDb.json", JSON.stringify(jsonDB, null , 2));
}

function removingAssociatedTribesFromBuddies() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    for(let id in jsonDB) {
        let currentCard = jsonDB[id];
        if(currentCard.associatedTribes && currentCard.isBattlegroundsBuddy && currentCard.isBattlegroundsBuddy === true) {
            delete currentCard.associatedTribes;
        }
    }
    fs.writeFileSync("./db/currentDb.json", JSON.stringify(jsonDB, null , 2));
}

function removingAssociatedTribesFromEverythingExceptActiveCards() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    for(let id in jsonDB) {
        let currentCard = jsonDB[id];
        if(!((currentCard["battlegroundsHero"] && currentCard["battlegroundsHero"] == true)
        || (currentCard["isBattlegroundsPoolMinion"] && currentCard["isBattlegroundsPoolMinion"] == true))) {
            delete currentCard.associatedTribes;
        }
    }
    fs.writeFileSync("./db/currentDb.json", JSON.stringify(jsonDB, null , 2));
}

function changingAlltoGeneralForTribes(){
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    for(let id in jsonDB) {
        let currentCard = jsonDB[id];
        if(currentCard.associatedTribes && currentCard.associatedTribes.includes("ALL")) {
            currentCard.associatedTribes = [ "GENERAL" ];
        }
    }
    fs.writeFileSync("./db/currentDb.json", JSON.stringify(jsonDB, null , 2));
}

function addCustomFieldsToAllVersions(customFields) {
    let referencePatch = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    for(let card of Object.values(referencePatch)) {
        let fieldsToUpdate = [];
        for(let field of customFields) {
            if(card.hasOwnProperty(field)) {
                fieldsToUpdate.push(field);
            }
        }
        updateVersionsUsingMappingFile(fieldsToUpdate, card);
    }
}

function updateVersionsUsingMappingFile(fieldsToUpdate, referenceCard) {
    let referenceId = referenceCard.dbfId;
    let mappingJson = JSON.parse(fs.readFileSync("./mapping.json"));
    let patchesToUpdate = mappingJson.cards[referenceId];
    for(let patchId of patchesToUpdate) {
        let patchJson = JSON.parse(fs.readFileSync(`./patches/enUS/${patchId}.json`));
        for(let field of fieldsToUpdate) {
            if(!patchJson[referenceId].hasOwnProperty(field)) {
                patchJson[referenceId][field] = referenceCard[field];
            }
        }
        fs.writeFileSync(`./patches/enUS/${patchId}.json`, JSON.stringify(patchJson, null , 2));
    }
}

function updatePatchesJson() {
    let patchesJson = JSON.parse(fs.readFileSync("./patches.json"));
    let newPatchesJson = {}; // {build: patchObj, build2: patchObj} instead of list
    for(let patchObject of patchesJson) {
        newPatchesJson[patchObject.build] = patchObject;
    }
    fs.writeFileSync(`./patches.json`, JSON.stringify(newPatchesJson, null , 2));
}



function updateOldCardsWithNormalAndGolden() {
    addCustomFieldsToAllVersions(["battlegroundsPremiumDbfId", "battlegroundsNormalDbfId"]);
}

function updateOldCardsWithHp() {
    addCustomFieldsToAllVersions(["heroPowerDbfId"]);
}


function addTribesToAllCardsThatWereActive() {
    let activeCardsId = getAllActiveCardsId();
    let mappingJson = dbManager.getJsonMappingFile();
    for(let cardId of activeCardsId) {
        let patchesOfCard = mappingJson.cards[cardId];
        for(let patch of patchesOfCard) {
            let jsonOfPatch = dbManager.getJsonDBOfPatch(patch);
            let currentVersion = jsonOfPatch[cardId];
            if(!currentVersion.hasOwnProperty("associatedTribes")) {
                let newVersion = addTribesToCard(currentVersion);
                jsonOfPatch[cardId] = newVersion;
                saveJsonToFile(`./patches/enUS/${patch}.json`, jsonOfPatch);
            }
        }
    }
}

function addTribesToCard(card) {
    let newCard = card;
    if(newCard.hasOwnProperty("races") && newCard.races.toString() !== ["ALL"].toString()) {
        newCard.associatedTribes = newCard.races;
    } else {
        newCard.associatedTribes = [ "GENERAL" ];
    }
    return newCard;
}

function getAllActiveCardsId() {
    let mappingJson = dbManager.getJsonMappingFile();
    let activeCardsId = [];
    for(let cardId in mappingJson.cards) {
        let patchesOfCard = mappingJson.cards[cardId];
        for(let patch of patchesOfCard) {
            let jsonOfPatch = dbManager.getJsonDBOfPatch(patch);
            let currentVersion = jsonOfPatch[cardId];
            if(isActiveCard(currentVersion)) {
                activeCardsId.push(cardId);
                break;
            }
        }
    }
    return activeCardsId;
}

function isActiveCard( currentCard ) {
    return currentCard["battlegroundsHero"] || currentCard["isBattlegroundsPoolMinion"];
}


// addingTribes();
// removingAssociatedTribesFromSkins();
// removingAssociatedTribesFromBuddies();
// removingAssociatedTribesFromEverythingExceptActiveCards();
// changingAlltoGeneralForTribes();

// listBuddiesAndIds();

// const customFields = ["associatedTribes", "pools", "bannedFromFoaF", "undeadCreationPool", "battlegroundsDiabloPrizeTurn", "bannedFromRewards", "bannedFromQuests", "bannedFromNguyen", "isAkamSecret", "relatedCards"];
// addCustomFieldsToAllVersions(customFields);

// updatePatchesJson();

// updateOldCardsWithNormalAndGolden();

// addTribesToAllCardsThatWereActive();
// updateOldCardsWithHp();

// const PUTRI_POOL_1 = [
// 85651, 99117, 100775, 85152, 99116,
// 80084, 99122, 102298, 42782, 99573,
// 84370, 99118,    397, 69680, 99167,
// 99200, 95255,  95256, 99156, 91216,
// 96780, 95265,  95266,  2884, 99166,
// 47516, 58378,  99157, 95273, 95275,
// 99202, 99203,  95263, 95264
// ];

// const PUTRI_POOL_2 = [
// 86190,  99120, 69661, 98735,
// 42773,  99576, 95246, 95248,
// 99159,  53402, 99577, 42777,
// 99578,  54002, 99524, 99160,
// 99201,  99162, 99161, 95253,
// 95254, 102938, 80087, 99121,
// 103579,  42446, 99527, 98867,
// 98868
// ]

// const BANNED_FROM_FOAF = [
//     77843, 77514, 77629, 77508, 
//     77484, 77800, 77788, 77872,
//     77890, 98635, 101435, 77837,
//     77792, 77809, 77882, 98656,
//     77495, 77510, 77723, 77511,
//     77829, 77813, 77888, 77794,
//     77776, 77833, 77778, 77880
// ]

// addField(BANNED_FROM_FOAF, "bannedFromFoaF", true);

// addField(PUTRI_POOL_1, "undeadCreationPool", 1);
// addField(PUTRI_POOL_2, "undeadCreationPool", 2);

function deleteCardFromDb(dbfId) {
    // delete it from mapping file
        // find the card, find the associated patches. Delete the card, and delete the card from the associated patches
    // delete the pictures for each associated patches if they can be found
    // delete the data from each [patch].json files

    // for each patch of the card, deleteCardFromPatch(dbfId, currentPatch)

    let mappingJson = dbManager.getJsonMappingFile();
    let patchesOfCard = mappingJson.cards[dbfId];
    patchesOfCard.forEach(patch => {
        deleteCardFromPatch(dbfId, patch);
    });
}

function deleteCardFromPatch(dbfId, patchId){
    // update mapping file
    let mappingJson = dbManager.getJsonMappingFile();
    let patchesOfCard = mappingJson.cards[dbfId];
    let cardsInPatch = mappingJson.patches[patchId];
    patchesOfCard = patchesOfCard.filter(element => parseInt(element) != parseInt(patchId) );
    cardsInPatch = cardsInPatch.filter(element => parseInt(element) != parseInt(dbfId) );

    //   delete the card field if there are no longer any associated patches for it
    if(patchesOfCard.length === 0) {
        delete mappingJson.cards[dbfId];
    } else {
        mappingJson.cards[dbfId] = patchesOfCard;
    }
    mappingJson.patches[patchId] = cardsInPatch;

    dbManager.saveJsonToFile("../mapping.json", mappingJson);
    
    // update [patch].json
    let patchJson = dbManager.getJsonDBOfPatch(patchId);
    delete patchJson[dbfId];
    dbManager.saveJsonToFile(`../patches/enUS/${patchId}.json`, patchJson);

    // delete the picture
    try {
        fs.unlinkSync(dbManager.absolutePath(`../../client/public/cards/en-US/${patchId}/${dbfId}.png`));
    } catch (error) {
        console.log(error.message);
    }
    
}



function updateDbfId(oldDbfId, newDbfId) {
    // TODO update in the mapping file
    // TODO update in every patch file (gotta go through all of them, because it can be referenced in hpDbfId, premiumDbfId, etc. I need to update in all of these fields)
    // TODO rename the pictures


    // siegebreaker: 100720 -> 54835. That card already exists.
    // golden minibot and other stuff. These cards don't exist for the right id
    // some other duplicates like Brann, Cave Hydra
}

function addHeroDbfIdToHPsAndBuddies(){
    // for each card in the database, find the most recent version.
    // if it's a hero card, add a heroDbfId field to its buddy and hero power in every version of them

    let mappingJson = dbManager.getJsonMappingFile();
    let cardsFromMapping = mappingJson.cards;
    for(let dbfIdMapping in cardsFromMapping) {
        let versionsOfCard = cardsFromMapping[dbfIdMapping];
        let mostRecentVersion = versionsOfCard[versionsOfCard.length - 1];
        let cardMostRecent = dbManager.getJsonDBOfPatch(mostRecentVersion)[dbfIdMapping];
        
        if(isAHero(cardMostRecent)) {
            if(cardMostRecent.hasOwnProperty("heroPowerDbfId")){
                let hpDbfId = cardMostRecent.heroPowerDbfId;
                addParentHeroToAllVersions(hpDbfId, dbfIdMapping, cardsFromMapping[hpDbfId]);
            }
            if(cardMostRecent.hasOwnProperty("battlegroundsBuddyDbfId")){
                let buddyDbfId = cardMostRecent.battlegroundsBuddyDbfId;
                addParentHeroToAllVersions(buddyDbfId, dbfIdMapping, cardsFromMapping[buddyDbfId]);
            }

        }


        
    }
}

function addParentHeroToAllVersions(dbfId, heroDbfId, patches){
    try {
        for(let patch of patches) {
            let patchJson = dbManager.getJsonDBOfPatch(patch);
            let cardToUpdate = patchJson[dbfId];
            if(!cardToUpdate.hasOwnProperty("heroDbfId")) {
                cardToUpdate.heroDbfId = heroDbfId;
                patchJson[dbfId] = cardToUpdate;
                dbManager.saveJsonDBOfPatch(patchJson, patch);
            }
        }
    } catch (error) {
        console.error(`error. DbfId: ${dbfId}, heroDbfId: ${heroDbfId}, patches: ${patches}`);
        console.error(error.message);
    }
    
}

function isAHero(card) {
    return card.hasOwnProperty("type") && card.type === "HERO" && !card.hasOwnProperty("battlegroundsSkinParentId");
}


function deleteVersionFieldFromPatches(patches){
    try {
        for (let patch of patches){
            let patchJson = dbManager.getJsonDBOfPatch(patch);
            for(let cardId in patchJson){
                let card = patchJson[cardId];
                if(card.hasOwnProperty("version")){
                    delete card.version;
                }
            }
            dbManager.saveJsonDBOfPatch(patchJson, patch);
        }
    } catch (error) {  
        console.error(error.message);  
    }
    
}

// let patches = [194648, 195316, 195635, 197064];
// deleteVersionFieldFromPatches(patches);

// function addIsActiveTSpellField(){
//     let patches = dbManager.getPatchIdsInRange(190416);
    
//     try {
//         for (let patch of patches){
//             let patchJson = dbManager.getJsonDBOfPatch(patch);
//             for(let cardId in patchJson){
//                 let card = patchJson[cardId];
//                 if(card.hasOwnProperty("type") && card.type === "BATTLEGROUND_SPELL"){
//                     card.isActiveTavernSpell = true;
//                     card.associatedTribes = ["GENERAL"];
//                 }
//             }
//             dbManager.saveJsonDBOfPatch(patchJson, patch);
//         }
//     } catch (error) {  
//         console.error(error.message);  
//     }
// }

function changeFieldNameOfActiveTSpell() {
    let patches = dbManager.getPatchIdsInRange(190416);

    try {
        for (let patch of patches){
            let patchJson = dbManager.getJsonDBOfPatch(patch);
            for(let cardId in patchJson){
                let card = patchJson[cardId];
                if(card.hasOwnProperty("isActiveTavernSpell")){
                    card.isBattlegroundsPoolSpell = card.isActiveTavernSpell;
                    delete card.isActiveTavernSpell;
                }
            }
            dbManager.saveJsonDBOfPatch(patchJson, patch);
        }
    } catch (error) {  
        console.error(error.message);  
    }

}

// changeFieldNameOfActiveTSpell();

function addDuoSpecificField() {
    let patch = 198037;
    let patchJson = dbManager.getJsonDBOfPatch(patch);
    
    for(let cardId in patchJson){
        let card = patchJson[cardId];
        if(card.hasOwnProperty("id") && card.id.includes("BGDUO")){
            card.isDuoCard = true;
        }
    }
    dbManager.saveJsonDBOfPatch(patchJson, patch);
        
}

function addEndOfTurnToCards() {
    const dbfIds = [66246,
        86292,
        99034,
        62269,
        97604,
        104545,
        108115,
        70144,
        98588,
        104440,
        110409,
        110383,
        100580,
        96703,
        104561,
        105518,
        70165,
        72067,
        112882,
        106512,
        87084,
        64424,
        64426];

        dbfIds.forEach(dbfId => addMechanicToCard(dbfId, "END_OF_TURN"));

}

function addMechanicToCard(dbfId, mechanic) {
    let patches = getAllPatchesOfId(dbfId);
    patches.forEach(patch => {
        let patchJson = dbManager.getJsonDBOfPatch(patch);
        let card = patchJson[dbfId];

        if(card.hasOwnProperty("mechanics")){
            card.mechanics.push(mechanic);
        } else {
            card.mechanics = [mechanic];
        }

        patchJson[dbfId] = card;
        dbManager.saveJsonDBOfPatch(patchJson, patch);
    })
}

function getAllPatchesOfId(dbfId){
    const mappingJson = dbManager.getJsonMappingFile();
    return mappingJson.cards[dbfId];
}

function addStartOfCombatToCards() {
    const dbfIds = [64402,
        79720,
        61406,
        104672,
        61851,
        86014,
        59863,
        77911,
        77990,
        98728,
        108873,
        110042,
        98582,
        108116,
        95006,
        108922,
        72073,
        105665,
        110679,
        80750,
        108113,
        104560,
        98948,
        108549,
        108542,
        107944
    ];

        dbfIds.forEach(dbfId => addMechanicToCard(dbfId, "START_OF_COMBAT"));

}


function addTrinketSpecificField() {
    let patch = 205267;
    let patchJson = dbManager.getJsonDBOfPatch(patch);
    
    for(let cardId in patchJson){
        let card = patchJson[cardId];
        if((card.hasOwnProperty("type") && card.type === "BATTLEGROUND_TRINKET")){
            card.isBattlegroundsTrinket = true;
        }
    }
    dbManager.saveJsonDBOfPatch(patchJson, patch);    
}

// console.log(getAllPatchesOfId(66246));
// addStartOfCombatToCards();

// addTrinketSpecificField();

function addingTribesToAllTrinkets() {
    let patch = 205267;
    let patchJson = dbManager.getJsonDBOfPatch(patch);

    
    let beast = [111211, 111250, 112073, 115231, 111046, 110966, 111408, 112102, 112381, 110972, 115251];
    let demon = [112054, 112382, 110975, 111404, 111092, 115234, 111384, 115236, 112055, 115218, 112078];
    let dragon = [111607, 111253, 112383, 112411, 112004, 111255, 112079, 111401, 115248, 112083, 111417, 115219, 111920, 111920, 115223, 110985];
    let elemental = [112400, 111500, 112004, 115235, 112392, 111404, 111977, 111384, 115236, 111499, 111533, 115221, 115218, 112055, 112078];
    let mech = [111529, 113095, 112397, 110956, 111046, 110966, 111403, 111092, 115234, 111976, 112005, 115258];
    let murloc = [111607, 111253, 113099, 112004, 115240, 112402, 112079, 114208, 115247, 115237, 110991];
    let naga = [112855, 111400, 112464, 117416, 114212, 111664, 111557, 112855];
    let pirate = [111505, 115464, 115228, 112408, 115245, 110993, 115221, 111533, 112011, 111406, 112990, 113102];
    let quilboar = [111476, 113096, 112398, 111512, 115253, 111514, 111664, 117416, 112855, 115225, 112013];
    let undead = [115251, 111388, 115226, 112399, 112080, 115247, 114208, 111046, 110966, 115464, 117157, 112014, 111250, 111211, 115228, 112408, 111502, 113302, 112411, 112102, 110967];
    
    beast.forEach((card) => addSingleTribeToTrinket("BEAST", card, patchJson));
    demon.forEach((card) => addSingleTribeToTrinket("DEMON", card, patchJson));
    dragon.forEach((card) => addSingleTribeToTrinket("DRAGON", card, patchJson));
    elemental.forEach((card) => addSingleTribeToTrinket("ELEMENTAL", card, patchJson));
    mech.forEach((card) => addSingleTribeToTrinket("MECHANICAL", card, patchJson));
    murloc.forEach((card) => addSingleTribeToTrinket("MURLOC", card, patchJson));
    naga.forEach((card) => addSingleTribeToTrinket("NAGA", card, patchJson));
    pirate.forEach((card) => addSingleTribeToTrinket("PIRATE", card, patchJson));
    quilboar.forEach((card) => addSingleTribeToTrinket("QUILBOAR", card, patchJson));
    undead.forEach((card) => addSingleTribeToTrinket("UNDEAD", card, patchJson));

    dbManager.saveJsonDBOfPatch(patchJson, patch); 

}

function addSingleTribeToTrinket(tribe, cardId, patchJson) {
    let card = patchJson[cardId];
    if(!card.hasOwnProperty("associatedTribes") ||(card.hasOwnProperty("associatedTribes") && card.associatedTribes.includes("GENERAL"))){
        card.associatedTribes = [tribe];
    } else if (card.hasOwnProperty("associatedTribes") && card.associatedTribes.length > 0 && !card.associatedTribes.includes(tribe)) {
        card.associatedTribes.push(tribe);
    }
}
