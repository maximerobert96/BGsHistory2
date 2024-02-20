import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import PatchInfo from "./PatchInfo";

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

    return (<PatchInfo patchId={patchId} />);
}