import { useEffect, useState } from "react";

export default function CardList() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        async function getCards(){
            const response = await fetch(`http://localhost:5000/card/`);
            if(!response.ok){
                const message = `an error has occured: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const cards = await response.json();
            setCards(cards);
        }
        
        getCards();
        return;
    }, [cards.length]);

    return(
        <div>
            <p>{cards.name}</p>
        </div>
    );
}