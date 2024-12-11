const { addNewChange } = require('./changeHandler');
const dbManager = require('./dbManager');

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

function patch38377() {
    let build = 38377;

    // minion changes
    addNewChange(build, 96773, {"techLevel": 3}, undefined, undefined, undefined, undefined, true, undefined, undefined); // seer
    addNewChange(build, 49169, {"techLevel": 4}, undefined, undefined, undefined, undefined, true, undefined, undefined); // mechano
    addNewChange(build, 962, {"techLevel": 3}, undefined, undefined, undefined, undefined, true, undefined, undefined); // the beast
    addNewChange(build, 96780, undefined, ["isBattlegroundsPoolMinion"]); // amalgam - removed

    // heroes
    addNewChange(build, 58546, {"battlegroundsHero": true}); // bartendotron - returning
    addNewChange(build, 60214, undefined, ["battlegroundsHero"]); // brann - leaving
}

function patch39282() {
    let build = 39282;

    addNewChange(build, 57947, {"battlegroundsHero": true}); // patches - returning
    addNewChange(build, 59831, {"battlegroundsHero": true}); // pyramad - returning
}

function patch39954() {
    let build = 39954;

    addNewChange(build, 60211, undefined, ["battlegroundsHero"]); // finley - leaving
    addNewChange(build, 96796, undefined, ["isBattlegroundsPoolMinion"]); // voidwalker - removed
}

function patch42174() {
    let build = 42174;

    // addNewChange(build, 61059, undefined, ["isBattlegroundsPoolMinion"]); // remove Master Demonologist

    // addNewChange(build, 60628, {"associatedTribes": ["DRAGON"], "isBattlegroundsPoolMinion": true }, undefined, undefined, undefined, undefined, true); // dragonspawn lieutenant
    addNewChange(build, 61079, {"battlegroundsPremiumDbfId": 4 }); // making up golden mack
    addNewChange(build, 61079, {"associatedTribes": ["MURLOC"], "isBattlegroundsPoolMinion": true }, undefined, undefined, undefined, undefined, true); // holy mack

    addNewChange(build, 60559, {"associatedTribes": ["DRAGON"], "isBattlegroundsPoolMinion": true }); // waxrider toggwaggle
    addNewChange(build, 60552, {"associatedTribes": ["DRAGON"], "isBattlegroundsPoolMinion": true }); // hangry dragon hank
    addNewChange(build, 60498, {"associatedTribes": ["DRAGON"], "isBattlegroundsPoolMinion": true }); // herald of flame

    addNewChange(build, 60558, undefined, undefined, undefined, undefined, undefined, true); // bronze warden
    addNewChange(build, 60629, undefined, undefined, undefined, undefined, undefined, true); // nadina

    addNewChange(build, 60621, {"isBattlegroundsPoolMinion": true }); // steward of time

    addNewChange(build, 61077, {"battlegroundsNormalDbfId": 1808 }); // golden unstable ghoul

    // removed minions
    addNewChange(build, 2026, undefined, ["isBattlegroundsPoolMinion"]); // shielded minibot
    addNewChange(build, 103652, undefined, ["isBattlegroundsPoolMinion"]); // annoy-o-tron
    addNewChange(build, 60050, undefined, ["isBattlegroundsPoolMinion"]); // mounted raptor
    addNewChange(build, 54153, undefined, ["isBattlegroundsPoolMinion"]); // phalanx commander
    addNewChange(build, 38526, undefined, ["isBattlegroundsPoolMinion"]); // psycho tron
    addNewChange(build, 41180, undefined, ["isBattlegroundsPoolMinion"]); // tortollan shellraiser
    addNewChange(build, 60049, undefined, ["isBattlegroundsPoolMinion"]); // piloted sky golem
    addNewChange(build, 47516, undefined, ["isBattlegroundsPoolMinion"]); // festeroot hulk
    addNewChange(build, 38895, undefined, ["isBattlegroundsPoolMinion"]); // the boogeymonster
    addNewChange(build, 41138, undefined, ["isBattlegroundsPoolMinion"]); // sated treshadon

    addNewChange(39954, 57961, {"battlegroundsHero": true}); // putricide returning
    addNewChange(build, 57961, undefined, ["battlegroundsHero"]); // putricide leaving
    addNewChange(build, 57924, undefined, ["battlegroundsHero"], undefined, "ONLY_THIS"); // queen wagtoggle temporarily removed

}

function patch42500() {
    let build = 42500;

    addNewChange(build, 57924, {"battlegroundsHero": true}, undefined, undefined, "ONLY_THIS"); // wagtoggle returning
    addNewChange(build, 60364, undefined, ["battlegroundsHero"]); // tirion leaving
}

