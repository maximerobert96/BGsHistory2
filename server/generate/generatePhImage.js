const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

// Load a custom font
// registerFont('path/to/your/font.ttf', { family: 'YourFontName' });

function drawNumber(ctx, number, x, y){
    ctx.strokeStyle = 'black'; // Set outline color
    ctx.lineWidth = 5; // Set outline thickness
    ctx.fillStyle = 'white'; // Set fill color
    ctx.font = '35px Sans';
    ctx.textAlign = 'center';

    // Draw black outline
    ctx.strokeText(number, x, y);

    // Draw white fill
    ctx.fillText(number, x, y);

}

function drawName(ctx, name, x, y, fontSize, fontName, maxWidth) {
    if(fontSize === undefined)
        fontSize = 30;
    if(fontName === undefined)
        fontName = "Sans";
    if(maxWidth === undefined)
        maxWidth = 300;
    // console.log(fontSize, fontName, maxWidth);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    drawTextWithScaling(ctx, name, x, y, maxWidth, fontSize, fontName);
}

function drawTextWithScaling(ctx, text, x, y, maxWidth, fontSize, fontName) {
    while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
        fontSize--;
        ctx.font = `${fontSize}px ${fontName}`;
    }
    ctx.fillText(text, x, y);
}

function drawRaces(ctx, races, x, y){
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.font = '20px Sans';

    if(races.length === 1){
        ctx.fillText(races[0], x, y);

    } else if (races.length === 2) {
        const lineHeight = 10;
        const centerY = y - lineHeight / 2;
        ctx.fillText(races[0], x, centerY - lineHeight);
        ctx.fillText(races[1], x, centerY + lineHeight);
    }
    

    
}

// Function to wrap text
function wrapText(ctx, text, maxWidth) {
    let lines = [];
    let currentLine = '';

    // Split text into lines by newline characters
    const textLines = text.split('\n');
    textLines.forEach((line, lineIndex) => {
        const words = line.split(/\s+/); // Split words within each line
        words.forEach((word, wordIndex) => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine.trim());
            const testWidth = metrics.width;
            if (testWidth > maxWidth && currentLine !== '') {
                // Push the current line to the lines array
                lines.push(currentLine.trim());
                currentLine = word + ' '; // Start a new line with the current word
            } else {
                currentLine = testLine; // Continue building the current line
            }

            // If it's the last word of a line or the last line
            if (wordIndex === words.length - 1 && (lineIndex !== textLines.length - 1 || line.trim() !== '')) {
                // Push the current line to the lines array
                lines.push(currentLine.trim());
                currentLine = ''; // Start a new line
            }
        });
    });

    return lines;
}

function drawCardText(ctx, text, x, y, maxWidth){
    if(maxWidth === undefined)
        maxWidth = 300;
    
    ctx.fillStyle = 'black';
    ctx.font = '20px Sans';
    ctx.textAlign = 'center';

    // const maxWidth = 300; // Maximum width for text on the card
    const lines = wrapText(ctx, text, maxWidth);

    const lineHeight = 25;

    // Calculate total height occupied by text
    const totalHeight = lines.length * lineHeight;

    // Calculate starting Y position for vertically centering
    const startY = y - totalHeight / 2;

    // Draw lines
    lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + index * lineHeight);
    });
}

async function generateBGsMinion(cardData, isGolden) {
    const canvas = createCanvas(400, 560);
    const ctx = canvas.getContext('2d');

    let templatePath = isGolden ? "./generate/placeholder golden minion.png" : "./generate/placeholder minion.png";

    // load template
    const template = await loadImage(templatePath);
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    // tier
    drawNumber(ctx, cardData.tier, 65, 75);

    // attack
    drawNumber(ctx, cardData.attack, 58, 520);


    // health
    drawNumber(ctx, cardData.health, 358, 520);



    // Draw card name
    ctx.font = "30px Sans";
    drawName(ctx, cardData.name, canvas.width / 2, 320);


    // Draw card text
    drawCardText(ctx, cardData.text, canvas.width / 2, 430);

    // Draw races
    if (cardData.races && cardData.races.length > 0) {
        drawRaces(ctx, cardData.races, canvas.width / 2, 520);
    }
    
    // Save the image to a file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('placeholder_card.png', buffer);
}


async function generateBGsHP(cardData) {
    const canvas = createCanvas(339, 506);
    const ctx = canvas.getContext('2d');

    const template = await loadImage("./generate/placeholder hero power.png");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    

    drawNumber(ctx, cardData.cost, canvas.width / 2, 60);

    ctx.font = '30px Sans';
    drawName(ctx, cardData.name, canvas.width / 2, 260, 30, "Sans", 250);

    ctx.font = '20px Sans';
    drawCardText(ctx, cardData.text, canvas.width / 2, 390, 230);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('placeholder_hp.png', buffer);
}

async function generateBGsSpell(cardData) {
    const canvas = createCanvas(400, 560);
    const ctx = canvas.getContext('2d');

    // load template
    const template = await loadImage("./generate/placeholder regular spell.png");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    // Draw card name
    ctx.font = "30px Sans";
    drawName(ctx, cardData.name, canvas.width / 2, 320);


    // Draw card text
    drawCardText(ctx, cardData.text, canvas.width / 2, 430);

    
    // Save the image to a file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('placeholder_spell.png', buffer);
}

async function generateBGsTavernSpell(cardData) {
    const canvas = createCanvas(400, 560);
    const ctx = canvas.getContext('2d');

    // load template
    const template = await loadImage("./generate/placeholder tavern spell.png");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    // tier
    drawNumber(ctx, cardData.tier, 65, 75);

    // cost
    drawNumber(ctx, cardData.cost, 58, 195);


    // Draw card name
    ctx.font = "30px Sans";
    drawName(ctx, cardData.name, canvas.width / 2, 320);


    // Draw card text
    drawCardText(ctx, cardData.text, canvas.width / 2, 430);
    
    // Save the image to a file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('placeholder_t_spell.png', buffer);
}

// Example card data
const minionData = {
    name: 'Felboar',
    tier: 5,
    text: "After you cast 2 spells, consume a minion in the Tavern to gain its stats.\n(2 left!)",
    attack: 2,
    health: 6,
    races: ["Demon", "Quilboar"]
};

const hpData = {
    name: 'Adventure!',
    cost: 0,
    hideCost: true,
    text: "Passive\nAt the start of the game, Discover a Hero Power.",
};

const spellData = {
    name: 'Slimy Shield',
    text: "Give a minion +1/+1 and Taunt."
};

const tavernSpellData = {
    name: 'Butchering',
    tier: 4,
    cost: 2,
    text: "Destroy a friendly Undead. Your Undead have extra Attack equal to its Tier this game."
};

// generateBGsMinion(minionData);
// generateBGsHP(hpData);
// generateBGsSpell(spellData);
// generateBGsTavernSpell(tavernSpellData);




