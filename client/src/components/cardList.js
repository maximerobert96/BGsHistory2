import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        let tavern_tier_1 = cards.filter( card =>
            card.tavernTier === 1).sort((a,b) =>
            (a.name > b.name) ? 1 : -1
        );
        let tavern_tier_2 = cards.filter( card =>
            card.tavernTier === 2).sort((a,b) =>
            (a.name > b.name) ? 1 : -1
        );
        let tavern_tier_3 = cards.filter( card =>
            card.tavernTier === 3).sort((a,b) =>
            (a.name > b.name) ? 1 : -1
        );
        let tavern_tier_4 = cards.filter( card =>
            card.tavernTier === 4).sort((a,b) =>
            (a.name > b.name) ? 1 : -1
        );
        let tavern_tier_5 = cards.filter( card =>
            card.tavernTier === 5).sort((a,b) =>
            (a.name > b.name) ? 1 : -1
        );
        let tavern_tier_6 = cards.filter( card =>
            card.tavernTier === 6).sort((a,b) =>
            (a.name > b.name) ? 1 : -1
        );

        const cardlistHeroes = heroes.map( card =>
            <li key={card.id}>
                <Link to={`/card/${card.id}`}>{card.name}</Link>
            </li>
        )

        const cardlistTier1 = tavern_tier_1.map( card =>
            <li key={card.id}>
                <Link to={`/card/${card.id}`}>{card.name}</Link>
            </li>
        )
        const cardlistTier2 = tavern_tier_2.map( card =>
            <li key={card.id}>
                <Link to={`/card/${card.id}`}>{card.name}</Link>
            </li>
        )
        const cardlistTier3 = tavern_tier_3.map( card =>
            <li key={card.id}>
                <Link to={`/card/${card.id}`}>{card.name}</Link>
            </li>
        )
        const cardlistTier4 = tavern_tier_4.map( card =>
            <li key={card.id}>
                <Link to={`/card/${card.id}`}>{card.name}</Link>
            </li>
        )
        const cardlistTier5 = tavern_tier_5.map( card =>
            <li key={card.id}>
                <Link to={`/card/${card.id}`}>{card.name}</Link>
            </li>
        )
        const cardlistTier6 = tavern_tier_6.map( card =>
            <li key={card.id}>
                <Link to={`/card/${card.id}`}>{card.name}</Link>
            </li>
        )

        // const cardlist = cards.map( card =>
        //     <li key={card.id}>
        //         <Link to={`/card/${card.id}`}>{card.name}</Link>
        //     </li>
        // )
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