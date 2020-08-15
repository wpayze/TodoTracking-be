require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
require('./db/db');

const app = express();

app.use(express.json());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

var api = require('./routes/api');

app.use('/api', api);

app.get('/', function(req, res) {
    res.send('Error.');
});