function patch43246() {
    let build = 43246;

    addNewChange(build, 57961, {"battlegroundsHero": true}); // putricide returning
    addNewChange(35747, 60211, {"heroPowerDbfId": 60215}, undefined, undefined, "RANGE", build); // updating old hp for finley
    addNewChange(build, 60211, {"battlegroundsHero": true}); // finley returning

    addNewChange(build, 57892, undefined, ["battlegroundsHero"]); // ragnaros leaving
    addNewChange(build, 60361, undefined, ["battlegroundsHero"]); // sylvanas leaving
    addNewChange(build, 57947, undefined, ["battlegroundsHero"]); // patches leaving
    
}

function patch44222() {
    let build = 44222;

    addNewChange(build, 2030, undefined, ["isBattlegroundsPoolMinion"]); // cobalt guardian removed
}

function patch49534() {
    let build = 49534;

    addNewChange(build, 57947, {"battlegroundsHero": true}); // patches returning
    addNewChange(35747, 57947, {"heroPowerDbfId": 58527}, undefined, undefined, "RANGE", build); // updating old hp for patches

    addNewChange(build, 57961, undefined, ["battlegroundsHero"]); // putricide leaving
    addNewChange(build, 61079, undefined, ["isBattlegroundsPoolMinion"]); // holy mack removed

    addNewChange(build, 62188, {"associatedTribes": ["PIRATE"], "isBattlegroundsPoolMinion": true }); // arcane cannon
    addNewChange(build, 62458, {"associatedTribes": ["PIRATE"], "isBattlegroundsPoolMinion": true }); // Seabreaker Goliath
    addNewChange(build, 61046, {"associatedTribes": ["PIRATE"], "isBattlegroundsPoolMinion": true }); // Nat Pagle

    addNewChange(build, 61053, {"isBattlegroundsPoolMinion": true }); // Bloodsail Cannoneer

    addNewChange(build, 62232, {"associatedTribes": ["PIRATE"], "isBattlegroundsPoolMinion": true, "pools": [ "PIRATE_POOL" ] }); // Tide Razor YEP BOAT
    addNewChange(build, 62251, {"pools": [ "PIRATE_POOL" ] }); // Golden boat

    addNewChange(build, 62216, {"battlegroundsPremiumDbfId": 62218 }); // Treasure Chest
    addNewChange(build, 62218, {"battlegroundsNormalDbfId": 62216 }); // Golden Treasure Chest
    addNewChange(build, 62216, {"pools": [ "GOLDEN_POOL" ] }, undefined, undefined, undefined, undefined, true); // Treasure Chest

    addNewChange(build, 61060, undefined, undefined, undefined, undefined, undefined, true); // Yo-Ho make golden


}

function patch50000() {
    addNewChange(49534, 61910, undefined, ["battlegroundsHero"]); // aranna not added yet
    addNewChange(50000, 61910, {"battlegroundsHero": true}); // aranna added
}

function patch53261() {
    let build = 53261;

    addNewChange(build, 60214, {"battlegroundsHero": true}); // brann added
    addNewChange(35747, 56465, {"pools": [ "ADAPT_POOL" ] }, undefined, undefined, undefined, undefined, true); // Megasaur since the start
    addNewChange(build, 61444, {"pools": [ "ADAPT_POOL" ] }, undefined, undefined, undefined, undefined, true); // Amalgadon

}

function patch54613() {
    let build = 54613;

    addNewChange(build, 39839, undefined, ["isBattlegroundsPoolMinion"]); // zoobot removed
    addNewChange(build, 39269, undefined, ["isBattlegroundsPoolMinion"]); // menagerie magician removed
}

function patch56359() {
    let build = 56359;

    addNewChange(35747, 59682, {"pools": [ "LEGENDARY_POOL" ] }, undefined, undefined, undefined, undefined, true); // Sneeds since the start
    addNewChange(35747, 60048, {"pools": [ "MANA_2_POOL" ] }, undefined, undefined, undefined, undefined, true); // Piloted Shredder since the start
    addNewChange(35747, 60049, {"pools": [ "MANA_4_POOL" ] }, undefined, undefined, undefined, undefined, true); // Piloted Sky Golem since the start
    addNewChange(35747, 60050, {"pools": [ "MANA_1_POOL" ] }, undefined, undefined, undefined, undefined, true); // Mounted Raptor since the start
    addNewChange(35747, 58503, {"pools": [ "MANA_X_POOL" ] }); // Effigy since the start

    addNewChange(build, 56465, undefined, ["isBattlegroundsPoolMinion"]); // megasaur removed
    addNewChange(build, 62188, undefined, ["isBattlegroundsPoolMinion"]); // arcane cannon removed

    addNewChange(build, 60028, {"techLevel": 4}, undefined, undefined, undefined, undefined, true, undefined, undefined); // primalfin

    addNewChange(build, 61046, undefined, ["relatedCards"], undefined, undefined, undefined, true); // treasure chest removed from nat pagle

    addNewChange(build, 60216, {"cost": 0 }); // Reno's hp gonna be rich
    addNewChange(build, 58040, {"cost": 0 }); // TLK's hp reborn rites

}

