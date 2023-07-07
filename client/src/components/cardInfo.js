import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function CardInfo() {
    const [card, setCard] = useState();
    const params = useParams();

    useEffect(() => {
        async function getCard(){
            const id = params.id.toString();
            const response = await fetch(`http://localhost:5000/card/${id}`);
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
                return(
                    <ul>
                        <li>Name: {card.name}</li>
                        <li>Tier: {card.techLevel}</li>
                        <li>Attack: {card.attack}</li>
                        <li>Health: {card.health}</li>
                        <li>Text: {card.text}</li>
                    </ul>
                );
                case "HERO":
                    return(
                        <ul>
                            <li>Name: {card.name}</li>
                            <li>Armor: {card.armor}</li>
                            <li>HP Name: {card.heroPower.name}</li>
                            <li>HP Cost: {card.heroPower.cost}</li>
                            <li>HP Text: {card.heroPower.text}</li>
                        </ul>
                    );
                    default: 
                        return(<p>help</p>);

        }
    } else {
        return(<p>non</p>);
    }
    // return(
    //     <div>
    //         <table>
    //             <thead>
    //             <tr>
    //                     <th>Name</th>
    //                     <th>Tier</th>
    //                     <th>Attack</th>
    //                     <th>Health</th>
    //                     <th>Text</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 <tr>
    //                     <td>{minion.name}</td>
    //                     <td>{minion.tavern_tier}</td>
    //                     <td>{minion.attack}</td>
    //                     <td>{minion.health}</td>
    //                     <td>{minion.text}</td>
    //                 </tr>
    //             </tbody>
    //         </table>
    //     </div>
    // );
}