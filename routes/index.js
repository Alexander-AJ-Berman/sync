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

/**
 * Displays Home page
 */
pageRouter.route('/').get(async (req, res) => {
    return res.status(200).render('home');
});

/**
 * Renders Spotify OAuth widget. Following authentication, user is direction to the /callback route
 * (!) ensure redirect URI is whitelisted on Spotify Dashboard
 * ~~ Documentation for appendable :roomNumber that post login will redirect you immediately to a room
 */
pageRouter.route('/login').get((req, res) => {
    try {
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
    // Requests Spotify access, storing credentials in session ID
    const status = await requestSpotifyAccessToken(req, code);
    if (!status) return res.status(400).send("Error getting Spotify access.");
    return res.redirect('/spotify');
});

/**
 * Development route to remove Spotify auth, effectively logging user out.
 */
pageRouter.route('/removeAuth').get((req, res) => {
    delete req.session.access_token;
    delete req.session.refresh_token;
});

/**
 * Whenever you navigate to /spotify, your access token is used to formulate a request
 */
pageRouter.route('/spotify').get(async (req, res) => {
    try {
        // Retrieve host access token and use it to get host playback
        const host = await retrievePlaybackData(spotifyApi, process.env.HOST_ACCESS_TOKEN); // TODO: Change this to host's access token
        const result = await playTrack(spotifyApi, req.session.access_token, host.trackUri, host.trackNum, 0);
        console.log(result);
        return res.status(200).send(result);
    } catch (err) {
        console.log(err);
    }
});


module.exports = pageRouter;