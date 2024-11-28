import { useEffect, useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import PatchInfo from "./PatchInfo";
import { CardInfo } from "./cardInfo";


export default function PatchChanges(){
    let [changes, setChanges] = useState({});
    let params = useParams();
    let patchId = params.patchId;

    useEffect(() => {
        async function getChanges(){
            let response = await fetch(`http://localhost:5000/patch2/${patchId}`);

            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const patchChanges = await response.json();
            filterOutGoldenCards(patchChanges);
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

/** filter out golden cards as long as the normal version was also changed
*/
function filterOutGoldenCards( patchChanges ) {
    for(let id in patchChanges) {
        let currentChange = patchChanges[id][0];
        if(currentChange.hasOwnProperty("battlegroundsNormalDbfId") && patchChanges.hasOwnProperty(currentChange.battlegroundsNormalDbfId)) {
            delete patchChanges[id]
        }
    }
}

function CardChanges({ changes }){
    if(Object.keys(changes).length === 0){
        return <p>Loading</p>;
    }
    // let newCardsList = [];
    // let removedCardsList = [];
    // let returningCardsList = [];
    // let nerfsList = [];
    // let buffsList = [];
    // let changesList = [];

    let newCardsItems = [];
    let removedCardsItems = [];
    let returningCardsItems = [];
    let nerfsItems = [];
    let buffsItems = [];
    let changesItems = [];
    
    for(let dbfId in changes) {
        let changesOfCard = changes[dbfId];
        for(let changeOfCard of changesOfCard){
            changeOfCard.dbfId = dbfId;
            switch (changeOfCard.changeType) {
                case "new":
                    newCardsItems.push(<CardChange key={dbfId} change={changeOfCard} />);
                    break;
                case "returning":
                    returningCardsItems.push(<CardChange key={dbfId} change={changeOfCard} />);
                    // returningCardsList.push(changeOfCard);
                    break;
                case "removal":
                    removedCardsItems.push(<CardChange key={dbfId} change={changeOfCard} />);
                    // removedCardsList.push(changeOfCard);
                    break;
                case "change":
                    changesItems.push(<CardChange key={dbfId} change={changeOfCard} />);
                    // changesList.push(changeOfCard);
                    break;
                case "nerf":
                    nerfsItems.push(<CardChange key={dbfId} change={changeOfCard} />);
                    // nerfsList.push(changeOfCard);
                    break;
                case "buff":
                    buffsItems.push(<CardChange key={dbfId} change={changeOfCard} />);
                    // buffsList.push(changeOfCard);
                    break;
                default:
                    break;
            }
        }
        
    }


    // newCardsList.forEach(element => {
    //     let card = Object.values(element)[0];
    //     let key = Object.keys(element)[0];
    //     newCardsItems.push(<CardInfo key={key} card={card.new} patch={card.new.version} />);
    // });

    // removedCardsList.forEach(element => {
    //     let card = Object.values(element)[0];
    //     let key = Object.keys(element)[0];
    //     removedCardsItems.push(<CardInfo key={key} card={card.old} patch={card.old.version} />);
    // });

    // changesList.forEach(element => {
    //     let card = Object.values(element)[0];
    //     let key = Object.keys(element)[0];
    //     changesItems.push(<CardChangeLong key={key} card={card} />);
    // });

    return (
        <div>
            {newCardsItems.length !==0 && (<h1>New cards</h1>)}
            {newCardsItems}
            {returningCardsItems.length !==0 && (<h1>Returning cards</h1>)}
            {returningCardsItems}
            {removedCardsItems.length !==0 && (<h1>Removed cards</h1>)}
            {removedCardsItems}
            {nerfsItems.length !==0 && (<h1>Nerfs</h1>)}
            {nerfsItems}
            {buffsItems.length !==0 && (<h1>Buffs</h1>)}
            {buffsItems}
            {changesItems.length !==0 && (<h1>Changes</h1>)}
            {changesItems}
        </div>
    );

    // return (<>{cardList}</>);
}

// function CardChangeLong({ card }) {
//     return (
//     <div>
//         <CardInfo card={card.old} patch={card.old.version} />
//         <CardInfo card={card.new} patch={card.new.version} />
//     </div>);
// }

function CardChange({ change }){
    const [newCard, setNewCard] = useState();
    const [previousCard, setPreviousCard] = useState();

    useEffect(() => {
        async function getNewCard(){
            if(!change.hasOwnProperty("newVersion")){
                return;
            }
            let response;
            response = await fetch(`http://localhost:5000/${change.newVersion}/cards/${change.dbfId}`);

            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const card = await response.json();
            setNewCard(card);
        }
        async function getPreviousCard(){
            if(!change.hasOwnProperty("oldVersion")){
                return;
            }
            let response;
            response = await fetch(`http://localhost:5000/${change.oldVersion}/cards/${change.dbfId}`);

            if(!response.ok){
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


    if(change.changeType === "new" || change.changeType === "returning"){
        return <CardInfo card={newCard} patch={change.newVersion} />;
    } else if (change.changeType === "removal") {
        return <CardInfo card={previousCard} patch={change.oldVersion} />;
    } else if(change.changeType === "buff" || change.changeType === "nerf" || change.changeType === "change"){
        return (
            <>
                <CardInfo card={previousCard} patch={change.oldVersion} />
                <CardInfo card={newCard} patch={change.newVersion} />
            </>
        );
    } else {
        return <p>gadhgk</p>;
    }
}
