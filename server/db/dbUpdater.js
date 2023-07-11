const fs = require("fs");

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

changingAlltoGeneralForTribes();

// addingTribes();
// removingAssociatedTribesFromSkins();
// removingAssociatedTribesFromBuddies();
// removingAssociatedTribesFromEverythingExceptActiveCards();


// listBuddiesAndIds();

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