//#region IMPORTS
import express from 'express';  // to start web server
import axios from 'axios';  // to execute HTTP request
import cors from 'cors';  // to allow external interaction
import dotenv from 'dotenv';  // for environment variables
//#endregion

//#region CONFIGURATIONS
dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const port = process.env.SERVER_PORT;
const redirectUri = process.env.SPOTIFY_REDIRECT_URL;
const allowedDomain = [ process.env.ALLOWED_DOMAIN ];
const dbApiUrl = process.env.DBAPI_URL;
const frontendUrl = process.env.FRONTEND_URL;
//#endregion

//#region LOGS
function stepBeggining(step) {
    const sptor = "=".repeat(5);
    console.log(`\n${sptor} ${step} ${sptor}`);
}
//#endregion

//#region APP INIT
const app = express()
app.use(express.json());
app.listen(port, () => { console.log(`Big brother server is listening on port ${port}`) })
//#endregion

//#region ACCESS TOKEN
app.get('/callback', async (req, res) => {
  stepBeggining("Activation");
  
  let data;
  let accessToken;
  let refreshToken;
  const code = req.query.code;

  try {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token', method: 'post', json: true,
      data: { 
        code: code, 
        redirect_uri: redirectUri, 
        grant_type: 'authorization_code' 
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
      }    
    };
    const response1 = await axios(authOptions);
    accessToken = response1.data.access_token
    refreshToken = response1.data.refresh_token
  } catch (error) {
    console.log(`Error getting Spotify token: ${error}`);
    console.log(error.response.data);
    res.status(500).send('Error');
  }

  try {
    const response2 = await axios.get(`https://api.spotify.com/v1/me`, { headers: { 'Authorization': 'Bearer ' + accessToken, } });
    data = {
      SpotifyId: response2.data.id,
      AccessToken: accessToken,
      RefreshToken: refreshToken
    };
  } catch (error) {
    console.log(`Error getting user Spotify id: ${error}`);
    console.log(error);
    res.status(500).send('Error');
  }

  try {
    await axios.post(`${dbApiUrl}/users`, {
      spotifyId: data.SpotifyId,
      accessToken: data.AccessToken,
      refreshToken: data.RefreshToken
    })

    console.log('Data inserted/updated successfully');
    //res.status(200).send('Ok');
    res.redirect(`${frontendUrl}`);
  } catch (error) { 
    console.log(`Error accessing database API: ${error}`);
    console.log(error);
    res.status(500).send('Error');
  }
});
//#endregion