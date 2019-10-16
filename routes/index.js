const express = require('express');
const pageRouter = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: 'f4ca4128f708491c89428d8ac63afcac',
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/callback'
});

const { requestSpotifyAccessToken } = require('./helpers');

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
    var scopes = 'streaming user-read-private user-read-email user-modify-playback-state user-read-playback-state';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=f4ca4128f708491c89428d8ac63afcac' +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI));
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
 * Experimenting with Spotify api requests
 */
pageRouter.route('/spotify').get(async (req, res) => {
    if (req.session.access_token) {
        spotifyApi.setAccessToken(req.session.access_token);
        const response = await spotifyApi.getMyCurrentPlaybackState();
        // await spotifyApi.play({
        //     context_uri: 'spotify:artist:3WrFJ7ztbogyGnTHbHJFl2',
        //     track_number: 6
        // });
        console.log(response.body.item.name);
        return res.send(response.body.item);
    } else {
        return res.send("not authenticated");
    }
});


module.exports = pageRouter;