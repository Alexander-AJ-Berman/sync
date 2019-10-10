const express = require('express');
const authRouter = express.Router();

const missingParams = require('../../middleware/missingParams');

authRouter.route('/create').post((req, res) => {
    const required = ["username", "password"];
    if (missingParams(req, res, required)) return;
    // Add user to database if username is unique
    return res.status(200).send("Create");
});

authRouter.route('/login').post((req, res) => {
    const required = ["username", "password"];
    if (missingParams(req, res, required)) return;

    // Initiate express session
    return res.status(200).send("Login");
});

authRouter.route('/logout').post((req, res) => {
    // Terminate express session
    return res.status(200).send("Logout");
});




module.exports = authRouter;