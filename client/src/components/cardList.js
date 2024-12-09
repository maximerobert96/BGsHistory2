import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import PatchInfo from "./PatchInfo";
import CardImage from "./cardImage";
import FilterDropdown, { applyFilter } from "./filters";
import Accordion from 'react-bootstrap/Accordion';
import DisplayCardInfo from "./cardInfo";

export default function MainPage() {
    const [cards, setCards] = useState([]);
    // const [activeCards, setActiveCards] = useState([]);
    const params = useParams();
    const [selectedCard, setSelectedCard] = useState(null);
    const [activeFilters, setActiveFilters] = useState( {tribes: ["GENERAL", "BEAST", "DEMON", "DRAGON", "ELEMENTAL", "MECHANICAL", "MURLOC", "NAGA", "PIRATE", "QUILBOAR", "UNDEAD"], cardFilterFcs: [], sortFc: defaultSortFc } );

    let activeCards = getActiveCards(activeFilters, cards);

    // memoized version in case the function takes too much time. Gotta import useMemo from react.
    // const activeCards = useMemo( () => {
    //     return getActiveCards(activeFilters, cards);
    // }, [activeFilters, cards] )

    let patchId;
    if(params.patchId !== undefined) {
        patchId = params.patchId.toString();
    }

    useEffect(() => {
        async function getCards(){
            let response;
            if(params.patchId !== undefined) {
                let patchId = params.patchId.toString();
                response = await fetch(`http://localhost:5000/${patchId}/cards/`);
            } else {
                response = await fetch(`http://localhost:5000/cards/`);
            }
            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const cards = await response.json();
            setCards(c => cards);
            // applyFilter(setCards, withoutDuosFilter);
            // applyFilter(setCards, onlyDuosFilter);
            // applyFilter(setCards, faelinFilter);


            
        }
        
        getCards();
        return;
    }, [params.patchId]);

    

        return (
        <>
            { selectedCard &&
            (<CardInfoOverlay card={selectedCard} patchId={patchId} setSelectedCard={setSelectedCard} activeCards={activeCards} />)}
            <PatchInfo patchId={patchId}/>
            {cards.length && 
            (<CardList cards={cards} patchId={patchId} handleClick={setSelectedCard} activeCards={activeCards} setActiveFilters={setActiveFilters} activeFilters={activeFilters} />)}
           
        </>
        );
}

function getActiveCards (filters, cards) {
    if(cards.length === 0) {
        return [];
    }

    let activeCards = [...cards];
    activeCards = activeCards.filter(card => {
        if(card.hasOwnProperty("associatedTribes")) {
            let isSelectedTribe = false;
            for(let tribe of card.associatedTribes) {
                if(filters.tribes.includes(tribe)) {
                    isSelectedTribe = true;
                    break;
                }
            }
            return isSelectedTribe;
        } else {
            // idk
            return true;
        }
    })

    activeCards = applyFilters(filters.cardFilterFcs, activeCards);
    filters.sortFc(activeCards);

    return activeCards;
}

function applyFilters(filterFcs, activeCards) {
    for(let filterFc of filterFcs) {
        let subObj = Object.values(filterFc)[0];
        activeCards = applyFilter(activeCards, subObj.fc, subObj.extraArgs);
    }
    return activeCards;
}

