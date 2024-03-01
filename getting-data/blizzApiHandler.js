require('dotenv').config();
const axios = require('axios').default;
const fs = require("fs");
const fsExtra = require("fs-extra");
const { getCardById, getJsonMappingFile } = require('../server/db/dbManager');
const path = require('path');
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 / 50,
  reservoir: 18000,
  reservoirRefreshAmount: 18000,
  reservoirRefreshInterval: 60*60*1000
});

/**
 * Saves the access token and the expiry date to a file.
 * @returns the access token string
 */
function getNewAccessToken() {

  const clientId = process.env.BNET_ID;
  const clientSecret = process.env.BNET_SECRET;
  const tokenEndpoint = 'https://oauth.battle.net/token'; // Update the URL based on your region

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const data = {
    grant_type: 'client_credentials',
  };

  return axios({
    method: 'post',
    url: tokenEndpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authString}`,
    },
    data: new URLSearchParams(data),
  })
    .then(response => {
      let tokenObj = {};
      tokenObj.expiry = Date.now() + response.data.expires_in * 1000;
      tokenObj.accessToken = response.data.access_token;
      fs.writeFileSync(absolutePath('./access-token.json'), JSON.stringify(tokenObj, null , 2));
      return tokenObj.accessToken;
    })
    .catch(error => {
      if (error.response) {
          console.error('Error Response:', error.response.data);
          console.error("Error message", response.header);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up the request:', error.message);
        }
    });

}

/**
 * Gets the current access token, or a new one if the one in the file is expired
 * @returns an access token string
 */
async function getAccessToken() {
  let tokenObj;
  try {
    tokenObj = JSON.parse(fs.readFileSync(absolutePath('./access-token.json')));
  } catch (error) {
  }
  let token;
  if(tokenObj === undefined || Date.now() > tokenObj.expiry) {
    token = await getNewAccessToken();
  } else {
    token = tokenObj.accessToken;
  }
  return token;
}

function getApiResponse(apiUrl, accessToken){
  return axios.get(apiUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      // console.error('Error:', error.message);
      throw new Error(`error: ${error.message}`);
    });
}

function getCardApiUrl(cardId, locale){
  let website = "https://us.api.blizzard.com";
  let route = "/hearthstone/cards/";
  let gameMode = "gameMode=battlegrounds";
  let localeOption = locale === undefined ? "" : `&locale=${locale}`;
  return `${website}${route}${cardId}?${gameMode}${localeOption}`;
}

async function downloadImage(url, filename) {
  const response = await axios.get(url, {responseType: "arraybuffer"});
  return new Promise((resolve, reject) => {
    fs.writeFile(absolutePath(filename), response.data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  })
}
  

  

function absolutePath(relativePath){
  return path.resolve(__dirname, relativePath);
}

function getListAllCardsDb(){
  let mappingJson = getJsonMappingFile();
  return Object.keys(mappingJson.cards);
}

function downloadImagesFromBlizzAPI(images, dbfId, patchId){
  if(Object.keys(images).length === 0){
    throw new Error(`error: no images for ${dbfId}`);
  }
  for(let locale in images){
    let imageUrl = images[locale];
    fsExtra.ensureDir(absolutePath(`../client/public/cards/${locale}/${patchId}`));
    downloadImage(imageUrl, `../client/public/cards/${locale}/${patchId}/${dbfId}.png`);
  }
}

function saveJsonToFile(filename, jsonObj) {
  fs.writeFileSync(absolutePath(filename), JSON.stringify(jsonObj, null , 2));
}

function getJsonFromFile(file){
  return JSON.parse(fs.readFileSync(absolutePath(file)));
}

async function downloadImagesFromBlizzAPIForCardId(dbfId, patchId, isGolden, hsJsonId) {
  let token = await getAccessToken();

  return limiter.schedule(async () => {
    let apiUrl = getCardApiUrl(dbfId);
    
    try {
      let response = await getApiResponse(apiUrl, token);
      let images;
      if(isGolden){
        images = response.battlegrounds.imageGold;
      } else {
        images = response.battlegrounds.image;
      }
      downloadImagesFromBlizzAPI(images, dbfId, patchId);
    } catch (error) {
      console.error(`Card ${dbfId} failed to be downloaded. ${error.message} Trying with hs-json.`);
      try {
        downloadImagesOfOneCardFromHSJson(dbfId, hsJsonId, patchId)
      } catch (error) {
        console.error(`Still couldn't download card ${dbfId}.`)
      }
      
    }
  });
    
    
    

}

