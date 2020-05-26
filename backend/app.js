const path = require('path');
const express = require('express');
const imageRouter = require('./routes/imageRoutes');

// Create app
const app = express();

app.use(express.static(`${__dirname}/../frontend/build/`));

// Body parser - middleware that modifies incoming request data into json
app.use(express.json());

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods", "*');
    next();
});

// Routes
app.use('/images', imageRouter);

// Serving static files
app.use(express.static('public'));

// Catching uncaught routes
app.get('*', function (_req, res) {
    res.sendFile('index.html', {
        root: path.join(__dirname, '../frontend/build/'),
    });
});

module.exports = app;
