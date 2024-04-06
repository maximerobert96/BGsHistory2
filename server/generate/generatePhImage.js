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
    // ctx.fillStyle = 'black';
    // ctx.font = '24px Sans';
    // ctx.fillText(`${cardData.attack}`, 55, 520);

    // health
    drawNumber(ctx, cardData.health, 358, 520);
    // ctx.fillStyle = 'black';
    // ctx.font = '24px Sans';
    // ctx.fillText(`${cardData.health}`, 355, 520);


    // Draw card name
    ctx.fillStyle = 'black';
    ctx.font = '30px Sans';
    ctx.textAlign = 'center';
    ctx.fillText(cardData.name, canvas.width / 2, 320);

    // Draw card text
    ctx.fillStyle = 'black';
    ctx.font = '20px Sans';
    ctx.textAlign = 'center';
    

    const maxWidth = 300; // Maximum width for text on the card
    let words = cardData.text.split(' ');
    let line = '';
    let lines = [];

    words.forEach(word => {
        let testLine = line + word + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    });
    lines.push(line);

    // Draw lines
    const lineHeight = 25;
    const startY = 375;
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

    
    
    // Save the image to a file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('placeholder_card.png', buffer);
}

// Example card data
const cardData = {
    name: 'Mantid Queen',
    tier: 6,
    text: 'Venomous. Start of Combat: For each of your minion types gain +5/+5, Windfury, Reborn, or Taunt.',
    attack: 5,
    health: 5,
    races: ["murloc", "quilboar"]
};

generateHearthstoneCard(cardData);


