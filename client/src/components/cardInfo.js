import { useEffect, useState } from "react";
import { useParams } from "react-router";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";
import CardImage from "./cardImage";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/esm/Button";
import { getPoolFilter, tempFilter, tempFilter2, tempFilter3 } from "./filters";


export default function DisplayCardInfo({card, patchId, setActiveFilters}) {
    // const [card, setCard] = useState();
    // const params = useParams();
    // let patchId = params.patchId.toString();

    // useEffect(() => {
    //     async function getCard(){
    //         const id = params.id.toString();
    //         let response;
    //         if(params.patchId !== undefined) {
    //             let patchId = params.patchId.toString();
    //             response = await fetch(`http://localhost:5000/${patchId}/cards/${id}`);
    //         } else {
    //             response = await fetch(`http://localhost:5000/cards/${id}`);
    //         }
           
            
    //         if(!response.ok){
    //             const message = `an error has occurred: ${response.statusText}`;
    //             window.alert(message);
    //             return;
    //         }
    //         const card = await response.json();
    //         setCard(card);
    //     }
        
    //     getCard();
    //     return;
    // }, [params.id, params.patchId]);

    return <CardInfo card={card} patch={patchId} setActiveFilters={setActiveFilters} />   
}

export function CardInfo({ card, patch, setActiveFilters }) {
    if(card === undefined) {
        return <p>Loading</p>;
    }

    let cardInfo;

    switch (card.type){
        case "MINION":
            cardInfo = <MinionInfo card={card} patch={patch} setActiveFilters={setActiveFilters} />;
            break;
        case "HERO":
            cardInfo = <HeroInfo card={card} patch={patch} />;
            break;
        case "HERO_POWER":
            cardInfo = <HeroPowerInfo card={card} patch={patch} />;
            break;
        case "SPELL":
            cardInfo = <SpellInfo card={card} patch={patch} />;
            break;
        case "BATTLEGROUND_SPELL":
            cardInfo = <TavernSpellInfo card={card} patch={patch} />;
            break;
        case "BATTLEGROUND_TRINKET":
            cardInfo = <TrinketInfo card={card} patch={patch} />;
            break;
        default: 
            cardInfo = (<p>help</p>);

    }

    return <Row className="justify-content-md-center">
        <Col><CardImage card={card} className="hover-image" /></Col>
        <Col xs="8">{cardInfo}</Col>
    </Row>;
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

function MinionInfo({ card, patch, setActiveFilters }) {
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
        <>
            <h2>{golden}{card.name}</h2>
            <p>{basicInfo}</p>
            <RelatedCards card={card} patch={patch}/>
            <CardPools card={card} patch={patch} setActiveFilters={setActiveFilters}/>
            <OtherVersion card={card} patch={patch} />
        </>
        );

    // return (
    // <div className="grid-container">
    //     <div className="card-info-image">
    //         <CardImage card={card} />
    //     </div>
    //     <div className="card-info-text">
    //         <h2>{golden}{card.name}</h2>
    //         <p>{basicInfo}</p>
    //         <RelatedCards card={card} patch={patch}/>
    //         <CardPools card={card} patch={patch}/>
    //         <OtherVersion card={card} patch={patch} />
    //     </div>
    // </div>);
}

function HeroInfo({ card, patch }) {
    let srcOfCard = `/cards/en_US/${card.version}/${card.dbfId}.png`;
    let placeholderIcon = "/icons/placeholder.png";

    return (
        <>
                <h2>{card.name}</h2>
                <HeroPowerOfHeroInfo card={card} patch={patch}/>
                <CardPools card={card} patch={patch}/>
        </>);
}

function HeroPowerInfo({card, patch}) {
    let srcOfCard = `/cards/en_US/${card.version}/${card.dbfId}.png`;
    let placeholderIcon = "/icons/placeholder.png";

    return (<>
                <h3>{card.name}</h3>
                <div className="card-info-image">
                    <CardImage card={card} />
                    {/* <img src={srcOfCard} onError={(e)=>{e.target.onError = null; e.target.src = placeholderIcon}} alt={`${card.name}`} className="hover-image" /> */}
                </div>
                
                <p>
                {card.hasOwnProperty("hideCost") ? (
                    "Passive hero power"
                    ) : (
                        `${card.cost} cost hero power`
                    )
                }
                <br />
                {parse(card.text)}
                </p>
                <RelatedCards card={card} patch={patch}/>
                <CardPools card={card} patch={patch}/>
            </>);
}