function patch58213() {
    // bunch of ids that changed, and golden versions added to the db. Maybe take a look at that in the future.
    let build = 58213;

    addNewChange(build, 96760, {"associatedTribes": ["MECHANICAL"]}, undefined, undefined, "RANGE", 162867); // Micro Mummy removing dualtribe
    addNewChange(build, 48886, undefined, ["isBattlegroundsPoolMinion"]); // mecharoo removed
}

function patch60352_and_62331() {
    let build = 60352;

    addNewChange(build, 52902, {"associatedTribes": ["ELEMENTAL"], "isBattlegroundsPoolMinion": true }); // Whirlwind Tempest
    addNewChange(build, 64297, {"associatedTribes": ["ELEMENTAL"], "isBattlegroundsPoolMinion": true }); // Arcane Assistant


    build = 62331;

    addNewChange(build, 58546, undefined, ["battlegroundsHero"]); // bartendotron leaving

    addNewChange(35747, 59815, {"relatedCards": [ 59816 ]}, undefined, undefined, "RANGE", build); // bananarama only banana
    addNewChange(build, 59815, {"relatedCards": [ 59816, 65230 ]}, undefined, undefined, "ONLY_THIS"); // bananarama now big banana as well

    addNewChange(build, 60122, undefined, ["isBattlegroundsPoolMinion"]); // pogo-hopper removed
    addNewChange(build, 52902, undefined, ["isBattlegroundsPoolMinion"]); // whirlwind tempest removed

}

function patch65000() {
    let build = 65000;

    addNewChange(35747, 58503, {"isAkamSecret": true}, undefined, undefined, "RANGE", build); // effigy in secret pool
    addNewChange(build, 58503, undefined, ["isAkamSecret"], undefined, "ONLY_THIS"); // effigy no longer in secret pool


}

function patch68600() {
    let build = 68600;

    addNewChange(65614, 57924, undefined, ["battlegroundsHero"]); // wagtoggle leaving

    addNewChange(65614, 58021, undefined, ["battlegroundsHero"], undefined, "ONLY_THIS"); // akazam disabled
    addNewChange(build, 58021, {"battlegroundsHero": true}, undefined, undefined, "ONLY_THIS"); // akazam is back

    addNewChange(build, 60211, {"battlegroundsHero": true}); // finley returning

    addNewChange(build, 65661, {"associatedTribes": ["GENERAL"], "isBattlegroundsPoolMinion": true }); // tormented ritualist
    addNewChange(build, 63627, {"associatedTribes": ["GENERAL"], "isBattlegroundsPoolMinion": true }); // faceless taverngoer
    addNewChange(build, 66835, {"associatedTribes": ["GENERAL"], "isBattlegroundsPoolMinion": true }); // elistra the immortal

    addNewChange(build, 65660, {"isBattlegroundsPoolMinion": true }); // warden of old
    addNewChange(build, 63619, {"isBattlegroundsPoolMinion": true }); // qiraji harbinger

    //removed
    addNewChange(build, 42467, undefined, ["isBattlegroundsPoolMinion"]); // righteous protector
    addNewChange(build, 962, undefined, ["isBattlegroundsPoolMinion"]); // the beast
    addNewChange(build, 2518, undefined, ["isBattlegroundsPoolMinion"]); // crowd favorite
    addNewChange(build, 57742, undefined, ["isBattlegroundsPoolMinion"]); // shifter zerus


}

// addNewChange(74257, 66835, undefined, ["isBattlegroundsPoolMinion"]); // elistra removed

// addNewChange(77662, 60048, undefined, ["isBattlegroundsPoolMinion"]); // piloted shredder removed
// addNewChange(77662, 62582, {"associatedTribes": ["GENERAL"], "isBattlegroundsPoolMinion": true }); // barrens blacksmith

// addNewChange(79904, 57924, {"battlegroundsHero": true}); // wagtoggle returning
// addNewChange(35747, 59940, {"associatedTribes": ["BEAST"]}); // pack leader tribe since the start


// addNewChange(81706, 70158, {"isBattlegroundsPoolMinion": true }); // bristleback knight
// addNewChange(81706, 70176, {"associatedTribes": ["QUILBOAR"]}); // agamaggan pumba great boar


// addNewChange(82994, 62582, undefined, ["isBattlegroundsPoolMinion"]); // barrens blacksmith removed


// addNewChange(84593, 73072, {"associatedTribes": ["DEMON"], "isBattlegroundsPoolMinion": true }); // hexruin marauder
// addNewChange(35747, 54835, {"associatedTribes": ["DEMON"] }); // siegebreaker
// addNewChange(84593, 54835, undefined, ["isBattlegroundsPoolMinion"]); // siegebreaker removed

// let ragHP = {
//     "cardClass": "NEUTRAL",
//     "cost": 2,
//     "dbfId": 64424,
//     "id": "TB_BaconShop_HP_087",
//     "mechanics": [
//       "TRIGGER_VISUAL"
//     ],
//     "name": "DIE, INSECTS!",
//     "set": "BATTLEGROUNDS",
//     "text": "[x]<b>Hero Power</b>\nAt the start of next combat, deal 8 damage to two random enemy minions.",
//     "type": "HERO_POWER",
//   };
// addNewChange(35747, 64424, ragHP, undefined, undefined, "ONLY_THIS");

