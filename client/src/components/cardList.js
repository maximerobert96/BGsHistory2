import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import PatchInfo from "./PatchInfo";
import CardImage from "./cardImage";
import FilterDropdown from "./filters";

export default function MainPage() {
    const [cards, setCards] = useState([]);
    const [activeCards, setActiveCards] = useState([]);
    const params = useParams();
    const [selectedCard, setSelectedCard] = useState(null);

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
            setActiveCards(cards);
            setCards(c => cards);
            // applyFilter(setCards, withoutDuosFilter);
            // applyFilter(setCards, onlyDuosFilter);
            // applyFilter(setCards, faelinFilter);


            
        }
        
        getCards();
        return;
    }, [params.patchId]);

    useEffect(() => {
        async function getSelectedId(){
            if(params.id !== undefined) {
                setSelectedCard(params.id);
            } else {
                setSelectedCard(null);
            }
        }
        getSelectedId();

    }, [params.id]);


        return (
        <>
            { selectedCard &&
            (<DisplayCardInfo patchId={patchId} />)}
            <PatchInfo patchId={patchId}/>
            {cards.length && 
            (<CardList cards={cards} patchId={patchId} />)}
           
        </>
        );
}

export function BuddyPage() {
    const [cards, setCards] = useState([]);
    const [activeCards, setActiveCards] = useState([]);
    const params = useParams();
    const [selectedCard, setSelectedCard] = useState(null);

    let patchId;
    if(params.patchId !== undefined) {
        patchId = params.patchId.toString();
    }

    useEffect(() => {
        async function getCards(){
            let response;
            if(params.patchId !== undefined) {
                let patchId = params.patchId.toString();
                response = await fetch(`http://localhost:5000/${patchId}/buddy-pool/`);
            }
            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const cards = await response.json();
            setActiveCards(cards);

            setCards(c => cards.filter((card) => !card.hasOwnProperty("bannedFromFoaF")));


            
        }
        
        getCards();
        return;
    }, [params.patchId]);

    useEffect(() => {
        async function getSelectedId(){
            if(params.id !== undefined) {
                setSelectedCard(params.id);
            } else {
                setSelectedCard(null);
            }
        }
        getSelectedId();

    }, [params.id]);


        return (
        <>
            { selectedCard &&
            (<DisplayCardInfo patchId={patchId} />)}
            <PatchInfo patchId={patchId}/>
            {cards.length && 
            (<CardList cards={cards} patchId={patchId} />)}
           
        </>
        );
}

export function PutriPage() {
    const [cards, setCards] = useState([]);
    // const [activeCards, setActiveCards] = useState([]);
    // const [pool1, setPool1] = useState([]);
    // const [pool2, setPool2] = useState([]);
    const params = useParams();
    const [selectedCard, setSelectedCard] = useState(null);

    let patchId;
    if(params.patchId !== undefined) {
        patchId = params.patchId.toString();
    }

    useEffect(() => {
        async function getCards(){
            let response;
            if(params.patchId !== undefined) {
                let patchId = params.patchId.toString();
                response = await fetch(`http://localhost:5000/${patchId}/putricide-pool/`);
            }
            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const cards = await response.json();
            // setActiveCards(cards);
            setCards(c => cards);
            // applyFilter(setCards, withoutDuosFilter);
            // applyFilter(setCards, onlyDuosFilter);
            // applyFilter(setCards, faelinFilter);


            
        }
        
        getCards();
        return;
    }, [params.patchId]);

    useEffect(() => {
        async function getSelectedId(){
            if(params.id !== undefined) {
                setSelectedCard(params.id);
            } else {
                setSelectedCard(null);
            }
        }
        getSelectedId();

    }, [params.id]);


        return (
        <>
            { selectedCard &&
            (<DisplayCardInfo patchId={patchId} />)}
            <PatchInfo patchId={patchId}/>
            {cards.length && 
            (<CardList cards={cards} patchId={patchId} rule={"putricide"} />)}
           
        </>
        );
}

