import { useEffect, useState } from "react";
import './practice.css';

// import { Link, Outlet } from "react-router-dom";
// import { useParams } from "react-router";

export default function Practice() {
    const [cards, setCards] = useState([]);


    useEffect(() => {
        async function getCards(){
            let response;
            response = await fetch(`http://localhost:5000/practice`);
            
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
    }, []);

    if(cards.length) {
        return (
        <>
            <DisplayCards cards={cards}/>
        </>
        );
    } else {
        return <p>Loading</p>;
    }

    ;
}

function DisplayCards({cards}){
    let listOfImages = [];
    let placeholderIcon = "icons/placeholder.png";
    cards.forEach(card => {
        let srcOfIcon = `icons/${card.dbfId}.png`;
        listOfImages.push(<img src={srcOfIcon} onError={(e)=>{e.target.onError = null; e.target.src = placeholderIcon}} className="card-icons" alt={card.name} />)
    });
    return <>{listOfImages}</>;
}
