const fs = require('fs');

const type = {
    naga: "NAGA",
    pirate: "PIRATE",
    mech: "MECH",
    dragon: "DRAGON",
    beast: "BEAST",
    undead: "UNDEAD",
    pirate: "PIRATE",
    elemental: "ELEMENTAL",
    quilboar: "QUILBOAR",
    murloc: "MURLOC"
}

const tier = {
    tier1: "TIER_1",
    tier2: "TIER_2",
    tier3: "TIER_3",
    tier4: "TIER_4",
    tier5: "TIER_5",
    tier6: "TIER_6",
}

const mechanic = {
    deathrattle: "DEATHRATTLE",
    battlecry: "BATTLECRY",
}

const special = {
    eot: "END_OF_TURN",
    spellcraft: "SPELLCRAFT",
    putricide: "PUTRI",
    quest: "QUEST",
    reward: "REWARD",
    foaf: "FOAF_BUDDY",
    etc: "ETC_BUDDY",
}


function getMinionsForPool(pool) {
    switch (pool) {
        case "TIER_1_POOL":
            return getMinionsOfTier(1);
        case "TIER_2_POOL":
            return getMinionsOfTier(2);
        case "TIER_3_POOL":
            return getMinionsOfTier(3);
        case "TIER_4_POOL":
            return getMinionsOfTier(4);
        case "TIER_5_POOL":
            return getMinionsOfTier(5);
        case "TIER_6_POOL":
            return getMinionsOfTier(6);
        case "BEAST_POOL":
            return getMinionsOfType("BEAST");
        case "DEMON_POOL":
            return getMinionsOfType("DEMON");
        case "DRAGON_POOL":
            return getMinionsOfType("DRAGON");
        case "ELEMENTAL_POOL":
            return getMinionsOfType("ELEMENTAL");
        case "MECH_POOL":
            return getMinionsOfType("MECHANICAL");
        case "MURLOC_POOL":
            return getMinionsOfType("MURLOC");
        case "NAGA_POOL":
            return getMinionsOfType("NAGA");
        case "PIRATE_POOL":
            return getMinionsOfType("PIRATE");
        case "QUILBOAR_POOL":
            return getMinionsOfType("QUILBOAR");
        case "UNDEAD_POOL":
            return getMinionsOfType("UNDEAD");
        case "BATTLECRY_POOL":
            return getMinionsOfMechanic("BATTLECRY");
        case "DEATHRATTLE_POOL":
            return getMinionsOfMechanic("DEATHRATTLE");
        case "END_OF_TURN_POOL":
            return [];
        case "SPELLCRAFT_POOL":
            return getSpellcraftSpells();
        case "SECRET_POOL":
            return getSecrets();
        case "MAGNETIC_POOL":
            return getMinionsOfMechanic("MAGNETIC");
        case "GOLDEN_POOL":
            return [];
        case "DARKMOON_PRIZE_POOL_1":
            return getDarkmoonPrizes(1);
        case "DARKMOON_PRIZE_POOL_2":
            return getDarkmoonPrizes(2);
        case "DARKMOON_PRIZE_POOL_3":
            return getDarkmoonPrizes(3);
        case "DARKMOON_PRIZE_POOL_4":
            return getDarkmoonPrizes(4);
        case "NGUYEN_HP_POOL":
            return getNguyenHPs();
        case "DIABLO_POOL_1":
            return getDiabloPrizes(1);
        case "DIABLO_POOL_2":
            return getDiabloPrizes(2);
        case "DIABLO_POOL_3":
            return getDiabloPrizes(3);
        case "DIABLO_POOL_4":
            return getDiabloPrizes(4);
        case "PUTRI_POOL_1":
            return [];
        case "PUTRI_POOL_2":
            return [];
        case "QUEST_POOL":
            return getQuests();
        case "REWARD_POOL":
            return getRewards();
        case "ETC_BUDDY_POOL":
            return [];
        case "FOAF_BUDDY_POOL":
            return [];
        default:
            return [];
    }
}

function getMinionsOfTier(tier) {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let minionsOfTier = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.techLevel === tier) {
            minionsOfTier.push(card);
        }
    }
    return minionsOfTier;
}

function getMinionsOfType(type) {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let minionsOfType = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.races && card.races.includes(type)) {
            minionsOfType.push(card);
        }
    }
    return minionsOfType;
}

function getMinionsOfMechanic(mechanic) {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let minionsOfMechanic = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.mechanics && card.mechanics.includes(mechanic)) {
            minionsOfMechanic.push(card);
        }
    }
    return minionsOfMechanic;
}

function getSpellcraftSpells(){
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let spellcraftSpells = [];
    for (let card of cards) {
        if(isValidMinionWithSpellcraft(card)) {
            spellcraftSpells.push(getSpellcraftSpell(card, jsonDB));
        }
    }
    return spellcraftSpells;
}

function isValidMinionWithSpellcraft(card) {
    return card.isBattlegroundsPoolMinion && card.relatedCards && card.text && card.text.match("Spellcraft:");
}

function getSpellcraftSpell(card, db) {
    if(card.relatedCards) {
        let relatedCards = card.relatedCards;
        for (let relatedCardId of relatedCards) {
            if(db[relatedCardId].type === "SPELL"){
                return db[relatedCardId];
            }
        }
    }
    return [];
}

function getSecrets() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let secrets = [];
    for (let card of cards) {
        if(card.isAkamSecret && card.isAkamSecret === true) {
            secrets.push(card);
        }
    }
    return secrets;
}

function getDiabloPrizes(turn) {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let prizes = [];
    for (let card of cards) {
        if(card.battlegroundsDiabloPrizeTurn && card.battlegroundsDiabloPrizeTurn === turn) {
            prizes.push(card);
        }
    }
    return prizes;
}

function getDarkmoonPrizes(turn) {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let prizes = [];
    for (let card of cards) {
        if(card.battlegroundsDarkmoonPrizeTurn && card.battlegroundsDarkmoonPrizeTurn === turn) {
            prizes.push(card);
        }
    }
    return prizes;
}

function getNguyenHPs() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let hps = [];
    for (let card of cards) {
        if(card.battlegroundsHero && card.battlegroundsHero === true) {
            let hp = jsonDB[card.heroPowerDbfId];
            if(!hp.bannedFromNguyen || !(hp.bannedFromNguyen === true)) {
                hps.push(hp);
            }
        }
    }
    return hps;
}

function getQuests() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let quests = [];
    for (let card of cards) {
        if(card.type === "SPELL" && card.mechanics && card.mechanics.includes("QUEST") 
                && !(card.bannedFromQuests && card.bannedFromQuests === true)) {
            quests.push(card);
        }
    }
    return quests;
}

function getRewards() {
    let jsonDB = JSON.parse(fs.readFileSync("./db/currentDb.json"));
    let cards = Object.values(jsonDB);
    let rewards = [];
    for (let card of cards) {
        if(card.type === "BATTLEGROUND_QUEST_REWARD" && !(card.bannedFromRewards && card.bannedFromRewards === true)) {
            rewards.push(card);
        }
    }
    return rewards;
}

module.exports = {
    getMinionsForPool
}