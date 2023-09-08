const CARDS = [
    {name: "Weaver", techLevel: 1, type: "MINION", tribe: "GENERAL"},
    {name: "Honcho", techLevel: 2, type: "MINION", tribe: "MURLOC"},
    {name: "Cobalt", techLevel: 3, type: "MINION", tribe: "MECHANICAL"},
    {name: "Primalfin", techLevel: 4, type: "MINION", tribe: "MURLOC"},
    {name: "Reef", techLevel: 4, type: "MINION", tribe: "GENERAL"},
    {name: "Mechano Egg", techLevel: 4, type: "MINION", tribe: "MECHANICAL"},
    {name: "Brann", techLevel: 5, type: "MINION"},
    {name: "Zapp", techLevel: 6, type: "MINION", tribe: "GENERAL"},
    {name: "Mutanus", type: "HERO", tribe: "GENERAL"},
    {name: "Flurgl", type: "HERO", tribe: "MURLOC"}
]

function getTribes(cards) {
    let tribes = [];
    for(let card of cards) {
        let cardTribe = card.tribe;
        if(cardTribe === undefined) {
            cardTribe = "DEBUG";
        }
        if(!tribes.includes(cardTribe)) {
            tribes.push(cardTribe);
        }
    }
    return tribes;
}

function CardList({ cards }) {
    let tribes = getTribes(cards);
    return( 
        <div>
            <FilterTable tribes={tribes} />
            <CategoryTable cards={cards} />
        </div>
    );

}

function FilterTable({ tribes }) {
    let tribeTable = [];
    for(let tribe of tribes) {
        tribeTable.push(
            <button>{tribe}</button>
        );
    }
    return tribeTable;
    
}

function CategoryTable({ cards }) {
    return (
        <div>
            <Heroes cards={cards} />
            <Minions cards={cards} />
        </div>
    );
}

function Heroes({ cards }) {
    let heroes = cards.filter((card) =>
        card.type === "HERO");
    return (
        <div>
            <h1>Heroes</h1>
            <CardRows cards={heroes} />
        </div>
    );
}

function Minions({ cards }) {
    let minions = cards.filter((card) =>
        card.type === "MINION");
    let tierTables = [];
    for(let i = 1; i <= 6; ++i ) {
        tierTables.push(<Tier tier={i} cards={minions} />);
    }
    
    return (
        <div>
            <h1>Minions</h1>
            {tierTables}
        </div>
    );
}


function Tier({ tier, cards }) {
    let minionsOfTier = cards.filter((card) =>
        card.techLevel === tier);
    return(
        <div>
            <h2>Tier {tier}</h2>
            <CardRows cards={minionsOfTier} />
        </div>
    );
}

function CardRows({ cards }) {
    let cardRows = [];
    cards.forEach((card) => {
        cardRows.push(<li>{card.name}</li>)
    })
    return (
        <ul>
            {cardRows}
        </ul>
    );
}


export default function Mockup() {
    return <CardList cards={CARDS} />;
  }
  
