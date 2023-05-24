import { useEffect, useState } from "react";

export default function CardList() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        async function getCards(){
            const response = await fetch(`http://localhost:5000/cards/`);
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
        const cardlist = cards.map( card =>
            <li key={card.version_id}>
                {card.name}
            </li>
        )
        return(
            <ul>
                {cardlist}
            </ul>
        );
    } else {
        return(
            <p>Loading</p>
        );
    }
}