const express = require('express');
const pageRouter = express.Router();

/**
 * Displays Home page
 */
pageRouter.route('/').get((req, res) => {
    return res.status(200).render('home');
});

module.exports = pageRouter;