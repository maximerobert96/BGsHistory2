import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const CARDS = [
    {name: "Weaver", techLevel: 1, type: "MINION", tribe: "GENERAL"},
    {name: "Honcho", techLevel: 2, type: "MINION", tribe: "MURLOC"},
    {name: "Cobalt", techLevel: 3, type: "MINION", tribe: "MECHANICAL"},
    {name: "Primalfin", techLevel: 4, type: "MINION", tribe: "MURLOC"},
    {name: "Brann", techLevel: 5, type: "MINION"},
    {name: "Zapp", techLevel: 6, type: "MINION", tribe: "GENERAL"},
    {name: "Mutanus", type: "HERO", tribe: "GENERAL"},
    {name: "Flurgl", type: "HERO", tribe: "MURLOC"}
]

function getTribes(cards) {
    let tribes = [];
    for(let card of cards) {
        let cardTribe = card.tribe;
        if(cardTribe === undefined) {
            cardTribe = "DEBUG";
        }
        if(!tribes.includes(cardTribe)) {
            tribes.push(cardTribe);
        }
    }
    return tribes;
}

function CardList({ cards }) {
    let tribes = getTribes(cards);
    return( 
        <div>
            <FilterTable tribes={tribes} />
            <CategoryTable cards={cards} />
        </div>
    );

}

function FilterTable({ tribes }) {
    let tribeTable = [];
    for(let tribe of tribes) {
        tribeTable.push(
            <button>{tribe}</button>
        );
    }
    return tribeTable;
    
}

function CategoryTable({ cards }) {
    let minions = cards.filter((card) =>
        card.type === "MINION");
    let heroes = cards.filter((card) =>
        card.type === "HERO");
    return (
        <div>
            <Category name="Heroes" cards={heroes} />
            <Category name="Minions" cards={minions} />
        </div>
    );
}

function Category({ name, cards }) {
    return (
        <div>
            <h1>{name}</h1>
            <CardRows cards={cards} />
        </div>
    );
}

function Tier({ tier }) {
    return(
        <div>
            <h2>Tier {tier.number}</h2>
            {tier.rows}
        </div>
    );
}

function CardRows({ cards }) {
    let cardRows = [];
    cards.forEach((card) => {
        cardRows.push(<li>{card.name}</li>)
    })
    return (
        <ul>
            {cardRows}
        </ul>
    );
}

function CardRow() {

}

function Filter() {

}


export default function Mockup() {
    return <CardList cards={CARDS} />;
  }
  
