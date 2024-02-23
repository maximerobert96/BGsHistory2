import { useEffect, useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import PatchInfo from "./PatchInfo";
import { CardInfo } from "./cardInfo";


export default function PatchChanges(){
    let [changes, setChanges] = useState([]);
    let params = useParams();
    let patchId = params.patchId;

    useEffect(() => {
        async function getChanges(){
            let response = await fetch(`http://localhost:5000/patch/${patchId}`);

            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const patch = await response.json();
            const patchChanges = patch.cardChanges;
            setChanges(patchChanges);
        }
        

        getChanges();
        return;
    }, [patchId]); 

    return (
    <>
        <PatchInfo patchId={patchId} />
        <CardChanges changes={changes} />
    </>);
}

function CardChanges({ changes }){
    if(changes.length === 0){
        return <p>Loading</p>;
    }
    let newCardsList = [];
    let removedCardsList = [];
    let changesList = [];

    // TODO: move the logic in the back-end / create a file for patch changes and types


    let newCards = changes.filter((e) => {
        let card = Object.values(e)[0];

        let olderVersionExists = parseInt(card.old.version) != parseInt(card.new.version);
        let itIsNowAnActiveMinion = (card.changes.hasOwnProperty("isBattlegroundsPoolMinion") && card.changes.isBattlegroundsPoolMinion.hasOwnProperty("new"));
        let itIsNowAnActiveHero = (card.changes.hasOwnProperty("battlegroundsHero") && card.changes.battlegroundsHero.hasOwnProperty("new"));

        return !olderVersionExists || itIsNowAnActiveMinion || itIsNowAnActiveHero;
    });

    let removedCards = changes.filter((e) => {
        let card = Object.values(e)[0];

        let itIsNoLongerAnActiveMinion = (card.changes.hasOwnProperty("isBattlegroundsPoolMinion") && card.changes.isBattlegroundsPoolMinion.hasOwnProperty("old"));
        let itIsNoLongerAnActiveHero = (card.changes.hasOwnProperty("battlegroundsHero") && card.changes.battlegroundsHero.hasOwnProperty("old"));

        return itIsNoLongerAnActiveMinion || itIsNoLongerAnActiveHero;
    });

    let cardChanges = changes.filter((e) => {
        let card = Object.values(e)[0];

        let olderVersionExists = parseInt(card.old.version) != parseInt(card.new.version);
        let allChangesAreNew = true;
        for(let field in card.changes){
            if(card.changes[field].hasOwnProperty("old")) {
                allChangesAreNew = false;
                break;
            }
        }

        let allChangesAreOld = true;
        for(let field in card.changes){
            if(card.changes[field].hasOwnProperty("new")) {
                allChangesAreOld = false;
                break;
            }
        }

        return olderVersionExists && !allChangesAreNew && !allChangesAreOld;
    });

    newCards.forEach(element => {
        let card = Object.values(element)[0];
        let key = Object.keys(element)[0];
        newCardsList.push(<CardInfo key={key} card={card.new} patch={card.new.version} />);
    });

    removedCards.forEach(element => {
        let card = Object.values(element)[0];
        let key = Object.keys(element)[0];
        removedCardsList.push(<CardInfo key={key} card={card.old} patch={card.old.version} />);
    });

    cardChanges.forEach(element => {
        let card = Object.values(element)[0];
        let key = Object.keys(element)[0];
        changesList.push(<CardChangeLong key={key} card={card} />);
    });

    return (
        <div>
            {newCardsList.length !==0 && (<h1>New and returning cards</h1>)}
            {newCardsList}
            {removedCardsList.length !==0 && (<h1>Removed cards</h1>)}
            {removedCardsList}
            {changesList.length !==0 && (<h1>Changes</h1>)}
            {changesList}
        </div>
    );

    // return (<>{cardList}</>);
}

function CardChangeLong({ card }) {
    return (
    <div>
        <CardInfo card={card.old} patch={card.old.version} />
        <CardInfo card={card.new} patch={card.new.version} />
    </div>);
}