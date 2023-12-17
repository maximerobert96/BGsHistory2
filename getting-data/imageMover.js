// Take all the images from ./images/${locale}/190416/ and move them to a directory with the same name as the last patchId linked to these cards in the mapping json

const fs = require('fs-extra');
const path = require('path');
const { getJsonMappingFile } = require("../server/db/dbManager");

function absolutePath(relativePath){
    return path.resolve(__dirname, relativePath);
  }

function getLastPatchOfCardId(cardId, mapping) {
    // get the patches converted to numbers
    let patchesOfCard = mapping.cards[cardId].map(patch => Number(patch));
    // sort by decreasing, and pick the first one (which is the highest one)
    let lastPatch = patchesOfCard.sort((a,b) => b - a)[0];

    return lastPatch;
}

function moveImage(directory, locale, patch, fileName, oldPath) {
    directory = String(directory);
    locale = String(locale);
    patch = String(patch);
    fileName = String(fileName);
    oldPath = String(oldPath);

    let destinationDirectory = path.join(directory, locale, patch);
    let newPath = path.join(destinationDirectory, fileName);
    // console.log(`Old path: ${oldPath}. New path: ${newPath}`);
    fs.ensureDirSync(destinationDirectory);
    fs.renameSync(oldPath, newPath);
}

function moveImages() {
    // for each directory in ./images/
    let baseDirectory = absolutePath("./images/");
    const mapping = getJsonMappingFile();

    const locales = fs.readdirSync(baseDirectory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    locales.forEach(locale => {
        const subdirectoryPath = path.join(baseDirectory, locale, "190416");
        const filesInSubdirectory = fs.readdirSync(subdirectoryPath);

        filesInSubdirectory.forEach(file => {
            let cardId = file.substring(0, file.lastIndexOf("."));
            let patch = getLastPatchOfCardId(cardId, mapping);
            let oldPath = path.join(subdirectoryPath, file);
            if(patch !== 190416) {
                moveImage(baseDirectory, locale, patch, file, oldPath);
            }
        })

    });

}

// moveImages();

// const mapping = getJsonMappingFile();
// let lastPatch = getLastPatchOfCardId(92406, mapping); // tortollan
// let baseDirectory = absolutePath("./images/");
// oldPath = path.join(baseDirectory, "en_US", "190416", "92406.png");

// moveImage(baseDirectory, "en_US", lastPatch, "92406.png", oldPath);

// console.log(`Last patch: ${lastPatch}. Old path: ${oldPath}`);

