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

/**
 * 
 * @param {*} jsonDB subset of cards to use
 * @param {*} pool name of the pool to use
 * @returns 
 */
function getCardsForPool(jsonDB, pool) {
    switch (pool) {
        case "TIER_1_POOL":
            return getMinionsOfTier(jsonDB, 1);
        case "TIER_2_POOL":
            return getMinionsOfTier(jsonDB, 2);
        case "TIER_3_POOL":
            return getMinionsOfTier(jsonDB, 3);
        case "TIER_4_POOL":
            return getMinionsOfTier(jsonDB, 4);
        case "TIER_5_POOL":
            return getMinionsOfTier(jsonDB, 5);
        case "TIER_6_POOL":
            return getMinionsOfTier(jsonDB, 6);
        case "BEAST_POOL":
            return getMinionsOfType(jsonDB, "BEAST");
        case "DEMON_POOL":
            return getMinionsOfType(jsonDB, "DEMON");
        case "DRAGON_POOL":
            return getMinionsOfType(jsonDB, "DRAGON");
        case "ELEMENTAL_POOL":
            return getMinionsOfType(jsonDB, "ELEMENTAL");
        case "MECH_POOL":
            return getMinionsOfType(jsonDB, "MECHANICAL");
        case "MURLOC_POOL":
            return getMinionsOfType(jsonDB, "MURLOC");
        case "NAGA_POOL":
            return getMinionsOfType(jsonDB, "NAGA");
        case "PIRATE_POOL":
            return getMinionsOfType(jsonDB, "PIRATE");
        case "QUILBOAR_POOL":
            return getMinionsOfType(jsonDB, "QUILBOAR");
        case "UNDEAD_POOL":
            return getMinionsOfType(jsonDB, "UNDEAD");
        case "BATTLECRY_POOL":
            return getMinionsOfMechanic(jsonDB, "BATTLECRY");
        case "DEATHRATTLE_POOL":
            return getMinionsOfMechanic(jsonDB, "DEATHRATTLE");
        case "END_OF_TURN_POOL":
            return [];
        case "SPELLCRAFT_POOL":
            return getSpellcraftSpells(jsonDB);
        case "SECRET_POOL":
            return getSecrets(jsonDB);
        case "MAGNETIC_POOL":
            return getMinionsOfMechanic(jsonDB, "MAGNETIC");
        case "GOLDEN_POOL":
            return [];
        case "DARKMOON_PRIZE_POOL_1":
            return getDarkmoonPrizes(jsonDB, 1);
        case "DARKMOON_PRIZE_POOL_2":
            return getDarkmoonPrizes(jsonDB, 2);
        case "DARKMOON_PRIZE_POOL_3":
            return getDarkmoonPrizes(jsonDB, 3);
        case "DARKMOON_PRIZE_POOL_4":
            return getDarkmoonPrizes(jsonDB, 4);
        case "NGUYEN_HP_POOL":
            return getNguyenHPs(jsonDB);
        case "DIABLO_POOL_1":
            return getDiabloPrizes(jsonDB, 1);
        case "DIABLO_POOL_2":
            return getDiabloPrizes(jsonDB, 2);
        case "DIABLO_POOL_3":
            return getDiabloPrizes(jsonDB, 3);
        case "DIABLO_POOL_4":
            return getDiabloPrizes(jsonDB, 4);
        case "PUTRI_POOL_1":
            return getPutriMinions(jsonDB, 1);
        case "PUTRI_POOL_2":
            return getPutriMinions(jsonDB, 2);
        case "QUEST_POOL":
            return getQuests(jsonDB);
        case "REWARD_POOL":
            return getRewards(jsonDB);
        case "ETC_BUDDY_POOL":
            return getFoaFBuddies(jsonDB);
        case "FOAF_BUDDY_POOL":
            return getFoaFBuddies(jsonDB);
        case "LEGENDARY_POOL":
            return [];
        case "MANA_1_POOL":
            return [];
        case "MANA_2_POOL":
            return [];
        case "MANA_3_POOL":
            return [];
        case "MANA_4_POOL":
            return [];
        case "MANA_5_POOL":
            return [];
        case "MANA_6_POOL":
            return [];
        case "MANA_7_POOL":
            return [];
        case "MANA_8_POOL":
            return [];
        case "MANA_9_POOL":
            return [];
        case "MANA_10_POOL":
            return [];
        case "ADAPT_POOL":
            return [];
        default:
            return [];
    }
}

function getMinionsOfTier(jsonDB, tier) {
    let cards = Object.values(jsonDB);
    let minionsOfTier = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.techLevel === tier) {
            minionsOfTier.push(card);
        }
    }
    return minionsOfTier;
}

function getMinionsOfType(jsonDB, type) {
    let cards = Object.values(jsonDB);
    let minionsOfType = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.races && (card.races.includes(type) || card.races.includes("ALL"))) {
            minionsOfType.push(card);
        }
    }
    return minionsOfType;
}

function getMinionsOfMechanic(jsonDB, mechanic) {
    let cards = Object.values(jsonDB);
    let minionsOfMechanic = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.mechanics && card.mechanics.includes(mechanic)) {
            minionsOfMechanic.push(card);
        }
    }
    return minionsOfMechanic;
}

function getSpellcraftSpells(jsonDB){
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

function getSecrets(jsonDB) {
    let cards = Object.values(jsonDB);
    let secrets = [];
    for (let card of cards) {
        if(card.isAkamSecret && card.isAkamSecret === true) {
            secrets.push(card);
        }
    }
    return secrets;
}

function getDiabloPrizes(jsonDB, turn) {
    let cards = Object.values(jsonDB);
    let prizes = [];
    for (let card of cards) {
        if(card.battlegroundsDiabloPrizeTurn && card.battlegroundsDiabloPrizeTurn === turn) {
            prizes.push(card);
        }
    }
    return prizes;
}

function getDarkmoonPrizes(jsonDB, turn) {
    let cards = Object.values(jsonDB);
    let prizes = [];
    for (let card of cards) {
        if(card.battlegroundsDarkmoonPrizeTurn && card.battlegroundsDarkmoonPrizeTurn === turn) {
            prizes.push(card);
        }
    }
    return prizes;
}

function getNguyenHPs(jsonDB) {
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

function getQuests(jsonDB) {
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

function getRewards(jsonDB) {
    let cards = Object.values(jsonDB);
    let rewards = [];
    for (let card of cards) {
        if(card.type === "BATTLEGROUND_QUEST_REWARD" && !(card.bannedFromRewards && card.bannedFromRewards === true)) {
            rewards.push(card);
        }
    }
    return rewards;
}

function getPutriMinions(jsonDB, poolNumber) {
    let cards = Object.values(jsonDB);
    let undeads = [];
    for (let card of cards) {
        if(card.undeadCreationPool && card.undeadCreationPool === poolNumber) {
            undeads.push(card);
        }
    }
    return undeads;
}

function getFoaFBuddies(jsonDB) {
    let cards = Object.values(jsonDB);
    let buddies = [];
    for (let card of cards) {
        if(card.battlegroundsHero && card.battlegroundsHero === true && card.battlegroundsBuddyDbfId) {
            let buddy = jsonDB[card.battlegroundsBuddyDbfId];
            if((!buddy.bannedFromFoaF || !(buddy.bannedFromFoaF === true)) && !buddies.includes(buddy)) {
                buddies.push(buddy);
            }
        }
    }
    return buddies;
}

module.exports = {
    getCardsForPool
}