// function ratKingHpChanges() {
//     let ratkinghp = {
//         "cardClass": "NEUTRAL",
//         "cost": 0,
//         "dbfId": 63127,
//         "hideCost": true,
//         "id": "TB_BaconShop_HP_041",
//         "name": "A Tale of Kings",
//         "set": "BATTLEGROUNDS",
//         "text": "[x]<b>Passive Hero Power</b>\nWhenever you buy a minion of\na specific type, give it +1/+2.\nSwaps type each turn.",
//         "type": "HERO_POWER",
//         "pools": [
//         "TYPE_X_POOL"
//         ],
//         "relatedCards": [
//         59839,
//         59852,
//         59853,
//         59854
//         ]
//         };
//     addNewChange(35747, 63127, ratkinghp, undefined, undefined, "ONLY_THIS");
// }

// ratKingHpChanges();

// function addingAndFixingCards() {
//     let goldenMaexxna = {
//         "attack": 4,
//         "battlegroundsNormalDbfId": 1791,
//         "cardClass": "NEUTRAL",
//         "cost": 6,
//         "dbfId": 63781,
//         "elite": true,
//         "health": 16,
//         "id": "TB_BaconUps_155",
//         "mechanics": [
//         "POISONOUS"
//         ],
//         "name": "Maexxna",
//         "race": "BEAST",
//         "rarity": "LEGENDARY",
//         "set": "BATTLEGROUNDS",
//         "techLevel": 6,
//         "text": "<b>Poisonous</b>",
//         "type": "MINION",
//         "races": [
//         "BEAST"
//         ]
//         };
//     let goldenRighteous = {
//         "attack": 2,
//         "battlegroundsNormalDbfId": 42467,
//         "cardClass": "PALADIN",
//         "cost": 1,
//         "dbfId": 63774,
//         "health": 2,
//         "id": "TB_BaconUps_147",
//         "mechanics": [
//         "DIVINE_SHIELD",
//         "TAUNT"
//         ],
//         "name": "Righteous Protector",
//         "rarity": "COMMON",
//         "set": "BATTLEGROUNDS",
//         "techLevel": 1,
//         "text": "<b>Taunt</b>\n<b>Divine Shield</b>",
//         "type": "MINION"
//         };
//     let goldenHomunculus = {
//         "attack": 4,
//         "battlegroundsNormalDbfId": 43121,
//         "cardClass": "WARLOCK",
//         "cost": 2,
//         "dbfId": 63778,
//         "health": 8,
//         "id": "TB_BaconUps_148",
//         "mechanics": [
//         "BATTLECRY",
//         "TAUNT"
//         ],
//         "name": "Vulgar Homunculus",
//         "race": "DEMON",
//         "rarity": "COMMON",
//         "set": "BATTLEGROUNDS",
//         "techLevel": 1,
//         "text": "<b>Taunt</b>\n<b>Battlecry:</b> Deal 2 damage to your hero.",
//         "type": "MINION",
//         "races": [
//         "DEMON"
//         ]
//         };
//     let murlocScout = {
//         "attack": 1,
//         "battlegroundsPremiumDbfId": 57339,
//         "cardClass": "NEUTRAL",
//         "cost": 0,
//         "dbfId": 68469,
//         "health": 1,
//         "id": "VAN_EX1_506a",
//         "name": "Murloc Scout",
//         "race": "MURLOC",
//         "rarity": "COMMON",
//         "set": "VANILLA",
//         "techLevel": 1,
//         "type": "MINION",
//         "races": [
//         "MURLOC"
//         ]
//         };
//     let warleader = {
//         "artist": "Tim McBurnie",
//         "attack": 3,
//         "battlegroundsPremiumDbfId": 57403,
//         "cardClass": "NEUTRAL",
//         "collectible": true,
//         "cost": 3,
//         "dbfId": 76270,
//         "flavor": "Do Murlocs ever get tired of making the same old sound?  Nope!  Mrglglrglglglglglglgl!",
//         "health": 3,
//         "howToEarn": "Unlocked at level 1.",
//         "howToEarnGolden": "Unlocked after 2500 total wins.",
//         "id": "CORE_EX1_507",
//         "mechanics": [
//         "AURA"
//         ],
//         "name": "Murloc Warleader",
//         "race": "MURLOC",
//         "rarity": "EPIC",
//         "set": "CORE",
//         "techLevel": 2,
//         "text": "Your other Murlocs have +2 Attack.",
//         "type": "MINION",
//         "races": [
//         "MURLOC"
//         ]
//         };
//     let imp = {
//         "attack": 1,
//         "battlegroundsPremiumDbfId": 58373,
//         "cardClass": "WARLOCK",
//         "cost": 1,
//         "dbfId": 96788,
//         "health": 1,
//         "id": "BG_BRM_006t",
//         "name": "Imp",
//         "race": "DEMON",
//         "set": "BATTLEGROUNDS",
//         "techLevel": 1,
//         "type": "MINION",
//         "races": [
//         "DEMON"
//         ]
//         };
//     let siegebreaker = {
//         "artist": "James Ryman",
//         "attack": 5,
//         "battlegroundsPremiumDbfId": 58418,
//         "cardClass": "WARLOCK",
//         "cost": 7,
//         "dbfId": 100720,
//         "flavor": "Has a side hustle as a siegebroker.",
//         "health": 8,
//         "id": "RLK_Prologue_EX1_185",
//         "mechanics": [
//         "AURA",
//         "TAUNT"
//         ],
//         "name": "Siegebreaker",
//         "race": "DEMON",
//         "rarity": "RARE",
//         "set": "EXPERT1",
//         "techLevel": 4,
//         "text": "<b>Taunt</b>\nYour other Demons have +1 Attack.",
//         "type": "MINION",
//         "races": [
//         "DEMON"
//         ]
//         };
//     let amalgam = {
//         "attack": 2,
//         "battlegroundsNormalDbfId": 59202,
//         "cardClass": "NEUTRAL",
//         "cost": 2,
//         "dbfId": 98699,
//         "health": 2,
//         "id": "TB_BaconShop_HP_033t_G",
//         "name": "Amalgam",
//         "race": "ALL",
//         "set": "BATTLEGROUNDS",
//         "techLevel": 1,
//         "text": "<i>This has all minion types.</i>",
//         "type": "MINION",
//         "races": [
//         "ALL"
//         ]
//         };
//     let direwolf = {
//         "artist": "John Dickenson",
//         "attack": 2,
//         "battlegroundsPremiumDbfId": 60025,
//         "cardClass": "NEUTRAL",
//         "collectible": true,
//         "cost": 2,
//         "dbfId": 69870,
//         "flavor": "We are pretty excited about the upcoming release of Dire Wolf Beta, just repost this sign for a chance at a key.",
//         "health": 2,
//         "id": "VAN_EX1_162",
//         "mechanics": [
//         "ADJACENT_BUFF",
//         "AURA"
//         ],
//         "name": "Dire Wolf Alpha",
//         "race": "BEAST",
//         "rarity": "COMMON",
//         "set": "VANILLA",
//         "techLevel": 1,
//         "text": "Adjacent minions have +1 Attack.",
//         "type": "MINION",
//         "races": [
//         "BEAST"
//         ]
//         };
//     let nightmareAmalgam = {
//         "artist": "Andrew Hou",
//         "attack": 6,
//         "battlegroundsNormalDbfId": 96780,
//         "cardClass": "NEUTRAL",
//         "cost": 3,
//         "dbfId": 91216,
//         "flavor": "Be all that you can be.",
//         "health": 8,
//         "id": "BG_GIL_681_G",
//         "name": "Nightmare Amalgam",
//         "race": "ALL",
//         "rarity": "EPIC",
//         "set": "BATTLEGROUNDS",
//         "techLevel": 3,
//         "text": "<i>This has all minion types.</i>",
//         "type": "MINION",
//         "races": [
//         "ALL"
//         ],
//         "undeadCreationPool": 1
//         };
//     let hydra = {
//         "attack": 4,
//         "battlegroundsNormalDbfId": 96782,
//         "cardClass": "HUNTER",
//         "cost": 3,
//         "dbfId": 63794,
//         "health": 8,
//         "id": "TB_BaconUps_151",
//         "name": "Cave Hydra",
//         "race": "BEAST",
//         "rarity": "COMMON",
//         "set": "BATTLEGROUNDS",
//         "techLevel": 4,
//         "text": "Also damages the minions next to whomever\nthis attacks.",
//         "type": "MINION",
//         "races": [
//         "BEAST"
//         ]
//         };
//     let foe =  {
//         "attack": 12,
//         "battlegroundsNormalDbfId": 96787,
//         "cardClass": "NEUTRAL",
//         "cost": 8,
//         "dbfId": 63776,
//         "elite": true,
//         "health": 18,
//         "id": "TB_BaconUps_153",
//         "name": "Foe Reaper 4000",
//         "race": "MECHANICAL",
//         "rarity": "LEGENDARY",
//         "set": "BATTLEGROUNDS",
//         "techLevel": 6,
//         "text": "Also damages the minions next to whomever it attacks.",
//         "type": "MINION",
//         "races": [
//         "MECHANICAL"
//         ]
//         };
//     let toxfin = {
//         "attack": 2,
//         "battlegroundsNormalDbfId": 96842,
//         "cardClass": "NEUTRAL",
//         "cost": 1,
//         "dbfId": 63796,
//         "health": 4,
//         "id": "TB_BaconUps_152",
//         "mechanics": [
//         "BATTLECRY"
//         ],
//         "name": "Toxfin",
//         "race": "MURLOC",
//         "rarity": "COMMON",
//         "referencedTags": [
//         "POISONOUS"
//         ],
//         "set": "BATTLEGROUNDS",
//         "techLevel": 4,
//         "text": "<b>Battlecry:</b> Give a friendly Murloc <b>Poisonous</b>.",
//         "type": "MINION",
//         "races": [
//         "MURLOC"
//         ]
//         };
//     addNewChange(35747, 63781, goldenMaexxna, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 63774, goldenRighteous, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 63778, goldenHomunculus, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 68469, murlocScout, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 76270, warleader, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 58028, undefined, ["relatedCards"], undefined, "RANGE", 91040); // removed shudderling from hp
//     addNewChange(35747, 96788, imp, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 58372, {"battlegroundsNormalDbfId": 2288}, undefined, undefined, "ONLY_THIS"); // regular id imp gang boss = 2288
//     addNewChange(35747, 100720, siegebreaker, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 98699, amalgam, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 69870, direwolf, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 91216, nightmareAmalgam, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 63794, hydra, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 63776, foe, undefined, undefined, "ONLY_THIS");
//     addNewChange(35747, 63796, toxfin, undefined, undefined, "ONLY_THIS");
// }

