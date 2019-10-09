const express = require('express');
const authRouter = express.Router();

authRouter.route('/create').post((req, res) => {
    return res.status(200).send("Create");
});

authRouter.route('/login').post((req, res) => {
    return res.status(200).send("Login");
});

authRouter.route('/logout').post((req, res) => {
    return res.status(200).send("Logout");
});




module.exports = authRouter;