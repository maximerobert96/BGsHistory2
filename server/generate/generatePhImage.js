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

function drawName(ctx, name, x, y) {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    let fontSize = 30;
    let maxWidth = 300; // Maximum width for card name
    let fontName = "Sans";
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
    const words = text.split(' ');
    let line = '';
    let lines = [];

    words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    });

    lines.push(line);
    console.log("lines:", lines)
    return lines;
}

function drawCardText(ctx, text, x, y){
    ctx.fillStyle = 'black';
    ctx.font = '20px Sans';
    ctx.textAlign = 'center';

    const maxWidth = 300; // Maximum width for text on the card
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

async function generateHearthstoneCard(cardData) {
    const canvas = createCanvas(400, 560);
    const ctx = canvas.getContext('2d');

    // load template
    const template = await loadImage("./generate/placeholder minion.png");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    // tier
    drawNumber(ctx, cardData.tier, 65, 75);

    // attack
    drawNumber(ctx, cardData.attack, 58, 520);


    // health
    drawNumber(ctx, cardData.health, 358, 520);



    // Draw card name
    drawName(ctx, cardData.name, canvas.width / 2, 320);


    // Draw card text
    drawCardText(ctx, cardData.text, canvas.width / 2, 430);

    // ctx.fillStyle = 'black';
    // ctx.font = '20px Sans';
    // ctx.textAlign = 'center';

    // const maxWidth = 300; // Maximum width for text on the card
    // let words = cardData.text.split(' ');
    // let line = '';
    // let lines = [];

    // words.forEach(word => {
    //     let testLine = line + word + ' ';
    //     let metrics = ctx.measureText(testLine);
    //     let testWidth = metrics.width;
    //     if (testWidth > maxWidth) {
    //         lines.push(line);
    //         line = word + ' ';
    //     } else {
    //         line = testLine;
    //     }
    // });
    // lines.push(line);

    // // Draw lines
    // const lineHeight = 25;
    // const startY = 375;
    // lines.forEach((line, index) => {
    //     ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    // });

    // Draw races
    if (cardData.races && cardData.races.length > 0) {
        drawRaces(ctx, cardData.races, canvas.width / 2, 520);
    }
    
    // Save the image to a file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('placeholder_card.png', buffer);
}

// Example card data
const cardData = {
    name: 'Cogwork Copter',
    tier: 2,
    text: "Divine Shield",
    attack: 1,
    health: 1,
    races: ["Mech"]
};

generateHearthstoneCard(cardData);


