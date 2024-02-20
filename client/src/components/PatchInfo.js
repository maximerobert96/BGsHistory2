import { useEffect, useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useParams } from "react-router";

export default function PatchInfo({ patchId }){
    let [patchInfo, setPatchInfo] = useState({});

    useEffect(() => {
        async function getInfo(){
            let response = await fetch(`http://localhost:5000/patch/${patchId}`);

            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const patch = await response.json();
            const info = patch.patchInfo;
            setPatchInfo(info);
        }
        

        getInfo();
        return;
    }, [patchId]); 

    if(Object.keys(patchInfo).length === 0){
        return (<p>Loading</p>);
    }
    return (
    <>
        <h1>Patch {patchInfo.patchNumber}</h1>
        <h2>Released on {patchInfo.releaseDate}</h2>
        {patchInfo.patchNotes && (<h3><a href={patchInfo.patchNotes}>Patch Notes</a></h3>)}
        
    </>
    );
}