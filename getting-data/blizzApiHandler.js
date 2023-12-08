require('dotenv').config();
const axios = require('axios').default;
const fs = require("fs");
const fsExtra = require("fs-extra");
const { getCardById, getJsonMappingFile } = require('../server/db/dbManager');
const path = require('path');

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
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  fs.writeFile(absolutePath(filename), response.data, (err) => {
    if (err) throw err;
  });
}

function absolutePath(relativePath){
  return path.resolve(__dirname, relativePath);
}

function getListAllCardsDb(){
  let mappingJson = getJsonMappingFile();
  return Object.keys(mappingJson.cards);
}

function downloadImages(images, dbfId, patchId){
  if(Object.keys(images).length === 0){
    throw new Error(`error: no images`);
  }
  for(let locale in images){
    let imageUrl = images[locale];
    fsExtra.ensureDir(absolutePath(`./images/${locale}/${patchId}`));
    downloadImage(imageUrl, `./images/${locale}/${patchId}/${dbfId}.png`)
  }
}

function saveJsonToFile(filename, jsonObj) {
  fs.writeFileSync(absolutePath(filename), JSON.stringify(jsonObj, null , 2));
}

async function main() {
  // most recent patch = 190416
  let patchId = 190416;
  let dbfIdList = getListAllCardsDb();
  // let i = 0;
  let token = await getAccessToken();
  let fails = {}; // keys are dbfIds, values are ids

  for(let dbfId of dbfIdList){
    // if(i > 0){
    //   break;
    // }
    // ++i;
    // dbfId = 70150; // debug purposes
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
      downloadImages(images, dbfId, patchId);
      // console.log(response);
    } catch (error) {
      console.error(error.message);
      fails[dbfId] = currentCard.id;
    }
    
    saveJsonToFile("./couldntbefound.json", fails);
    // console.log(getCardById(dbfId).id);
    
  }

  // console.log(fails);

  // temp();

  // let token = await getAccessToken();
  // let apiUrl = getCardApiUrl(80769, "en_US");
  // console.log(apiUrl);

  // try {
  //   let response = await getApiResponse(apiUrl, token);
  //   console.log(response);
  // } catch (error) {
  //   console.error(error.message);
  // }



  // most recent patch = 190416

  


  // for each card in mapping json, search for it in the api
    // if I get an error, add the dbfid of the card in a text file
  // find the first patch for that card in the mapping file. If the card has battlegroundsNormalDbfId, download the golden picture instead of the regular one
  // save the pictures with the format ./[LOCALE]/[CARD_DBFID]_[PATCH].png
  
  
}

main();



