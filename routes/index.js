const express = require('express');
const pageRouter = express.Router();

/**
 * Displays Home page
 */
pageRouter.route('/').get((req, res) => {
    return res.status(200).render('home');
});

/**
 * Renders Spotify OAuth widget 
 * (!) ensure redirect URI is whitelisted on Spotify Dashboard
 */
pageRouter.route('/spotify').get((req, res) => {
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=f4ca4128f708491c89428d8ac63afcac' +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(`http://localhost:3000`));
});

module.exports = pageRouter;