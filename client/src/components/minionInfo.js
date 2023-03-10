import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function MinionInfo() {
    const [minion, setMinion] = useState({
        name: "",
        tavern_tier: "",
        attack: "",
        health: "",
        text: "",
        
    });
    const params = useParams();

    useEffect(() => {
        async function getMinion(){
            const id = params.id.toString();
            const response = await fetch(`http://localhost:5000/card/${id}`);
            if(!response.ok){
                const message = `an error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const minion = await response.json();
            setMinion({name: minion.name, tavern_tier: minion.tavern_tier,
                 attack: minion.attack, health: minion.health, text: minion.text});
        }
        
        getMinion();
        return;
    });

    return(
        <div>
            <table>
                <thead>
                <tr>
                        <th>Name</th>
                        <th>Tier</th>
                        <th>Attack</th>
                        <th>Health</th>
                        <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{minion.name}</td>
                        <td>{minion.tavern_tier}</td>
                        <td>{minion.attack}</td>
                        <td>{minion.health}</td>
                        <td>{minion.text}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}