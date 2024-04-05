const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

// Load a custom font
// registerFont('path/to/your/font.ttf', { family: 'YourFontName' });

async function generateHearthstoneCard(cardData) {
    const canvas = createCanvas(400, 560);
    const ctx = canvas.getContext('2d');

    // load template
    const template = await loadImage("./generate/placeholder minion.png");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    // Draw tavern tier
    ctx.fillStyle = 'black';
    ctx.font = '24px Sans';
    ctx.fillText(`${cardData.tier}`, 60, 75);

    // Draw card name
    ctx.fillStyle = 'black';
    ctx.font = '30px Sans';
    ctx.textAlign = 'center';
    ctx.fillText(cardData.name, canvas.width / 2, 320);

    // Draw card text
    ctx.fillStyle = 'black';
    ctx.font = '20px Sans';
    ctx.textAlign = 'center';
    // const lines = cardData.text.match(/.{1,28}/g); // Split text into lines
    // lines.forEach((line, index) => {
    //     ctx.fillText(line, canvas.width / 2, 370 + index * 25);
    // });

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

    // Draw attack
    ctx.fillStyle = 'black';
    ctx.font = '24px Sans';
    ctx.fillText(`${cardData.attack}`, 55, 520);

    // Draw health
    ctx.fillStyle = 'black';
    ctx.font = '24px Sans';
    ctx.fillText(`${cardData.health}`, 355, 520);
    
    // Save the image to a file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('placeholder_card.png', buffer);
}

// Example card data
const cardData = {
    name: 'Placeholder Card',
    tier: 5,
    text: 'This is a placeholder card for Hearthstone. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    attack: 1,
    health: 6,
    races: ["murloc", "quilboar"]
};

generateHearthstoneCard(cardData);


