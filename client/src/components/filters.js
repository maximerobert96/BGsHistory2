import React, { useState, useEffect } from 'react';

function FilterDropdown({ cardPool, setActiveCards }) {
    const commonFilters = [
        {none: {fc: activeCardsFilter, name: "None"}},
        {faelin: {fc: faelinFilter, name: "Faelin"}}, 
        {duosOnly: {fc: onlyDuosFilter, name: "Duo specific"}}
    ];


    const handleFilterChange = (event) => {
        const selectedFilterName = event.target.value;
        const selectedFilterObj = commonFilters.find(filter => filter[selectedFilterName]);
        const subObj = Object.values(selectedFilterObj)[0];
        setActiveCards(c => cardPool);
        applyFilter(setActiveCards, subObj.fc);
    }

    return <select name="filters" id="filters" onChange={handleFilterChange}>
        {commonFilters.map((filter, index) => {
            const filterName = Object.keys(filter)[0];
            return (<option key={index} value={filterName}>{filter[filterName].name}</option>);
        })}
    </select>

}


function applyFilter(setCards, filterBool){
    // let filteredCards = filter(cards);
    
    setCards(cards => cards.filter( (card) => filterBool(card)));

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