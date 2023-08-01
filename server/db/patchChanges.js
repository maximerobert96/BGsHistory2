const { addNewChange } = require('./changeHandler');

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