import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function CardInfo() {
    const [card, setCard] = useState();
    const params = useParams();

    useEffect(() => {
        async function getCard(){
            const id = params.id.toString();
            let response;
            if(params.patchId !== undefined) {
                let patchId = params.patchId.toString();
                response = await fetch(`http://localhost:5000/${patchId}/cards/${id}`);
            } else {
                response = await fetch(`http://localhost:5000/cards/${id}`);
            }
           
            
            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const card = await response.json();
            setCard(card);
        }
        
        getCard();
        return;
    });

    if(card){
        switch (card.type){
            case "MINION":
                return (<MinionInfo card={card} />);
                case "HERO":
                    return (<HeroInfo card={card} />);
                    // if(card.heroPower.cost) {
                    //     return(
                    //         <ul>
                    //             <li>Name: {card.name}</li>
                    //             <li>HP Name: {card.heroPower.name}</li>
                    //             <li>HP Cost: {card.heroPower.cost}</li>
                    //             <li>HP Text: {card.heroPower.text}</li>
                    //         </ul>
                    //     );
                    // } else {
                    //     return(
                    //         <ul>
                    //             <li>Name: {card.name}</li>
                    //             <li>HP Name: {card.heroPower.name}</li>
                    //             <li>HP Text: {card.heroPower.text}</li>
                    //         </ul>
                    //     );
                    // }
                default: 
                    return(<p>help</p>);

        }
    } else {
        return(<p>Loading</p>);
    }
    
}

function MinionInfo({ card }) {
    const regularFields = {name: "Name", techLevel: "Tier", attack: "Attack", health: "Health", text: "Card text"};
    let fieldList = [];
    for(let field in regularFields) {
        if(card.hasOwnProperty(field)) {
            fieldList.push(<li key={field}>{regularFields[field]}: {card[field]}</li>);
        }
    }
    
        
   
    return (
    <ul>
        {fieldList}
    </ul>);
}

function HeroInfo({ card }) {

}