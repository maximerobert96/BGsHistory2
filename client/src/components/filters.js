import React, { useState, useEffect } from 'react';

function FilterDropdown({ cardPool, setActiveCards }) {
    const commonFilters = [
        {none: {fc: activeCardsFilter, name: "None"}},
        {battlecry: {fc: mechanicFilter, name: "Battlecry", extraArgs: ["BATTLECRY"]}}, 
        {deathrattle: {fc: mechanicFilter, name: "Deathrattle", extraArgs: ["DEATHRATTLE"]}}, 
        {tavernSpells: {fc: cardTypeFilter, name: "Tavern Spell", extraArgs: ["BATTLEGROUND_SPELL"]}}, 
        {duosOnly: {fc: onlyDuosFilter, name: "Duo specific"}}
    ];


    const handleFilterChange = (event) => {
        const selectedFilterName = event.target.value;
        const selectedFilterObj = commonFilters.find(filter => filter[selectedFilterName]);
        const subObj = Object.values(selectedFilterObj)[0];
        setActiveCards(c => cardPool);
        if(subObj.hasOwnProperty("extraArgs")){
            applyFilter(setActiveCards, subObj.fc, subObj.extraArgs);
        } else {
            applyFilter(setActiveCards, subObj.fc);
        }
        
    }

    return <select name="filters" id="filters" onChange={handleFilterChange}>
        {commonFilters.map((filter, index) => {
            const filterName = Object.keys(filter)[0];
            return (<option key={index} value={filterName}>{filter[filterName].name}</option>);
        })}
    </select>

}


function applyFilter(setCards, filterBool, args){
    // let filteredCards = filter(cards);
    if(args !== undefined){
        setCards(cards => cards.filter( (card) => filterBool(card, ...args)));
    } else {
        setCards(cards => cards.filter( (card) => filterBool(card)));
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

function faelinFilter(card) {
    return (card.techLevel === 2 || card.techLevel === 4 || card.techLevel === 6) && card.hasOwnProperty("type") && card.type === "MINION";
    // return cards.filter((card) => 
    // (card.techLevel === 2 || card.techLevel === 4 || card.techLevel === 6) && card.hasOwnProperty("type") && card.type === "MINION");
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