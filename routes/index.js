const express = require('express');
const pageRouter = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: 'f4ca4128f708491c89428d8ac63afcac',
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/callback'
});

const { requestSpotifyAccessToken } = require('./helpers');
const { retrievePlaybackData, playTrack } = require('./playbackHelpers/playbackHelpers');

// Maps host names to host Spotify access token and user access tokens
let hostTokenMap = {};

/**
 * Displays Home page
 */
pageRouter.route('/').get(async (req, res) => {
    return res.status(200).render('home');
});

/**
 * Renders Spotify OAuth widget. Following authentication, user is direction to the /callback route
 * (!) ensure redirect URI is  whitelisted on Spotify Dashboard
 * ~~ Documentation for appendable :roomNumber that post login will redirect you immediately to a room
 */
pageRouter.route('/login/:hostName').get((req, res) => {
    try {
        // TODO: Middleware to require hostName, set is Host to false by default
        req.session.hostName = req.params.hostName; // Host's display name

        // Spotify API code, redirects to Oauth
        var scopes = 'streaming user-read-private user-read-email user-modify-playback-state user-read-playback-state';
        res.redirect('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=f4ca4128f708491c89428d8ac63afcac' +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI));
    } catch (err) {
        console.log(err);
    }
});

/**
 * Redirect route following Spotify login
 */
pageRouter.route('/callback').get(async (req, res) => {
    const code = req.query.code;
    // Requests Spotify access, storing credentials in session
    const status = await requestSpotifyAccessToken(req, code);
    
    const isHost = req.session.hostName in hostTokenMap ? false : true;
    // Sets host's access token as token for the room if host
    if (isHost) {
        hostTokenMap[req.session.hostName] = {};
        hostTokenMap[req.session.hostName].hostToken = req.session.access_token;
        hostTokenMap[req.session.hostName].userTokens = [];
    }
    // Adds user's token to the host's token list if guest
    else {
        hostTokenMap[req.session.hostName].userTokens.push(req.session.access_token);
    }
    return res.redirect('/spotify');
});

/**
 * Development route to remove Spotify auth, effectively logging user out.
 */
pageRouter.route('/removeAuth').get((req, res) => {
    delete req.session;
});

/**
 * Whenever you navigate to /spotify, your access token is used to formulate a request
 */
pageRouter.route('/spotify').get(async (req, res) => {
    try {
        // Retrieve host access token and use it to get host playback
        const host = await retrievePlaybackData(spotifyApi, hostTokenMap[req.session.hostName].hostToken);
        // TODO: change to guest's spotify token
        const result = await playTrack(spotifyApi, hostTokenMap[req.session.hostName].hostToken, host.trackUri, host.trackNum, host.trackTime);
        console.log(result);
        return res.status(200).send(result);
    } catch (err) {
        console.log(err);
    }
});


module.exports = pageRouter;