function TavernSpellInfo({ card, patch }) {
    let cardText;

    if(card.hasOwnProperty("text")) {
        cardText = <><br />{parse(card.text)}</>;
    }
    let tribes = getElementsOfProperty(card, "associatedTribes");
    

    let tribesHtml;
    if(tribes.length === 1) {
        tribesHtml = <><br />Tribe: {tribes}</>
    } else if (tribes.length > 1) {
        tribesHtml = <><br />Tribes: {tribes}</>
    }

    let srcOfCard = `/cards/en_US/${card.version}/${card.dbfId}.png`;
    let placeholderIcon = "/icons/placeholder.png";
    

    let basicInfo = <>{card.cost} cost tavern spell on tier {card.techLevel}.{cardText}{tribesHtml}</>;
        
    return (
    <>
            <h2>{card.name}</h2>
            <p>{basicInfo}</p>
            <RelatedCards card={card} patch={patch}/>
            <CardPools card={card} patch={patch}/>
            <OtherVersion card={card} patch={patch} />
    </>);
}

function TrinketInfo({ card, patch }) {
    let cardText;

    if(card.hasOwnProperty("text")) {
        cardText = <><br />{parse(card.text)}</>;
    }
    let tribes = getElementsOfProperty(card, "associatedTribes");
    

    let tribesHtml;
    if(tribes.length === 1) {
        tribesHtml = <><br />Tribe: {tribes}</>
    } else if (tribes.length > 1) {
        tribesHtml = <><br />Tribes: {tribes}</>
    }

    let srcOfCard = `/cards/en_US/${card.version}/${card.dbfId}.png`;
    let placeholderIcon = "/icons/placeholder.png";
    

    let basicInfo = <>{card.cost} cost trinket.{cardText}{tribesHtml}</>;
        
    return (
    <>
            <h2>{card.name}</h2>
            <p>{basicInfo}</p>
            <RelatedCards card={card} patch={patch}/>
            <CardPools card={card} patch={patch}/>
            <OtherVersion card={card} patch={patch} />
    </>);
}

function SpellInfo({ card, patch }) {
    let cardText;

    if(card.hasOwnProperty("text")) {
        cardText = <><br />{parse(card.text)}</>;
    }

    let srcOfCard = `/cards/en_US/${card.version}/${card.dbfId}.png`;
    let placeholderIcon = "/icons/placeholder.png";
    

    let basicInfo = <>{cardText}</>;
        
    return (
    <>
            <h2>{card.name}</h2>
            <p>{basicInfo}</p>
            <RelatedCards card={card} patch={patch}/>
            <CardPools card={card} patch={patch}/>
            <OtherVersion card={card} patch={patch} />
    </>);
}

function HeroPowerOfHeroInfo({ card, patch }) {
    const [hp, setHp] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/${patch}/cards/${card.heroPowerDbfId}`)
        .then(response => {
            if(!response.ok) {
                throw new Error(`an error has occurred: ${response.statusText}. Current card: ${card.dbfId}. Hero power: ${card.heroPowerDbfId}`);
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
            <HeroPowerInfo card={hp} patch={patch} />
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
        relatedCardsList.push(<li key={rc}><Link to={`../${rc}`}>{rc}</Link></li>);
        // relatedCardsList.push(<li key={rc}><Link to={`../${rc}`}>{rc}</Link></li>);
    });
    return(
        <div>
            <h3>Related cards</h3>
            <ul>{relatedCardsList}</ul>
        </div>
    );
}

function CardPools({card, patch, setActiveFilters}) {

    if(!card.hasOwnProperty("pools")){
        return;
    }

    const handleClick = () => {
        // setActiveFilters(activeFilters => {return {...activeFilters, cardFilterFcs: [tempFilter(), tempFilter2(card)]} });
        let poolFilter = getPoolFilter(card.pools[0]);
        setActiveFilters(activeFilters => {return {...activeFilters, cardFilterFcs: [poolFilter]} });
    }


    return <Button variant="primary" onClick={handleClick}>Apply filter</Button>;

    // if(!card.hasOwnProperty("pools")){
    //     return;
    // }
    // let cardPoolList = [];
    // card.pools.forEach((pool) => {
    //     cardPoolList.push(<li key={pool}>{pool}</li>);
    // });
    
    // return (
    // <div>
    //     <h3>{cardPoolList.length === 1 ? "Card Pool" : "Card Pools"}</h3>
    //     <ul>
    //         {cardPoolList}
    //     </ul>
    // </div>
    // );
}

function OtherVersion({card, patch}) {
    let otherVersion;
    if(card.hasOwnProperty("battlegroundsPremiumDbfId")) {
        otherVersion = <Link to={`../${card.battlegroundsPremiumDbfId}`}>Golden Version</Link>;
    } else if (card.hasOwnProperty("battlegroundsNormalDbfId")) {
        otherVersion = <Link to={`../${card.battlegroundsNormalDbfId}`}>Regular Version</Link>;
    }
    return otherVersion;
}