function defaultSortFc (cards) {
    const compareNames = (a,b) => {
        return a.name.localeCompare(b.name);
    }

    const types = ["HERO", "MINION", "BATTLEGROUND_SPELL", "BATTLEGROUND_TRINKET"];

    cards.sort((a, b) => {
        if(a.hasOwnProperty("techLevel") && b.hasOwnProperty("techLevel")) {
            if(a.techLevel > b.techLevel) {
                return 1;
            } else if (a.techLevel < b.techLevel) {
                return -1;
            } else if (a.type === b.type) {
                return compareNames(a,b);
            } else if (types.indexOf(a.type) > types.indexOf(b.type) ) {
                return 1;
            } else {
                return -1;
            }
        }
        if(a.type === b.type) {
            if(a.type === "MINION") { // this one is already handled by the techLevel condition
                if(a.techLevel > b.techLevel) {
                    return 1;
                } else if(a.techLevel < b.techLevel) {
                    return -1;
                } else return compareNames(a,b);
            } else if (a.type === "BATTLEGROUND_TRINKET") {
                if(a.spellSchool === b.spellSchool) {
                    return compareNames(a,b);
                } else if (a.spellSchool === "LESSER_TRINKET" && b.spellSchool === "GREATER_TRINKET") {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                return compareNames(a,b);
            }
        } else if (types.indexOf(a.type) > types.indexOf(b.type) ) {
            return 1;
        } else {
            return -1;
        }

    });
}

// export function BuddyPage() {
//     const [cards, setCards] = useState([]);
//     const [activeCards, setActiveCards] = useState([]);
//     const params = useParams();
//     const [selectedCard, setSelectedCard] = useState(null);

//     let patchId;
//     if(params.patchId !== undefined) {
//         patchId = params.patchId.toString();
//     }

//     useEffect(() => {
//         async function getCards(){
//             let response;
//             if(params.patchId !== undefined) {
//                 let patchId = params.patchId.toString();
//                 response = await fetch(`http://localhost:5000/${patchId}/buddy-pool/`);
//             }
//             if(!response.ok){
//                 const message = `an error has occurred: ${response.statusText}`;
//                 window.alert(message);
//                 return;
//             }
//             const cards = await response.json();
//             setActiveCards(cards);

//             setCards(c => cards.filter((card) => !card.hasOwnProperty("bannedFromFoaF")));


            
//         }
        
//         getCards();
//         return;
//     }, [params.patchId]);

//     useEffect(() => {
//         async function getSelectedId(){
//             if(params.id !== undefined) {
//                 setSelectedCard(params.id);
//             } else {
//                 setSelectedCard(null);
//             }
//         }
//         getSelectedId();

//     }, [params.id]);


//         return (
//         <>
//             { selectedCard &&
//             (<DisplayCardInfo card={selectedCard} />)}
//             <PatchInfo patchId={patchId}/>
//             {cards.length && 
//             (<CardList cards={cards} patchId={patchId} />)}
           
//         </>
//         );
// }

// export function PutriPage() {
//     const [cards, setCards] = useState([]);
//     // const [activeCards, setActiveCards] = useState([]);
//     // const [pool1, setPool1] = useState([]);
//     // const [pool2, setPool2] = useState([]);
//     const params = useParams();
//     const [selectedCard, setSelectedCard] = useState(null);

//     let patchId;
//     if(params.patchId !== undefined) {
//         patchId = params.patchId.toString();
//     }

//     useEffect(() => {
//         async function getCards(){
//             let response;
//             if(params.patchId !== undefined) {
//                 let patchId = params.patchId.toString();
//                 response = await fetch(`http://localhost:5000/${patchId}/putricide-pool/`);
//             }
//             if(!response.ok){
//                 const message = `an error has occurred: ${response.statusText}`;
//                 window.alert(message);
//                 return;
//             }
//             const cards = await response.json();
//             // setActiveCards(cards);
//             setCards(c => cards);
//             // applyFilter(setCards, withoutDuosFilter);
//             // applyFilter(setCards, onlyDuosFilter);
//             // applyFilter(setCards, faelinFilter);


            
//         }
        
//         getCards();
//         return;
//     }, [params.patchId]);

//     useEffect(() => {
//         async function getSelectedId(){
//             if(params.id !== undefined) {
//                 setSelectedCard(params.id);
//             } else {
//                 setSelectedCard(null);
//             }
//         }
//         getSelectedId();

//     }, [params.id]);


//         return (
//         <>
//             { selectedCard &&
//             (<DisplayCardInfo patchId={patchId} />)}
//             <PatchInfo patchId={patchId}/>
//             {cards.length && 
//             (<CardList cards={cards} patchId={patchId} rule={"putricide"} />)}
           
//         </>
//         );
// }

function CardInfoOverlay({ card, patchId, setSelectedCard, activeCards }){
    
    const closeOverlay = (event) => {
        if(event.target.classList.contains('outlet-background')){
            setSelectedCard(null);
        }
    };


    let indexOfCard = activeCards.findIndex((c) => c.dbfId == card.dbfId);
    let nextExists = indexOfCard < activeCards.length - 1;
    let previousExists = indexOfCard != 0;

    const nextCard = () => {
        setSelectedCard(activeCards[indexOfCard + 1]);
    };

    const previousCard = () => {
        setSelectedCard(activeCards[indexOfCard - 1])
    };

    const handleKeyPress = e => {
        if (e.key === "ArrowLeft" && previousExists) {
            previousCard();
        } else if (e.key === "ArrowRight" && nextExists) {
            nextCard();
        }
    }

    return (
    <div className="outlet-background" onClick={closeOverlay} tabIndex={0} onKeyDown={handleKeyPress}>
        <div className="outlet-foreground">
            <DisplayCardInfo card={card} patchId={patchId} />
            {previousExists && <button onClick={previousCard}>Previous</button>}
            {nextExists && <button onClick={nextCard}>Next</button>}
        </div>
    </div>
    );

}

function getTribes(cards) {
    let tribes = [];
    for(let card of cards) {
        let cardTribes = card.associatedTribes;
        if(cardTribes === undefined) {
            cardTribes = ["DEBUG"];
        }
        for(let cardTribe of cardTribes) {
            if(!tribes.includes(cardTribe)) {
                tribes.push(cardTribe);
            }
        }
        
    }
    return tribes;
}

export function CardList({ cards, patchId, rule, handleClick, activeCards, setActiveFilters, activeFilters }) {
    // const [cardPoolFilter, setCardPoolFilter] = useState();


    // handleFilterChange(cardsOfSelectedTribes);

    return( 
        <div>
            <TribesFilterTable cards={cards} setActiveFilters={setActiveFilters} activeFilters={activeFilters} />
            <FilterDropdown cardPool={cards} setActiveFilters={setActiveFilters} />
            <CategoryTable cards={activeCards} patchId={patchId} rule={rule} handleClick={handleClick}/>
        </div>
    );

}

function TribesFilterTable({ cards, setActiveFilters, activeFilters }) {
    let allTribes = getTribes(cards);
    // const [selectedTribes, setSelectedTribes] = useState(allTribes);

    let tribeTable = [];
    
    sortTribes(allTribes);
    
    for(let tribe of allTribes) {

        tribeTable.push(
            <label htmlFor={tribe} key={tribe}>
                <input 
                    type="checkbox" 
                    id={tribe} 
                    name={tribe} 
                    value={tribe} 
                    defaultChecked={activeFilters.tribes.includes(tribe)} 
                    onChange={
                        function (e) {
                            let newArr = [];
                            if(activeFilters.tribes.includes(e.target.value)) {
                                newArr = activeFilters.tribes.filter((name) => name !== e.target.value);
                            } else {
                                newArr = [...activeFilters.tribes, e.target.value];
                            }
                            setActiveFilters(af => {return {...af, tribes: newArr}});
                            // setSelectedTribes(newArr);
                            // setActiveCards(ac => keepActiveCardsOfTribes(ac, newArr));
                        }
                    } />
                {' '}
                {tribe}
            </label>
        );
        
    }
    return (
        <form>
            {tribeTable}
        </form>
    );
    
}

/**
 * Alphabetically sorts tribes, with the General tribe as the first one
 * @param {*} tribesArray 
 */
function sortTribes(tribesArray) {
    tribesArray.sort((a,b) => {
        if(b === "GENERAL"){
            return 1;
        } else if(a === "GENERAL"){
            return -1;
        } else {
            return a > b ? 1 : -1;
        }
    });
}

function CategoryTable({ cards, patchId, rule, handleClick }) {
    let heroes = cards.filter((card) =>
        card.type === "HERO" );
    let minionsOrTSpells = cards.filter((card) =>
        card.type === "MINION" || card.type === "BATTLEGROUND_SPELL");
    let trinkets = cards.filter((card) =>
        card.type === "BATTLEGROUND_TRINKET");
    // <Accordion defaultActiveKey={["heroes", "tier1", "tier2", "tier3", "tier4", "tier5", "tier6"]} alwaysOpen></Accordion>
    return (
        <div>
            <Accordion defaultActiveKey={["tier1"]} alwaysOpen>
                <Heroes cards={heroes} patchId={patchId} handleClick={handleClick}/>
                <MinionsOrTSpells cards={minionsOrTSpells} patchId={patchId} rule={rule} handleClick={handleClick}/>
                <Trinkets cards={trinkets} patchId={patchId} handleClick={handleClick} />
            </Accordion>
        </div>
    );
}


function Heroes({ cards, patchId, handleClick }) {
    // const alphSortedCards = [...cards].sort((a,b) => a.name > b.name ? 1 : -1 );

    // console.log(1);

    // useEffect(() => {
    //     setTemp((t) => [...t, ...alphSortedCards]);

    // },[cards, temp, setTemp]);
    
    // no heroes
    if(cards.length === 0){
        return null;
    }

    // alphabetically ordering heroes
    

    


    return (

            <Accordion.Item eventKey="heroes">
                <Accordion.Header as='h1'>Heroes</Accordion.Header>
                <Accordion.Body><CardRows cards={cards} patchId={patchId} handleClick={handleClick} /></Accordion.Body>
            </Accordion.Item>

    );
}

function MinionsOrTSpells({ cards, patchId, rule, handleClick }) {
    
    let tierTables = [];
    for(let i = 1; i <= 7; ++i ) {
        tierTables.push(<Tier tier={i} cards={cards} key={i} patchId={patchId} rule={rule} handleClick={handleClick} />);
    }
    
    return (
        <div>
            {tierTables}
        </div>
    );
}

function Trinkets({ cards, patchId, handleClick }) {
    // no trinket
    if(cards.length === 0){
        return;
    }

    let lesserTrinkets = cards.filter((card) => card.spellSchool === "LESSER_TRINKET");
    let greaterTrinkets = cards.filter((card) => card.spellSchool === "GREATER_TRINKET")


    // let lesserTrinkets = cards.filter((card) => card.spellSchool === "LESSER_TRINKET").sort((a,b) => 
    //     a.name > b.name ? 1 : -1);
    // let greaterTrinkets = cards.filter((card) => card.spellSchool === "GREATER_TRINKET").sort((a,b) => 
    //     a.name > b.name ? 1 : -1);
        
    return (
        <div>
            <Accordion.Item eventKey="lesser-trinket">
            <Accordion.Header>Lesser Trinkets</Accordion.Header>
            <Accordion.Body><CardRows cards={lesserTrinkets} patchId={patchId} handleClick={handleClick} /></Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="greater-trinket">
            <Accordion.Header>Greater Trinkets</Accordion.Header>
            <Accordion.Body><CardRows cards={greaterTrinkets} patchId={patchId} handleClick={handleClick}/></Accordion.Body>
            </Accordion.Item>
        </div>
    );
}


function Tier({ tier, cards, patchId, rule, handleClick }) {
    let cardsOfTier = cards.filter((card) =>
        card.techLevel === tier);
    // let minions = cardsOfTier.filter((card) => card.type === "MINION").sort((a,b) => 
    //     a.name > b.name ? 1 : -1);
    // let tSpells = cardsOfTier.filter((card) => card.type === "BATTLEGROUND_SPELL").sort((a,b) => 
    //     a.name > b.name ? 1 : -1);
    
    // let minionsAndSpellsOfTier = minions.concat(tSpells);

    if(cardsOfTier.length === 0){
        return;
    }
    
    const eventKey = `tier${tier}`;
    
    return(
        <div>
            <Accordion.Item eventKey={eventKey}>
            <Accordion.Header>Tier {tier}</Accordion.Header>
            <Accordion.Body><CardRows cards={cardsOfTier} patchId={patchId} rule={rule} handleClick={handleClick} /></Accordion.Body>
            </Accordion.Item>
        </div>
    );
}

export function CardRows({ cards, patchId, rule, handleClick }) {
    if(rule === "putricide"){
        return <PutricideCardRows cards={cards} />;
    }

    let cardRows = [];
    cards.forEach((card) => {
            let cardRow;
            cardRow = <HoverImage card={card} key={card.dbfId} handleClick={handleClick}/>
            cardRows.push(cardRow);
    })
    return (
        <div className="hover-container-wrapper">
            {cardRows}
        </div>
    );
}

function PutricideCardRows( { cards, patchId } ) {
    let cardRows1 = [];
    let cardRows2 = [];
    let cardsPool1 = cards.filter((card) => card.undeadCreationPool === 1).sort((a,b) => 
        a.name > b.name ? 1 : -1);
    let cardsPool2 = cards.filter((card) => card.undeadCreationPool === 2).sort((a,b) => 
        a.name > b.name ? 1 : -1);
    cardsPool1.forEach((card) => {
            let cardRow;
            cardRow = <Link to={`${card.dbfId}`} key={card.dbfId}>
                    <HoverImage card={card} key={card.dbfId}/>
                </Link>;
            cardRows1.push(cardRow);
    })
    cardsPool2.forEach((card) => {
        let cardRow;
        cardRow = <Link to={`${card.dbfId}`} key={card.dbfId}>
                <HoverImage card={card} key={card.dbfId}/>
            </Link>;
        cardRows2.push(cardRow);
})
    return (
        <div className="hover-container-wrapper">
            <div className="column">
                {cardRows1}
            </div>
            <div className="column">
            {cardRows2}
            </div>
        </div>
    );
}

function HoverImage({card, handleClick}) {
    // const [isHovered, setIsHovered] = useState(false);
    // const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    // let placeholderIcon = "/icons/placeholder.png";
    // let srcOfIcon = `/icons/${card.dbfId}.png`;

    let className;

    if(card.type === "HERO"){
        className = "small-hero-container";
    } else {
        className = "small-minion-container";
    }

    // const handleMouseMove = (e) => {
    //     const mouseX = e.clientX;
    //     const mouseY = e.clientY;
    //     const hoverWidth = 300;
    //     const hoverHeight = 400;
    //     const viewportWidth = window.innerWidth;
    //     const viewportHeight = window.innerHeight;

    //     let adjustedX = mouseX;
    //     let adjustedY = mouseY;
    //     if(mouseX + hoverWidth > viewportWidth)
    //         adjustedX = mouseX - hoverWidth;
    //     if(mouseY + hoverHeight > viewportHeight)
    //         adjustedY = mouseY - hoverHeight;

    //     setHoverPosition( {x: adjustedX, y: adjustedY });
    // }

    return (
    //   <div
    //     className="hover-container"
    //     onMouseEnter={() => setIsHovered(true)}
    //     onMouseLeave={() => setIsHovered(false)}
    //     onMouseMove={handleMouseMove}
    //   >
        // <div className="main-image-container">
        //   {/* <img src={srcOfIcon} onError={(e)=>{e.target.onError = null; e.target.src = placeholderIcon}} alt={card.name} className="card-icons" /> */}
            // {/* <CardImage card={card}  className="smaller-card-images"/> */}
            <div className={className}>
                <CardImage card={card} handleClick={handleClick}/>
            </div>
        // </div>
    //     {isHovered && (
    //       <div className="hover-image-container"
    //         style={{ top: hoverPosition.y, left: hoverPosition.x }}
    //       >
    //         <CardImage card={card} className="hover-image" />
    //       </div>
    //     )}
    //   </div>
    );
  }

// function getCardImageSrc(card) {
//     const cardImagePath = `/cards/en_US/${card.version}/${card.dbfId}.png`;
//     const placeholderImagePath = `/placeholders/en_US/${card.version}/${card.dbfId}.png`;

//     if(existsSync(cardImagePath)) {
//         return cardImagePath;
//     } else if (existsSync(placeholderImagePath)) {
//         return placeholderImagePath;
//     } else {
//         // TODO generate placeholder image
//         return placeholderImagePath;
//     }
// }


