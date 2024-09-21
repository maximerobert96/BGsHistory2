import { Fragment, useEffect, useState } from "react";
import './practice.css';

// import { Link, Outlet } from "react-router-dom";
// import { useParams } from "react-router";

export default function Practice() {
  let change = {
    changeType: "nerf",
    changes: {
      attack: {
        new: 3,
        old: 4
      },
      health: {
        new: 6,
        old: 8
      }
    },
    oldVersion: 35747,
    newVersion: "36393",
    dbfId: 59935
  };

  return <CardChange change={change} />
}

function CardChange({ change }) {
  const [newCard, setNewCard] = useState();
  const [previousCard, setPreviousCard] = useState();
  
  // let newVersion = "36393";
  // let oldVersion = "35747";
  // let dbfId = 59935;

  useEffect(() => {
    async function getNewCard() {
      if (!change.hasOwnProperty("newVersion")) {
        return;
      }
      let response;
      response = await fetch(`http://localhost:5000/${change.newVersion}/cards/${change.dbfId}`);

      if (!response.ok) {
        const message = `an error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const card = await response.json();
      setNewCard(card);
    }
    async function getPreviousCard() {
      if (!change.hasOwnProperty("oldVersion")) {
        return;
      }
      let response;
      response = await fetch(`http://localhost:5000/${change.oldVersion}/cards/${change.dbfId}`);

      if (!response.ok) {
        const message = `an error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const card = await response.json();
      setPreviousCard(card);
    }

    getNewCard();
    getPreviousCard();
    return;
  }, [change]);

    if(newCard && previousCard) {
        return (
          <BeforeAfter previousCard={previousCard} newCard={newCard} change={change} />
        );
    } else {
        return <p>Loading</p>;
    }

    
}

function BeforeAfter({ previousCard, newCard, change }) {

  return (
    <>
      <PictureOfCard card={previousCard} />
      <Arrow typeOfChange={change.changeType} />
      <PictureOfCard card={newCard} />
        {/* <CardInfo card={previousCard} patch={change.oldVersion}/>
        <CardInfo card={newCard} patch={change.newVersion}/> */}
    </>
    );
}

function PictureOfCard({card}){
  let srcOfCard = `/cards/en_US/${card.version}/${card.dbfId}.png`;
  let placeholderIcon = "/icons/placeholder.png";
  return <img src={srcOfCard} onError={(e)=>{e.target.onError = null; e.target.src = placeholderIcon}} alt={`${card.name}`} className="hover-image" />;
}

function Arrow({ typeOfChange }) {
  if(typeOfChange === "nerf") {
    return <img src="icons/red_arrow.png" alt="red arrow" className="hover-image" />;
  } else if(typeOfChange === "buff") {
    return <img src="icons/green_arrow.png" alt="green arrow" className="hover-image" />;
  } else {
    return <img src="icons/black_arrow.png" alt="black arrow" className="hover-image" />;
  }
}

