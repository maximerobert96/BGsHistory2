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

function getElementsOfProperty(card, property) {
    let elementsOfProperty = [];
    if(card.hasOwnProperty(property)) {
        card[property].forEach((p) => {
            elementsOfProperty.push(p);
        });
    }
    return elementsOfProperty;
}

function MinionInfo({ card, patch }) {
    let cardText;
    let golden;
    if(card.hasOwnProperty("battlegroundsNormalDbfId")) {
        golden = "Golden ";
    }
    if(card.hasOwnProperty("text")) {
        cardText = <><br />{parse(card.text)}</>;
    }
    let races = getElementsOfProperty(card, "races");
    let tribes = getElementsOfProperty(card, "associatedTribes");
    
    let racesHtml;
    if(races.length === 1) {
        racesHtml = <><br />Race: {races}</>
    } else if (races.length > 1) {
        racesHtml = <><br />Races: {races}</>
    }

    let tribesHtml;
    if(tribes.length === 1) {
        tribesHtml = <><br />Tribe: {tribes}</>
    } else if (tribes.length > 1) {
        tribesHtml = <><br />Tribes: {tribes}</>
    }
    

    let basicInfo = <>{card.attack}/{card.health} minion on tier {card.techLevel}.{cardText}{racesHtml}{tribesHtml}</>;
        
    return (
    <div>
        <h2>{golden}{card.name}</h2>
        <p>{basicInfo}</p>
        <RelatedCards card={card} patch={patch}/>
        <CardPools card={card} patch={patch}/>
        <OtherVersion card={card} patch={patch} />
    </div>);
}

function HeroInfo({ card, patch }) {
    return (
        <div>
            <h2>{card.name}</h2>
            <HeroPowerInfo card={card} patch={patch}/>
            <CardPools card={card} patch={patch}/>
        </div>);
}

function HeroPowerInfo({ card, patch }) {
    const [hp, setHp] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/${patch}/cards/${card.heroPowerDbfId}`)
        .then(response => {
            if(!response.ok) {
                throw new Error(`an error has occurred: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            setHp(data);
        })
        .catch(error => {
            window.alert(error);
        });
    }, [card, patch]);
    
    let hpHtml = (<p>Loading</p>);
    if(hp) {
        hpHtml = (
            <>
                <h3>{hp.name}</h3>
                <p>
                {hp.hasOwnProperty("hideCost") ? (
                    "Passive hero power"
                    ) : (
                        `${hp.cost} cost hero power`
                    )
                }
                <br />
                {parse(hp.text)}
                </p>
                <RelatedCards card={hp} patch={patch}/>
                <CardPools card={hp} patch={patch}/>
            </>
        );
    }
    
    return (
        <div>
            {hpHtml}
        </div>
    );

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
        <h3>{cardPoolList.length === 1 ? "Card Pool" : "Card Pools"}</h3>
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