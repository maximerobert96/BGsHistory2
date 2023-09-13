import { useEffect, useState } from "react";
import { useParams } from "react-router";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";

export default function CardInfo() {
    const [card, setCard] = useState();
    const params = useParams();
    let patchId = params.patchId.toString();

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
                return (<MinionInfo card={card} patch={patchId} />);
                case "HERO":
                    return (<HeroInfo card={card} patch={patchId} />);
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

function MinionInfo({ card, patch }) {
    // const regularFields = {name: "Name", techLevel: "Tier", attack: "Attack", health: "Health", text: "Card text"};
    // let fieldList = [];
    // for(let field in regularFields) {
    //     if(card.hasOwnProperty(field)) {
    //         fieldList.push(<li key={field}>{regularFields[field]}: {card[field]}</li>);
    //     }
    // }
    let cardText;
    let golden;
    if(card.hasOwnProperty("battlegroundsNormalDbfId")) {
        golden = "Golden";
    }
    if(card.hasOwnProperty("text")) {
        cardText = parse(card.text);
    }
        
   
    return (
    <div>
        <h2>{golden} {card.name}</h2>
        <p>{card.attack}/{card.health} minion on tier {card.techLevel}.<br />{cardText}</p>
        <RelatedCards card={card} patch={patch}/>
        <CardPools card={card}/>
        <OtherVersion card={card} patch={patch} />
    </div>);
}

function HeroInfo({ card, patch }) {

}

function RelatedCards({ card, patch }) {
    if(!card.hasOwnProperty("relatedCards")) {
        return;
    }
    let relatedCardsList = [];
    card.relatedCards.forEach((rc) => {
        relatedCardsList.push(<li key={rc}><Link to={`/${patch}/cards/${rc}`}>{rc}</Link></li>);
    });
    return(
        <div>
            <h3>Related cards</h3>
            <ul>{relatedCardsList}</ul>
        </div>
    );
}

function CardPools({card, patch}) {
    if(!card.hasOwnProperty("pools")){
        return;
    }
    let cardPoolList = [];
    card.pools.forEach((pool) => {
        cardPoolList.push(<li key={pool}>{pool}</li>);
    });
    
    return (
    <div>
        <h3>{cardPoolList.length == 1 ? "Card Pool" : "Card Pools"}</h3>
        <ul>
            {cardPoolList}
        </ul>
    </div>
    );
}

function OtherVersion({card, patch}) {
    let otherVersion;
    if(card.hasOwnProperty("battlegroundsPremiumDbfId")) {
        otherVersion = <Link to={`/${patch}/cards/${card.battlegroundsPremiumDbfId}`}>Golden Version</Link>;
    } else if (card.hasOwnProperty("battlegroundsNormalDbfId")) {
        otherVersion = <Link to={`/${patch}/cards/${card.battlegroundsNormalDbfId}`}>Regular Version</Link>;
    }
    return otherVersion;
}