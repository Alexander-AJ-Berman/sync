const express = require('express');
const authRouter = express.Router();

const missingParams = require('../../middleware/missingParams');
const { createUser, login } = require('./helpers');

authRouter.route('/create').post(async (req, res) => {
    const required = ["username", "password"];
    if (missingParams(req, res, required)) return;
    
    const { success, msg } = await createUser(req.body.username, req.body.password);
    // Login upon account creation
    if (success) await login(req, req.body.username, req.body.password);
    
    return res.status(200).send({success: success, message: msg});
});

authRouter.route('/login').post(async (req, res) => {
    const required = ["username", "password"];
    if (missingParams(req, res, required)) return;
    const success = await login(req, req.body.username, req.body.password);
    return res.status(200).send({ message: "Successfully logged in" });
});

authRouter.route('/logout').post((req, res) => {
    if (req.session.login) delete req.session.login;
    return res.status(200).send({ message: "Successfully logged out" });
});

module.exports = authRouter;