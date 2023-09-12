// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useParams } from "react-router";

// export default function MainPage() {
//     const [cards, setCards] = useState([]);
//     const params = useParams();

//     let patchId;
//     if(params.patchId !== undefined) {
//         patchId = params.patchId.toString();
//     }

//     useEffect(() => {
//         async function getCards(){
//             let response;
//             if(params.patchId !== undefined) {
//                 let patchId = params.patchId.toString();
//                 response = await fetch(`http://localhost:5000/${patchId}/cards/`);
//             } else {
//                 response = await fetch(`http://localhost:5000/cards/`);
//             }
//             if(!response.ok){
//                 const message = `an error has occurred: ${response.statusText}`;
//                 window.alert(message);
//                 return;
//             }
//             const cards = await response.json();
//             setCards(cards);
//         }
        
//         getCards();
//         return;
//     }, [cards]);

//     if(cards.length) {
//         return <CardList cards={cards} patchId={patchId} />
//     } else {
//         return <p>Loading</p>;
//     }

//     ;
// }