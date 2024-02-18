import { Fragment, useEffect, useState } from "react";
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
            <DisplayCards2 cards={cards}/>
            {/* <HoverImage></HoverImage> */}
        </>
        );
    } else {
        return <p>Loading</p>;
    }

    ;
}

// function DisplayCards({cards}){
//     let listOfImages = [];
//     let placeholderIcon = "/icons/placeholder.png";
//     cards.forEach(card => {
//         let srcOfIcon = `/icons/${card.dbfId}.png`;
//         listOfImages.push(<img src={srcOfIcon} onError={(e)=>{e.target.onError = null; e.target.src = placeholderIcon}} className="card-icons" alt={card.name} />)
//     });
//     return <>{listOfImages}</>;
// }

function DisplayCards2({cards}){
    let listOfImages = [];
    
    cards.forEach(card => {
        
        // listOfImages.push(<img src={srcOfIcon} onError={(e)=>{e.target.onError = null; e.target.src = placeholderIcon}} className="card-icons" alt={card.name} />)
        listOfImages.push(<HoverImage card={card} key={card.dbfId}/>)
    });
    return <div className="hover-container-wrapper">{listOfImages}</div>;
}

function HoverImage({card}) {
    const [isHovered, setIsHovered] = useState(false);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    let placeholderIcon = "/icons/placeholder.png";
    let srcOfIcon = `/icons/${card.dbfId}.png`;
    let srcOfCard = `/cards/en_US/35747/${card.dbfId}.png`;

    const handleMouseMove = (e) => {
        setHoverPosition( {x: e.clientX, y: e.clientY });
    }

    return (
      <div
        className="hover-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="main-image-container">
          <img src={srcOfIcon} onError={(e)=>{e.target.onError = null; e.target.src = placeholderIcon}} alt={card.name} className="card-icons" />
        </div>
        {isHovered && (
          <div className="hover-image-container"
            style={{ top: hoverPosition.y, left: hoverPosition.x }}
          >
            <img src={srcOfCard} onError={(e)=>{e.target.onError = null; e.target.src = placeholderIcon}} alt="Hover" className="hover-image" />
          </div>
        )}
      </div>
    );
  }