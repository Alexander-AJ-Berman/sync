const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    username: { type: String },
    passwordHash: { type: Object },
    dateCreated: { type: Date }
});

module.exports = mongoose.model('User', userModel);
