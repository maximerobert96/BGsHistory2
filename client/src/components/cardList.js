import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";

export default function MainPage() {
    const [cards, setCards] = useState([]);
    const params = useParams();

    let patchId;
    if(params.patchId !== undefined) {
        patchId = params.patchId.toString();
    }

    useEffect(() => {
        async function getCards(){
            let response;
            if(params.patchId !== undefined) {
                let patchId = params.patchId.toString();
                response = await fetch(`http://localhost:5000/${patchId}/cards/`);
            } else {
                response = await fetch(`http://localhost:5000/cards/`);
            }
            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const cards = await response.json();
            setCards(cards);
        }
        
        getCards();
        return;
    }, [cards]);

    if(cards.length) {
        return <CardList cards={cards} patchId={patchId} />
    } else {
        return <p>Loading</p>;
    }

    ;
}


function getTribes(cards) {
    let tribes = [];
    for(let card of cards) {
        let cardTribes = card.associatedTribes;
        if(cardTribes === undefined) {
            cardTribes = ["DEBUG"];
        }
        for(let cardTribe of cardTribes) {
            if(!tribes.includes(cardTribe)) {
                tribes.push(cardTribe);
            }
        }
        
    }
    return tribes;
}

function CardList({ cards, patchId }) {
    let availableTribes = getTribes(cards);
    const [tribes, setTribes] = useState(availableTribes);

    let cardsOfSelectedTribes = cards.filter(
        function (card) {
            if(card.hasOwnProperty("associatedTribes")) {
                let isSelectedTribe = false;
                for(let associatedTribe of card.associatedTribes) {
                    if(tribes.includes(associatedTribe)) {
                        isSelectedTribe = true;
                        break;
                    }
                }
                return isSelectedTribe;
            } else {
                return tribes.includes("DEBUG");
            }
        }
    );

    return( 
        <div>
            <FilterTable tribes={availableTribes} selectedTribes={tribes} onSelectedTribesChange={setTribes} />
            <CategoryTable cards={cardsOfSelectedTribes} patchId={patchId} />
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

function CategoryTable({ cards, patchId }) {
    let heroes = cards.filter((card) =>
        card.type === "HERO" );
    let minions = cards.filter((card) =>
        card.type === "MINION");
    return (
        <div>
            <Heroes cards={heroes} patchId={patchId} />
            <Minions cards={minions} patchId={patchId} />
        </div>
    );
}

function Heroes({ cards, patchId }) {
    
    return (
        <div>
            <h1>Heroes</h1>
            <CardRows cards={cards} patchId={patchId} />
        </div>
    );
}

function Minions({ cards, patchId }) {
    
    let tierTables = [];
    for(let i = 1; i <= 6; ++i ) {
        tierTables.push(<Tier tier={i} cards={cards} key={i} patchId={patchId} />);
    }
    
    return (
        <div>
            <h1>Minions</h1>
            {tierTables}
        </div>
    );
}


function Tier({ tier, cards, patchId }) {
    let minionsOfTier = cards.filter((card) =>
        card.techLevel === tier);
    return(
        <div>
            <h2>Tier {tier}</h2>
            <CardRows cards={minionsOfTier} patchId={patchId} />
        </div>
    );
}

function CardRows({ cards, patchId }) {


    let cardRows = [];
    cards.sort((a,b) => a.name > b.name ? 1 : -1 )
        .forEach((card) => {
        let cardRow;
        if(patchId === undefined) {
            cardRow = <li key={card.dbfId}>
                    <Link to={`/cards/${card.dbfId}`}>{card.name}</Link>
                </li>;
        } else {
            cardRow = <li key={card.dbfId}>
                         <Link to={`/${patchId}/cards/${card.dbfId}`}>{card.name}</Link>
                     </li>;
        }
        cardRows.push(cardRow);
    })
    return (
        <ul>
            {cardRows}
        </ul>
    );
}
