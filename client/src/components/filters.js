import React, { useState, useEffect } from 'react';

function FilterDropdown({ cardPool, setActiveFilters }) {
    const commonFilters = [
        {none: {fc: activeCardsFilter, name: "None"}},
        {withoutDuos: {fc: withoutDuosFilter, name: "Without duo specific cards"}},
        {duosOnly: {fc: onlyDuosFilter, name: "Duo specific"}},
        {battlecry: {fc: mechanicFilter, name: "Battlecry", extraArgs: ["BATTLECRY"]}}, 
        {deathrattle: {fc: mechanicFilter, name: "Deathrattle", extraArgs: ["DEATHRATTLE"]}}, 
        {endOfTurn: {fc: mechanicFilter, name: "End of turn", extraArgs: ["END_OF_TURN"]}}, 
        {startOfCombat: {fc: mechanicFilter, name: "Start of combat", extraArgs: ["START_OF_COMBAT"]}}, 
        {tavernSpells: {fc: cardTypeFilter, name: "Tavern Spell", extraArgs: ["BATTLEGROUND_SPELL"]}},
        {discover: {fc: discoverFilter, name: "Discover"}},
        {avenge: {fc: mechanicFilter, name: "Avenge", extraArgs: ["AVENGE"]}}
    ];


    const handleFilterChange = (event) => {
        const selectedFilterName = event.target.value;
        const selectedFilterObj = commonFilters.find(filter => filter[selectedFilterName]);

        // currently overwrites the cardFilterFcs, so I don't stack them. It's like that because the dropdown is only one value, but this is subject to a change.
        setActiveFilters(activeFilters => {return {...activeFilters, cardFilterFcs: [selectedFilterObj]} });
        
    }

    return <select name="filters" id="filters" onChange={handleFilterChange}>
        {commonFilters.map((filter, index) => {
            const filterName = Object.keys(filter)[0];
            return (<option key={index} value={filterName}>{filter[filterName].name}</option>);
        })}
    </select>

}


export function applyFilter(cards, filterBool, args){
    // let filteredCards = filter(cards);
    if(args !== undefined){
        return cards.filter( (card) => filterBool(card, ...args));
    } else {
        return cards.filter( (card) => filterBool(card));
    }
    
    

}

function tierFilter(card, tier){
    return card.techLevel === tier;
}

function cardTypeFilter(card, cardType){
    return card.hasOwnProperty("type") && card.type === cardType;
}

function mechanicFilter(card, mechanic){
    return card.hasOwnProperty("mechanics") && card.mechanics.includes(mechanic);
}

function discoverFilter(card){
    return mechanicFilter(card, "DISCOVER") || (card.hasOwnProperty("referencedTags") && card.referencedTags.includes("DISCOVER"));
}

function activeCardsFilter(card) {
    return true;
}

function withoutDuosFilter(card) {
    return !card.hasOwnProperty("isDuoCard");
}

function onlyDuosFilter(card) {
   return card.hasOwnProperty("isDuoCard");
}

export default FilterDropdown;