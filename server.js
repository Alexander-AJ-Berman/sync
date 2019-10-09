const express = require('express');
const app = express();

const ejs = require('ejs');
const path = require('path');

const port = process.env.PORT || 3000;

//app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Import external routers
const pageRouter = require('./routes/index');
const authRouter = require('./routes/auth/index');

// Register external routers
app.use('/', pageRouter);
app.use('/auth', authRouter);


app.listen(port, () => console.log(`Sync listening on port ${port}!`))