// addingAndFixingCards();

function addingTribeToManyCards(build, cardIds, tribe) {
    cardIds.forEach((cardId) => addingSingleTribeToCard(build, cardId, tribe));
}

function addingSingleTribeToCard(build, cardId, tribe) {
    addNewChange(build, cardId, {"associatedTribes": [tribe]});
}

function updatingTribesFirstPatch() {
    let build = 35747;

    const MECH = "MECHANICAL";
    const MURLOC = "MURLOC";
    const GENERAL = "GENERAL";
    const BEAST = "BEAST";
    const DEMON = "DEMON";

    let mechIds = [48886, 60055, 60122, 60048, 2074, 60049, 48100, 59682];
    let murlocIds = [475, 56465];
    let generalIds = [42467, 2518, 54153, 41180, 45392, 47516, 38895];
    let beastIds = [985, 39481, 60050, 38734, 962, 40641, 49973, 41138];
    let demonIds = [96796, 43121, 40391, 2288, 1986];

    addingTribeToManyCards(build, mechIds, MECH);
    addingTribeToManyCards(build, murlocIds, MURLOC);
    addingTribeToManyCards(build, generalIds, GENERAL);
    addingTribeToManyCards(build, beastIds, BEAST);
    addingTribeToManyCards(build, demonIds, DEMON);


}

