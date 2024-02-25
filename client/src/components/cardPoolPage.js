import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { CardList } from "./cardList";

export default function CardPool() {
    const [cards, setCards] = useState([]);
    const params = useParams();

    let patchId;
    if(params.patchId !== undefined) {
        patchId = params.patchId.toString();
    }

    useEffect(() => {
        async function getCards(){
            let response;
            
            let patchId = params.patchId.toString();
            let poolId = params.poolId;
            response = await fetch(`http://localhost:5000/${patchId}/card-pool/${poolId}`);
             
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
    }, [params.poolId]);

    if(cards.length) {
        return <CardList cards={cards} patchId={patchId} />
    } else {
        return <p>Loading</p>;
    }

    ;
}