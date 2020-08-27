require('dotenv').config();

const express = require('express');
var logger = require('morgan');

const port = process.env.PORT;
require('./db/db');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers");
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

var api = require('./routes/api');

app.use('/api', api);

app.get('/', function(req, res) {
    res.send('Error.');
});