// updatingTribesFirstPatch();

// addNewChange(35747, 57947, {"associatedTribes": ["GENERAL"]}, undefined, undefined, "RANGE", 49534); // patches
// addNewChange(35747, 59814, {"associatedTribes": ["BEAST"]}, undefined, undefined, "RANGE", 53261); // mukla
// addNewChange(35747, 96778, {"associatedTribes": ["BEAST"]}); // houndmaster
// addNewChange(35747, 59660, {"associatedTribes": ["DEMON"]}); // soul juggler

function removingOldCardsFrom197064(){
    let build = 197064;

    // removing cards
    addNewChange(build, 60628, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 60055, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 475, undefined, ["isBattlegroundsPoolMinion"]);
    addNewChange(build, 43121, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 39481, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 59940, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 65661, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 60559, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 64297, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 101727, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 40391, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 60552, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 2288, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 38734, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 97423, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 61059, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 45392, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 60498, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 73072, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 48100, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 76312, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 49973, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 2074, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 62458, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 59682, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 96842, undefined, ["isBattlegroundsPoolMinion"]); 
    addNewChange(build, 62232, undefined, ["isBattlegroundsPoolMinion"]); 
}

// removingOldCardsFrom197064();
// addNewChange(197064, 56112, undefined, ["isBattlegroundsPoolMinion"]); 

// addNewChange(197064, 103652, {"isBattlegroundsPoolMinion": true}); // annoy-o-tron added

function removingSomeTavernSpells() {
    let build = 197064;

    // removing cards
    addNewChange(build, 104534, undefined, ["isActiveTavernSpell"]); 
    addNewChange(build, 110400, undefined, ["isActiveTavernSpell"]); 
    addNewChange(build, 104535, undefined, ["isActiveTavernSpell"]); 
    addNewChange(build, 104461, undefined, ["isActiveTavernSpell"]); 
    addNewChange(build, 105635, undefined, ["isActiveTavernSpell"]); 
    addNewChange(build, 104446, undefined, ["isActiveTavernSpell"]); 
    
}

// removingSomeTavernSpells();

function addingTribeSpecificTSpells() {
    let build = 193541;
    addingSingleTribeToCard(build, 110411, "ELEMENTAL");
    addingSingleTribeToCard(build, 110401, "BEAST");
    addingSingleTribeToCard(build, 110412, "UNDEAD");
    addingSingleTribeToCard(build, 110642, "QUILBOAR");
    addingSingleTribeToCard(build, 110409, "DRAGON");
    addingSingleTribeToCard(build, 110471, "PIRATE");
    addingSingleTribeToCard(build, 110383, "MECHANICAL");
    addingSingleTribeToCard(build, 110406, "NAGA");
    addingSingleTribeToCard(build, 110407, "DEMON");
    addingSingleTribeToCard(build, 110400, "MURLOC");
}

