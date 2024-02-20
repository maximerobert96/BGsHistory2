import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";

export default function PatchChanges(){
    let [patchInfo, setPatchInfo] = useState({});
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
            const info = patch.patchInfo;
            setChanges(patchChanges);
            setPatchInfo(info);
        }
        

        getChanges();
        return;
    }, [patchId]); 

    return (<PatchInfo patchInfo={patchInfo} />);
}

function PatchInfo({ patchInfo }) {
    if(Object.keys(patchInfo).length === 0){
        return (<p>Loading</p>);
    }
    return (
    <>
        <h1>Patch {patchInfo.patchNumber}</h1>
        <h2>Released on {patchInfo.releaseDate}</h2>
        <h3><a href={patchInfo.patchNotes}>Patch Notes</a></h3>
    </>);
    // let htmlToReturn = [];
    // if(patchInfo.hasOwnProperty("patchNumber")) {
    //     htmlToReturn.push(<h1>Patch {patchInfo.patchNumber}</h1>);
    // }
    // if(patchInfo.hasOwnProperty("releaseDate")) {
        
    // }
    // if(patchInfo.hasOwnProperty("patchNotes")) {

    // }
    
    
}