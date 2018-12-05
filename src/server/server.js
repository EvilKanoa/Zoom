require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const request = require('request');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const app = express();
const server = http.Server(app);
let db;

// connect to mongo
MongoClient.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true },
    (err, mongo) => {
        if (err) {
            console.error(`Unable to connect to MongoDB: ${process.env.MONGODB_URI}`);
        } else {
            console.log(`Connected to MongoDB.`);
            db = mongo.db();
        }
    }
);

// add express middleware
app.use(bodyParser.json());

// add app routes
routes(app);

// serve react SPA
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../../dist')));
    const index = path.resolve(__dirname, '../../dist/index.html');
    app.get('*', (req, res) => {
        res.set('Cache-Control', 'private, must-revalidate');
        res.sendFile(index);
    });
} else {
    console.log('webpack building...');
    const config = require(path.resolve(__dirname, '../../webpack.dev.js'))(process.env);
    const compiler = require('webpack')(config);

    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: '/',
        watchOptions: { aggregateTimeout: 1000 },
        logLevel: 'warn'
    }));
    app.use(require('webpack-hot-middleware')(compiler));
    app.get('*', (req, res) => {
        request.get({
            method: 'GET',
            uri: `${req.protocol}://${req.hostname}:${process.env.PORT}/index.html`
        }, (err, r, body) => {
            if (err) { return res.status(500).send(err); }
            res.send(body);
        });
    });
}

server.listen(process.env.PORT, () => {
    console.log(`
        Started the ZOOM SPA Server.
        mode: ${process.env.NODE_ENV} - port: ${process.env.PORT}
    `);
});

module.exports = {
    db
};