// addingTribeSpecificTSpells();

// addNewChange(91456, 72061, {"associatedTribes": ["PIRATE"]}); // adding tribe to defiant shipwright

// addNewChange(198037, 104027, undefined, ["isBattlegroundsPoolSpell"]); 
// addNewChange(198037, 110631, undefined, ["isBattlegroundsPoolSpell"]); 
// addNewChange(198037, 105905, undefined, ["isBattlegroundsPoolSpell"]);

// addNewChange(201108, 100910, undefined, ["isBattlegroundsPoolSpell"]); // removing unmasked identity
// addNewChange(198608, 103796, undefined, ["isBattlegroundsPoolSpell"]); // removing sacred gift

function patch210009bugfixes() {
    let build = 210009;

    addNewChange(build, 101130, {"associatedTribes": ["PIRATE"]}, undefined, undefined, "FIRST"); // adding tribe to hoggarr hero
    addNewChange(build, 85125, {"associatedTribes": ["NAGA"]}, undefined, undefined, "FIRST"); // adding tribe to lady vashj
    addNewChange(build, 104610, {"associatedTribes": ["UNDEAD"]}, undefined, undefined, "FIRST"); // adding tribe to graverobber
    addNewChange(build, 72055, {"associatedTribes": ["BEAST"]}, undefined, undefined, "FIRST"); // adding tribe to bird buddy

    addNewChange(208591, 105266, undefined, ["isBattlegroundsPoolSpell"]); // removing dreamers embrace from the pool
    addNewChange(208591, 100910, {"isBattlegroundsPoolSpell": true}); // adding unmasked identity

    addNewChange(build, 106501, {"associatedTribes": ["DEMON"]}, undefined, undefined, "FIRST"); // adding tribe to cultist
    addNewChange(build, 117906, {"associatedTribes": ["UNDEAD"]}, undefined, undefined, "FIRST"); // adding tribe to bleeding heart
    addNewChange(build, 117894, {"associatedTribes": ["MECHANICAL"]}, undefined, undefined, "FIRST"); // adding tribe to electromagnetic device
    addNewChange(build, 117896, {"associatedTribes": ["MURLOC"]}, undefined, undefined, "FIRST"); // adding tribe to fungalmancer sticker
    addNewChange(build, 117895, {"associatedTribes": ["BEAST"]}, undefined, undefined, "FIRST"); // adding tribe to goose portrait
    addNewChange(build, 116510, undefined, ["isBattlegroundsTrinket"], undefined, "FIRST"); // removing lesser trinket placeholder from the pool
    addNewChange(build, 117799, {"associatedTribes": ["PIRATE"]}, undefined, undefined, "FIRST"); // adding tribe to flagbearer portrait
    addNewChange(build, 116614, undefined, ["isBattlegroundsTrinket"], undefined, "FIRST"); // removing greater trinket placeholder from the pool
    addNewChange(build, 117855, {"associatedTribes": ["MECHANICAL", "DEMON"]}, undefined, undefined, "FIRST"); // adding tribes to mecha j sticker
    addNewChange(build, 117797, {"associatedTribes": ["NAGA"]}, undefined, undefined, "FIRST"); // adding tribe to nazjatar postcard
    addNewChange(build, 117944, {"associatedTribes": ["NAGA"]}, undefined, undefined, "FIRST"); // adding tribe to precious perl
    addNewChange(build, 117796, {"associatedTribes": ["MURLOC"]}, undefined, undefined, "FIRST"); // adding tribe to primalfin portrait
    addNewChange(build, 117798, {"associatedTribes": ["DRAGON"]}), undefined, undefined, "FIRST"; // adding tribe to promo portrait
    addNewChange(build, 117905, {"associatedTribes": ["ELEMENTAL"]}, undefined, undefined, "FIRST"); // adding tribe to surprise portrait
    addNewChange(build, 117856, {"associatedTribes": ["QUILBOAR"]}, undefined, undefined, "FIRST"); // adding tribe to surveyor portrait
    addNewChange(build, 117795, {"associatedTribes": ["DEMON"]}, undefined, undefined, "FIRST"); // adding tribe to eye of sargeras
    addNewChange(build, 98726, {"associatedTribes": ["GENERAL"]}, undefined, undefined, "FIRST"); // changing terons tribe
    addNewChange(build, 108432, {"associatedTribes": ["MECHANICAL"]}, undefined, undefined, "FIRST"); // adding tribe to ancestral automaton
    
    addNewChange(208182, 112078, undefined, ["isBattlegroundsTrinket"]); // removing demonblood gourd from the pool
    addNewChange(208182, 111920, undefined, ["isBattlegroundsTrinket"]); // removing lesser valorous medaillion from the pool
    addNewChange(208182, 115219, undefined, ["isBattlegroundsTrinket"]); // removing greater valorous medaillion from the pool
    addNewChange(208182, 115464, undefined, ["isBattlegroundsTrinket"]); // removing ceremonial sword from the pool
    addNewChange(208182, 111211, undefined, ["isBattlegroundsTrinket"]); // removing lesser feral talisman from the pool
    addNewChange(208182, 115251, undefined, ["isBattlegroundsTrinket"]); // removing horde keychain from the pool

}

