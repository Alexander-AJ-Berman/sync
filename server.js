const express = require('express');
const app = express();

// Import dependencies
const ejs = require('ejs');
const path = require('path'); 
const mongoose = require('mongoose');
const session = require('express-session');


require('dotenv').config();
app.use(express.json());
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const port = process.env.PORT || 3000;


app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Import external routers
const pageRouter = require('./routes/index');
const authRouter = require('./routes/auth/index');

// Register external routers
app.use('/', pageRouter);
app.use('/auth', authRouter);

// Connect to Mongo DB
const db = mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(
    () => {
    console.log("Connected to database...");
});

app.listen(port, () => console.log(`Sync listening on port ${port}!`))