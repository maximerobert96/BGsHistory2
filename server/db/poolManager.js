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

/**
 * 
 * @param {*} cards subset of cards to use. Array of card objects
 * @param {*} pool name of the pool to use
 * @returns 
 */
function getMinionsForPool(cards, pool) {
    switch (pool) {
        case "TIER_1_POOL":
            return getMinionsOfTier(cards, 1);
        case "TIER_2_POOL":
            return getMinionsOfTier(cards, 2);
        case "TIER_3_POOL":
            return getMinionsOfTier(cards, 3);
        case "TIER_4_POOL":
            return getMinionsOfTier(cards, 4);
        case "TIER_5_POOL":
            return getMinionsOfTier(cards, 5);
        case "TIER_6_POOL":
            return getMinionsOfTier(cards, 6);
        case "BEAST_POOL":
            return getMinionsOfType(cards, "BEAST");
        case "DEMON_POOL":
            return getMinionsOfType(cards, "DEMON");
        case "DRAGON_POOL":
            return getMinionsOfType(cards, "DRAGON");
        case "ELEMENTAL_POOL":
            return getMinionsOfType(cards, "ELEMENTAL");
        case "MECH_POOL":
            return getMinionsOfType(cards, "MECHANICAL");
        case "MURLOC_POOL":
            return getMinionsOfType(cards, "MURLOC");
        case "NAGA_POOL":
            return getMinionsOfType(cards, "NAGA");
        case "PIRATE_POOL":
            return getMinionsOfType(cards, "PIRATE");
        case "QUILBOAR_POOL":
            return getMinionsOfType(cards, "QUILBOAR");
        case "UNDEAD_POOL":
            return getMinionsOfType(cards, "UNDEAD");
        case "BATTLECRY_POOL":
            return getMinionsOfMechanic(cards, "BATTLECRY");
        case "DEATHRATTLE_POOL":
            return getMinionsOfMechanic(cards, "DEATHRATTLE");
        case "END_OF_TURN_POOL":
            return [];
        case "SPELLCRAFT_POOL":
            return getSpellcraftSpells(cards);
        case "SECRET_POOL":
            return getSecrets(cards);
        case "MAGNETIC_POOL":
            return getMinionsOfMechanic(cards, "MAGNETIC");
        case "GOLDEN_POOL":
            return [];
        case "DARKMOON_PRIZE_POOL_1":
            return getDarkmoonPrizes(cards, 1);
        case "DARKMOON_PRIZE_POOL_2":
            return getDarkmoonPrizes(cards, 2);
        case "DARKMOON_PRIZE_POOL_3":
            return getDarkmoonPrizes(cards, 3);
        case "DARKMOON_PRIZE_POOL_4":
            return getDarkmoonPrizes(cards, 4);
        case "NGUYEN_HP_POOL":
            return getNguyenHPs(cards);
        case "DIABLO_POOL_1":
            return getDiabloPrizes(cards, 1);
        case "DIABLO_POOL_2":
            return getDiabloPrizes(cards, 2);
        case "DIABLO_POOL_3":
            return getDiabloPrizes(cards, 3);
        case "DIABLO_POOL_4":
            return getDiabloPrizes(cards, 4);
        case "PUTRI_POOL_1":
            return getPutriMinions(cards, 1);
        case "PUTRI_POOL_2":
            return getPutriMinions(cards, 2);
        case "QUEST_POOL":
            return getQuests(cards);
        case "REWARD_POOL":
            return getRewards(cards);
        case "ETC_BUDDY_POOL":
            return getFoaFBuddies(cards);
        case "FOAF_BUDDY_POOL":
            return getFoaFBuddies(cards);
        default:
            return [];
    }
}

function getMinionsOfTier(cards, tier) {
    let minionsOfTier = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.techLevel === tier) {
            minionsOfTier.push(card);
        }
    }
    return minionsOfTier;
}

function getMinionsOfType(cards, type) {
    let minionsOfType = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.races && card.races.includes(type)) {
            minionsOfType.push(card);
        }
    }
    return minionsOfType;
}

function getMinionsOfMechanic(cards, mechanic) {
    let minionsOfMechanic = [];
    for (let card of cards) {
        if(card.isBattlegroundsPoolMinion && card.mechanics && card.mechanics.includes(mechanic)) {
            minionsOfMechanic.push(card);
        }
    }
    return minionsOfMechanic;
}

function getSpellcraftSpells(cards){
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

function getSecrets(cards) {
    let secrets = [];
    for (let card of cards) {
        if(card.isAkamSecret && card.isAkamSecret === true) {
            secrets.push(card);
        }
    }
    return secrets;
}

function getDiabloPrizes(cards, turn) {
    let prizes = [];
    for (let card of cards) {
        if(card.battlegroundsDiabloPrizeTurn && card.battlegroundsDiabloPrizeTurn === turn) {
            prizes.push(card);
        }
    }
    return prizes;
}

function getDarkmoonPrizes(cards, turn) {
    let prizes = [];
    for (let card of cards) {
        if(card.battlegroundsDarkmoonPrizeTurn && card.battlegroundsDarkmoonPrizeTurn === turn) {
            prizes.push(card);
        }
    }
    return prizes;
}

function getNguyenHPs(cards) {
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

function getQuests(cards) {
    let quests = [];
    for (let card of cards) {
        if(card.type === "SPELL" && card.mechanics && card.mechanics.includes("QUEST") 
                && !(card.bannedFromQuests && card.bannedFromQuests === true)) {
            quests.push(card);
        }
    }
    return quests;
}

function getRewards(cards) {
    let rewards = [];
    for (let card of cards) {
        if(card.type === "BATTLEGROUND_QUEST_REWARD" && !(card.bannedFromRewards && card.bannedFromRewards === true)) {
            rewards.push(card);
        }
    }
    return rewards;
}

function getPutriMinions(cards, poolNumber) {
    let undeads = [];
    for (let card of cards) {
        if(card.undeadCreationPool && card.undeadCreationPool === poolNumber) {
            undeads.push(card);
        }
    }
    return undeads;
}

function getFoaFBuddies(cards) {
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
    getMinionsForPool
}