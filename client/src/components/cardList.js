import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function keepTavernTier ( cards, tavernTier ) {
    return cards.filter( card =>
        card.tavernTier === tavernTier).sort((a,b) =>
        (a.name > b.name) ? 1 : -1
    );
}

function listCardsHtml ( cards ) { 
    return cards.map( card =>
        <li key={card.id}>
            <Link to={`/card/${card.id}`}>{card.name}</Link>
        </li>
    )
}

export default function CardList() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        async function getCards(){
            const response = await fetch(`http://localhost:5000/card/`);
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

    if(cards.length){

        let heroes = cards.filter( card =>
            card.type === "HERO").sort((a,b) =>
                (a.name > b.name) ? 1 : -1
            );
        let tavernTier1 = keepTavernTier(cards, 1);
        let tavernTier2 = keepTavernTier(cards, 2);
        let tavernTier3 = keepTavernTier(cards, 3);
        let tavernTier4 = keepTavernTier(cards, 4);
        let tavernTier5 = keepTavernTier(cards, 5);
        let tavernTier6 = keepTavernTier(cards, 6);
        
        const cardlistHeroes = listCardsHtml(heroes);
        const cardlistTier1 = listCardsHtml(tavernTier1);
        const cardlistTier2 = listCardsHtml(tavernTier2);
        const cardlistTier3 = listCardsHtml(tavernTier3);
        const cardlistTier4 = listCardsHtml(tavernTier4);
        const cardlistTier5 = listCardsHtml(tavernTier5);
        const cardlistTier6 = listCardsHtml(tavernTier6);

        
        return(
            <div>
                <h1>Heroes</h1>
                <ul>
                    {cardlistHeroes}
                </ul>
                <h1>Minions</h1>
                <h2>Tier 1</h2>
                <ul>
                    {cardlistTier1}
                </ul>
                <h2>Tier 2</h2>
                <ul>
                    {cardlistTier2}
                </ul>
                <h2>Tier 3</h2>
                <ul>
                    {cardlistTier3}
                </ul>
                <h2>Tier 4</h2>
                <ul>
                    {cardlistTier4}
                </ul>
                <h2>Tier 5</h2>
                <ul>
                    {cardlistTier5}
                </ul>
                <h2>Tier 6</h2>
                <ul>
                    {cardlistTier6}
                </ul>
            </div>
        );
    } else {
        return(
            <p>Loading</p>
        );
    }
}