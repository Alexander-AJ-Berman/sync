const querystring = require('querystring');
const axios = require('axios');

/**
 * Takes in the one-time access code generated upon Spotify login,
 *  uses the code to request an access_token and refresh_token,
 *  and stores them in the session object.
 */
const requestSpotifyAccessToken = async (req, code) => {
    try {
        const options = {
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
            }
        }
        const formData = querystring.stringify({
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        });
        const response = await axios.post('https://accounts.spotify.com/api/token', formData, options);
        // Store access_token and refresh_token in session
        req.session.access_token = response.data.access_token;
        req.session.refresh_token = response.data.refresh_token;
        return true;

    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    requestSpotifyAccessToken,
}