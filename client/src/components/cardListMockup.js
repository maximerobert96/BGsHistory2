import { useState } from "react";

const CARDS = [
    {name: "Weaver", techLevel: 1, type: "MINION", tribe: "GENERAL"},
    {name: "Honcho", techLevel: 2, type: "MINION", tribe: "MURLOC"},
    {name: "Cobalt", techLevel: 3, type: "MINION", tribe: "MECHANICAL"},
    {name: "Primalfin", techLevel: 4, type: "MINION", tribe: "MURLOC"},
    {name: "Reef", techLevel: 4, type: "MINION", tribe: "GENERAL"},
    {name: "Mechano Egg", techLevel: 4, type: "MINION", tribe: "MECHANICAL"},
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
    let availableTribes = getTribes(cards);
    const [tribes, setTribes] = useState(availableTribes);

    let cardsOfSelectedTribes = cards.filter(
        function (card) {
            return tribes.includes(card.tribe) || tribes.includes("DEBUG") && !card.hasOwnProperty("tribe");
        }
    );

    return( 
        <div>
            <FilterTable tribes={availableTribes} selectedTribes={tribes} onSelectedTribesChange={setTribes} />
            <CategoryTable cards={cardsOfSelectedTribes} />
        </div>
    );

}

function FilterTable({ tribes, selectedTribes, onSelectedTribesChange }) {
    let tribeTable = [];
    for(let tribe of tribes) {

        tribeTable.push(
            <label htmlFor={tribe} key={tribe}>
                <input 
                    type="checkbox" 
                    id={tribe} 
                    name={tribe} 
                    value={tribe} 
                    defaultChecked={selectedTribes.includes(tribe)} 
                    onChange={
                        function (e) {
                            let newArr = [];
                            if(selectedTribes.includes(e.target.value)) {
                                newArr = selectedTribes.filter((name) => name !== e.target.value);
                            } else {
                                newArr = [...selectedTribes, e.target.value];
                            }
                            onSelectedTribesChange(newArr);
                        }
                    } />
                {' '}
                {tribe}
            </label>
        );
        
    }
    return (
        <form>
            {tribeTable}
        </form>
    );
    
}

function CategoryTable({ cards }) {
    let heroes = cards.filter((card) =>
        card.type === "HERO" );
    let minions = cards.filter((card) =>
        card.type === "MINION");
    return (
        <div>
            <Heroes cards={heroes} />
            <Minions cards={minions} />
        </div>
    );
}

function Heroes({ cards }) {
    
    return (
        <div>
            <h1>Heroes</h1>
            <CardRows cards={cards} />
        </div>
    );
}

function Minions({ cards }) {
    
    let tierTables = [];
    for(let i = 1; i <= 6; ++i ) {
        tierTables.push(<Tier tier={i} cards={cards} key={i} />);
    }
    
    return (
        <div>
            <h1>Minions</h1>
            {tierTables}
        </div>
    );
}


function Tier({ tier, cards }) {
    let minionsOfTier = cards.filter((card) =>
        card.techLevel === tier);
    return(
        <div>
            <h2>Tier {tier}</h2>
            <CardRows cards={minionsOfTier} />
        </div>
    );
}

function CardRows({ cards }) {
    let cardRows = [];
    cards.forEach((card) => {
        cardRows.push(<li key={card.name}>{card.name}</li>)
    })
    return (
        <ul>
            {cardRows}
        </ul>
    );
}


export default function Mockup() {
    return <CardList cards={CARDS} />;
  }
  
