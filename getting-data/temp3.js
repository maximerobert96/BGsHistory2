require('dotenv').config();
const axios = require('axios');

const clientId = process.env.BNET_ID;
const clientSecret = process.env.BNET_SECRET;
const tokenEndpoint = 'https://oauth.battle.net/token'; // Update the URL based on your region

const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

const data = {
  grant_type: 'client_credentials',
};

axios({
  method: 'post',
  url: tokenEndpoint,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${authString}`,
  },
  data: new URLSearchParams(data),
})
  .then(response => {
    console.log('Response:', response.data);
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

