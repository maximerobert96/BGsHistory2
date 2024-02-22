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
    let cardList = [];
    changes.forEach(element => {
        let change = Object.values(element)[0];
        let key = Object.keys(element)[0];
        cardList.push(<CardChangeLong key={key} change={change} />);
    });
    return <>{cardList}</>
}

function CardChangeLong({ change }) {
    return (
    <div>
        <CardInfo card={change.old} patch={change.old.version} />
        <CardInfo card={change.new} patch={change.new.version} />
    </div>);
}