function buddyBugFixes() {
    let build = 210009;

    // removing buddies from ban list
    addNewChange(build, 101435, undefined, ["bannedFromFoaF"], undefined, "RECENT"); // sire buddy
    addNewChange(build, 77629, undefined, ["bannedFromFoaF"], undefined, "RECENT"); // wagtoggle buddy
    addNewChange(build, 77829, undefined, ["bannedFromFoaF"], undefined, "RECENT"); // silas buddy
    addNewChange(build, 77813, undefined, ["bannedFromFoaF"], undefined, "RECENT"); // saurfang buddy

    // adding buddies to ban list
    addNewChange(build, 77841, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // lich king buddy
    addNewChange(build, 77782, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // deathwing buddy
    addNewChange(build, 113627, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // inge buddy
    addNewChange(build, 77478, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // blackthorn buddy
    addNewChange(build, 77831, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // finley buddy
    addNewChange(build, 77849, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // voljin buddy
    addNewChange(build, 77874, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // sneed buddy
    addNewChange(build, 98660, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // sylvanas buddy
    addNewChange(build, 113633, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // nameless one buddy
    addNewChange(build, 77845, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // tickatus buddy
    addNewChange(build, 98690, {"bannedFromFoaF": true}, undefined, undefined, "RECENT"); // jailer buddy

}

function linkingSomeBuddiesToHeroes() {
    let build = 210009;

    addNewChange(build, 113627, {"heroDbfId": 103500}, undefined, undefined, "FIRST"); // inge buddy
    addNewChange(build, 113633, {"heroDbfId": 104567}, undefined, undefined, "FIRST"); // nameless one buddy
    addNewChange(build, 113690, {"heroDbfId": 104981}, undefined, undefined, "FIRST"); // cho buddy
    addNewChange(build, 113692, {"heroDbfId": 104982}, undefined, undefined, "FIRST"); // gall buddy
    addNewChange(build, 77813, {"heroDbfId": 71454}, undefined, undefined, "FIRST"); // saurfang buddy
    addNewChange(build, 113631, {"heroDbfId": 105434}, undefined, undefined, "FIRST"); // hollidae buddy
    addNewChange(build, 113650, {"heroDbfId": 105431}, undefined, undefined, "FIRST"); // taethelan buddy
    addNewChange(build, 113635, {"heroDbfId": 107183}, undefined, undefined, "FIRST"); // goya buddy
    addNewChange(build, 113559, {"heroDbfId": 105314}, undefined, undefined, "FIRST"); // snake eyes buddy
    addNewChange(build, 113637, {"heroDbfId": 104671}, undefined, undefined, "FIRST"); // floop buddy
    addNewChange(build, 113557, {"heroDbfId": 103477}, undefined, undefined, "FIRST"); // thorim buddy
    addNewChange(build, 114598, {"heroDbfId": 101130}, undefined, undefined, "FIRST"); // hoggarr buddy
    addNewChange(build, 113629, {"heroDbfId": 99033}, undefined, undefined, "FIRST"); // voone buddy
  
}

function patch212197() {
    let build = 212197;

    addNewChange(build, 100596, undefined, ["isBattlegroundsPoolSpell"]); // removing pointy arrow from the pool
    addNewChange(build, 110471, undefined, ["isBattlegroundsPoolSpell"]); // removing plunder seeker from the pool
    addNewChange(build, 105250, undefined, ["isBattlegroundsPoolSpell"]); // removing portal in a bottle from the pool
    addNewChange(build, 104438, undefined, ["isBattlegroundsPoolSpell"]); // removing ritual of growth from the pool
    addNewChange(build, 110411, undefined, ["isBattlegroundsPoolSpell"]); // removing suspicious stimulant from the pool
    addNewChange(build, 104535, undefined, ["isBattlegroundsPoolSpell"]); // removing buddy up from the pool
    addNewChange(build, 104465, undefined, ["isBattlegroundsPoolSpell"]); // removing top of the beanstalk from the pool
    addNewChange(build, 119470, {"isDuoCard": true}); // portal fountain
    addNewChange(build, 117671, {"isDuoCard": true}); // bargain bundle
    addNewChange(build, 119471, {"isDuoCard": true}); // portal in a crystal
}

patch212197();
// addNewChange(210009, 77468, {"heroDbfId": 61910, "associatedTribes": ["GENERAL"]}, undefined, undefined, "FIRST"); // aranna buddy

// linkingSomeBuddiesToHeroes();