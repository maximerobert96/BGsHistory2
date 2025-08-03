const { JSDOM } = require("jsdom");
const { getJsonFromFile, saveJsonToFile } = require('./blizzApiHandler');
const axios = require('axios').default;
const { getJsonMappingFile } = require('../server/db/dbManager');
const { comparePatches } = require("./cardsComparer");
// const { get } = require("axios");

 
function getLastPatch(patches){
    let buildNumbersS = Object.keys(patches);
    // convert strings to numbers
    let buildNumbers = buildNumbersS.map(Number);
    return Math.max(...buildNumbers);
}

function saveNewPatches(oldPatches, newPatches){
    let updatedPatches = {...oldPatches, ...newPatches};
    saveJsonToFile("../server/patches.json", updatedPatches);
}

function keepBgCards(json){
    let mappingJson = getJsonMappingFile();
    let cardsInMapping = mappingJson.cards;
    return json.filter(card => isValidBgCard(card, cardsInMapping));
}

function isValidBgCard(card, cardsInMapping){
    return cardsInMapping.hasOwnProperty(card.dbfId) || ((card.techLevel || card.set === "BATTLEGROUNDS") && card.type !== "ENCHANTMENT");
}

async function getPatch(buildNumber) {
    try {
        let json = await getJsonFromUrl(`https://api.hearthstonejson.com/v1/${buildNumber}/enUS/cards.json`);
        let bgCards = keepBgCards(json);
        return bgCards
    } catch (error) {
        console.error(`Error fetching patch ${buildNumber}: ${error.message}`);
        throw error;
    }
}

function getJsonFromUrl(url){
    return axios.get(url, {responseType: "json"}).then((response) => {
        let json = response.data;
        return json;
    });
}


async function fetchAllPatchTitles() {
    const endpoint = "https://hearthstone.wiki.gg/api.php";
    let patches = [];
    let cmcontinue = null;

    do {
        const params = {
            action: "query",
            list: "categorymembers",
            cmtitle: "Category:Patches",
            cmlimit: "max",
            format: "json",
            ...(cmcontinue && { cmcontinue })
        };

        const response = await axios.get(endpoint, { params });
        const data = response.data;

        patches.push(...data.query.categorymembers);
        cmcontinue = data.continue?.cmcontinue;

    } while (cmcontinue);

    return patches;
}

function extractBuildNumber(title) {
    const match = title.match(/Patch \d+\.\d+\.\d+\.(\d+)/);
    return match ? match[1] : null;
}

function isNewerPatch(title, lastPatch) {
    const build = extractBuildNumber(title);
    if (!build) return false;

    return parseInt(build) > parseInt(lastPatch);
}

async function fetchPatchPageHtml(title) {
    const url = `https://hearthstone.wiki.gg/api.php`;
    const response = await axios.get(url, {
        params: {
            action: 'parse',
            page: title,
            format: 'json'
        }
    });

    return response.data.parse?.text['*']; // Raw HTML of the page
}

async function getNewPatches(lastBuild) {
    const allPatches = await fetchAllPatchTitles();

    const filtered = allPatches.filter(patch =>
        isNewerPatch(patch.title, lastBuild)
    );

    const newPatches = {};

    for (const patch of filtered) {
        const patchData = await getPatchFromTitle(patch.title);
        if (patchData && patchData.build) {
            newPatches[patchData.build] = patchData;
        }
    }

    return newPatches;
}

async function getPatchFromTitle(title) {
    const url = `https://hearthstone.wiki.gg/api.php`;
    
    // Fetch parsed HTML content of the wiki page
    const response = await axios.get(url, {
        params: {
            action: 'parse',
            page: title,
            format: 'json'
        }
    });

    const html = response.data.parse?.text['*'];
    if (!html) return null;

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    let releaseDate = null;
    let patchNumber = null;
    let build = null;
    let patchNotesUrl = null;

    // Extract infobox data
    const dataElements = doc.querySelectorAll(".pi-item.pi-data.pi-item-spacing.pi-border-color");

    dataElements.forEach(element => {
        const attr = element.getAttribute("data-source");
        const value = element.querySelector(".pi-data-value")?.textContent?.trim();

        switch (attr) {
            case "releaseDate":
                releaseDate = value;
                break;
            case "version":
                patchNumber = value;
                break;
            case "build":
                build = value;
                break;
        }
    });

    // Extract Patch Notes link
    const externalLinks = doc.querySelectorAll(".external.text");
    for (let linkElem of externalLinks) {
        if (linkElem.textContent === "Patch Notes") {
            patchNotesUrl = linkElem.getAttribute("href");
            break;
        }
    }

    // Fallback to the wiki page if no external link found
    const wikiPageUrl = `https://hearthstone.wiki.gg/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
    patchNotesUrl = patchNotesUrl || wikiPageUrl;

    if (!build) return null;

    return {
        patchNotes: patchNotesUrl,
        build,
        releaseDate,
        patchNumber
    };
}

async function downloadManyNewestPatches() {
    let patchesObj = getJsonFromFile("../server/patches.json");
    let lastPatch = getLastPatch(patchesObj);
    try {
        let newPatchesObj = await getNewPatches(lastPatch);
        let previousPatch = await getPatch(lastPatch);
        let newPatches = Object.keys(newPatchesObj)
            .sort((a,b) => a - b);
        
        for(let patch of newPatches) {
            console.log(`Currently on patch: ${patch}`);

            // TODO: try catch around that, if I can't get the patch, skip the patch, don't even put it in the patch file. Continue to next iteration
            try {
                let currentPatch = await getPatch(patch);
                comparePatches(previousPatch, currentPatch, patch);
                previousPatch = currentPatch;
            } catch (error) {
                console.error(`Error with patch ${patch}, skipping to the next one. ${error}`);
            }
            
        }
        // TODO save the patch file after I'm done with a patch, instead of waiting that I'm done with everything (so inside the loop instead of outside)
        saveNewPatches(patchesObj, newPatchesObj);
    } catch (error) {
        console.error('Error: ', error.message);
    }

}

downloadManyNewestPatches();

