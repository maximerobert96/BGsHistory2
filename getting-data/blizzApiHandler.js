require('dotenv').config();
const axios = require('axios').default;
const fs = require("fs");

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
      fs.writeFileSync('./access-token.json', JSON.stringify(tokenObj, null , 2));
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
    tokenObj = JSON.parse(fs.readFileSync('./access-token.json'));
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

  fs.writeFile(filename, response.data, (err) => {
    if (err) throw err;
  });
}

async function main() {
  let token = await getAccessToken();
  let apiUrl = getCardApiUrl(80769, "en_US");
  console.log(apiUrl);

  try {
    let response = await getApiResponse(apiUrl, token);
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }


  
  
  
}

main();