function DisplayCardInfo({ patchId }){
    const navigate = useNavigate();
    
    const closeOutlet = (event) => {
        if(event.target.classList.contains('outlet-background')){
            // navigate(`/${patchId}/cards`);
            // navigate(-1);
            navigate(`./`);
        }
    };

    return (
    <div className="outlet-background" onClick={closeOutlet}>
        <div className="outlet-foreground">
            <Outlet />
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

export function CardList({ cards, patchId, rule }) {
    let availableTribes = getTribes(cards);
    const [tribes, setTribes] = useState(availableTribes);
    const [cardPoolFilter, setCardPoolFilter] = useState();
    const [activeCards, setActiveCards] = useState(cards);

    let cardsOfSelectedTribes = activeCards.filter(
        function (card) {
            if(card.hasOwnProperty("associatedTribes")) {
                let isSelectedTribe = false;
                for(let associatedTribe of card.associatedTribes) {
                    if(tribes.includes(associatedTribe)) {
                        isSelectedTribe = true;
                        break;
                    }
                }
                return isSelectedTribe;
            } else {
                return tribes.includes("DEBUG");
            }
        }
    );

    return( 
        <div>
            <TribesFilterTable tribes={availableTribes} selectedTribes={tribes} onSelectedTribesChange={setTribes} />
            <FilterDropdown cardPool={cards} setActiveCards={setActiveCards} />
            <CategoryTable cards={cardsOfSelectedTribes} patchId={patchId} rule={rule}/>
        </div>
    );

}

function TribesFilterTable({ tribes, selectedTribes, onSelectedTribesChange }) {
    let tribeTable = [];
    
    sortTribes(tribes);
    
    for(let tribe of tribes) {

        tribeTable.push(
            <label htmlFor={tribe} key={tribe}>
                <input 
                    type="checkbox" 
                    id={tribe} 
                    name={tribe} 
                    value={tribe} 
                    defaultChecked={selectedTribes.includes(tribe)} 
                    onChange={
                        function (e) {
                            let newArr = [];
                            if(selectedTribes.includes(e.target.value)) {
                                newArr = selectedTribes.filter((name) => name !== e.target.value);
                            } else {
                                newArr = [...selectedTribes, e.target.value];
                            }
                            onSelectedTribesChange(newArr);
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

function CategoryTable({ cards, patchId, rule }) {
    let heroes = cards.filter((card) =>
        card.type === "HERO" );
    let minionsOrTSpells = cards.filter((card) =>
        card.type === "MINION" || card.type === "BATTLEGROUND_SPELL");
    let trinkets = cards.filter((card) =>
        card.type === "BATTLEGROUND_TRINKET");
    return (
        <div>
            <Heroes cards={heroes} patchId={patchId} />
            <MinionsOrTSpells cards={minionsOrTSpells} patchId={patchId} rule={rule} />
            <Trinkets cards={trinkets} patchId={patchId} />
        </div>
    );
}

function Heroes({ cards, patchId }) {
    // no heroes
    if(cards.length === 0){
        return;
    }

    // alphabetically ordering heroes
    let alphSortedCards = cards.sort((a,b) => a.name > b.name ? 1 : -1 );

    return (
        <div>
            <h1>Heroes</h1>
            <CardRows cards={alphSortedCards} patchId={patchId} />
        </div>
    );
}

function MinionsOrTSpells({ cards, patchId, rule }) {
    
    let tierTables = [];
    for(let i = 1; i <= 7; ++i ) {
        tierTables.push(<Tier tier={i} cards={cards} key={i} patchId={patchId} rule={rule} />);
    }
    
    return (
        <div>
            {tierTables}
        </div>
    );
}

function Trinkets({ cards, patchId }) {
    // no trinket
    if(cards.length === 0){
        return;
    }

    let lesserTrinkets = cards.filter((card) => card.spellSchool === "LESSER_TRINKET").sort((a,b) => 
        a.name > b.name ? 1 : -1);
    let greaterTrinkets = cards.filter((card) => card.spellSchool === "GREATER_TRINKET").sort((a,b) => 
        a.name > b.name ? 1 : -1);
        
    return (
        <div>
            <h1>Lesser Trinkets</h1>
            <CardRows cards={lesserTrinkets} patchId={patchId} />
            <h1>Greater Trinkets</h1>
            <CardRows cards={greaterTrinkets} patchId={patchId} />
        </div>
    );
}


function Tier({ tier, cards, patchId, rule }) {
    let cardsOfTier = cards.filter((card) =>
        card.techLevel === tier);
    let minions = cardsOfTier.filter((card) => card.type === "MINION").sort((a,b) => 
        a.name > b.name ? 1 : -1);
    let tSpells = cardsOfTier.filter((card) => card.type === "BATTLEGROUND_SPELL").sort((a,b) => 
        a.name > b.name ? 1 : -1);
    
    let minionsAndSpellsOfTier = minions.concat(tSpells);

    if(cardsOfTier.length === 0){
        return;
    }
        
    return(
        <div>
            <h1>Tier {tier}</h1>
            <CardRows cards={minionsAndSpellsOfTier} patchId={patchId} rule={rule} />
        </div>
    );
}

export function CardRows({ cards, patchId, rule }) {
    if(rule === "putricide"){
        return <PutricideCardRows cards={cards} />;
    }

    let cardRows = [];
    cards.forEach((card) => {
            let cardRow;
            cardRow = <Link to={`${card.dbfId}`} key={card.dbfId}>
                    <HoverImage card={card} key={card.dbfId}/>
                </Link>;
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

function HoverImage({card}) {
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
                <CardImage card={card}/>
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