async function downloadAllImagesFromBlizzAPI() {
  let patchId = 190416; // most recent patch
  let dbfIdList = getListAllCardsDb();

  let token = await getAccessToken();
  let fails = {}; // keys are dbfIds, values are ids

  for(let dbfId of dbfIdList){
    let currentCard = getCardById(dbfId);
    let isGolden = currentCard.hasOwnProperty("battlegroundsNormalDbfId");
    let apiUrl = getCardApiUrl(dbfId);
    
    try {
      let response = await getApiResponse(apiUrl, token);
      let images;
      if(isGolden){
        images = response.battlegrounds.imageGold;
      } else {
        images = response.battlegrounds.image;
      }
      downloadImagesFromBlizzAPI(images, dbfId, patchId);
    } catch (error) {
      console.error(error.message);
      fails[dbfId] = currentCard.id;
    }
    
    saveJsonToFile("./couldntbefound.json", fails);
    
  }
}

function getLocalesStrings(){
  let localesStrings = {
    de_DE: "deDE",
    en_US: "enUS",
    es_ES: "esES",
    es_MX: "esMX",
    fr_FR: "frFR",
    it_IT: "itIT",
    ja_JP: "jaJP",
    ko_KR: "koKR",
    pl_PL: "plPL",
    pt_BR: "ptBR",
    ru_RU: "ruRU",
    th_TH: "thTH",
    zh_CN: "zhCN",
    zh_TW: "zhTW"
  }
  return localesStrings;
}

function makeHsJsonArtUrl(hsJsonLocale, hsJsonId){
  return `https://art.hearthstonejson.com/v1/bgs/latest/${hsJsonLocale}/512x/${hsJsonId}.png`;
}

async function downloadImagesOfOneCardFromHSJson(dbfId, hsJsonId, patchId) {
  const localesStrings = getLocalesStrings();
  
  for(let locale in localesStrings) {
    let hsJsonLocale = localesStrings[locale];
    let url = makeHsJsonArtUrl(hsJsonLocale, hsJsonId);
    
    try {
      fsExtra.ensureDir(absolutePath(`../client/public/cards/${locale}/${patchId}`));
      await downloadImage(url, `../client/public/cards/${locale}/${patchId}/${dbfId}.png`);
    } catch (error) {
      console.error(`Not finding ${url}`);
    }
    
    
  }
}

async function downloadImageOfOneCardFromHSJson(dbfId, hsJsonId, patchId, locale) {
  const localesStrings = getLocalesStrings();
  
  let hsJsonLocale = localesStrings[locale];
  let url = makeHsJsonArtUrl(hsJsonLocale, hsJsonId);
  
  try {
    fsExtra.ensureDir(absolutePath(`../client/public/cards/${locale}/${patchId}`));
    await downloadImage(url, `../client/public/cards/${locale}/${patchId}/${dbfId}.png`);
  } catch (error) {
    console.error(`Not finding ${url}`);
    throw error;
  }
    
    
  
}

async function getRemainingImagesFromHSJson(){
  let patchId = 190416; // most recent patch
  let remainingCards = getJsonFromFile("./couldntbefound.json");
  let fails = {};

  for(let dbfId in remainingCards) {
    let hsJsonId = remainingCards[dbfId];
    try {
      await downloadImagesOfOneCardFromHSJson(dbfId, hsJsonId, patchId);
    } catch (error) {
      fails[dbfId] = hsJsonId;
    } 
  
  }
  saveJsonToFile("./stillcouldntbefound.json", fails);
  
}

async function getRemainingImagesOnlyForUS(){
  let patchId = 190416;
  let remainingCards = getJsonFromFile("./stillcouldntbefound.json");


  for(let dbfId in remainingCards) {
    let hsJsonId = remainingCards[dbfId];
    try {
      await downloadImageOfOneCardFromHSJson(dbfId, hsJsonId, patchId, "en_US").then( () => {
        console.log(`Successfully gotten the english image for ${hsJsonId}: ${dbfId} $`);
      });
    } catch (error) {

    } 
  
  }

}

// async function temp() {
//   let token = await getNewAccessToken();
//   console.log(token);
// }
// temp();

module.exports = { getJsonFromFile, saveJsonToFile, downloadImagesFromBlizzAPIForCardId }

//