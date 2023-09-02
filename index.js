const express = require('express');
const { serverPort } = require('./src/secret');
const connectDatabase = require('./src/config/db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(serverPort, async() => {
    console.log('listening on port', serverPort);
    await connectDatabase();
})

module.exports = app
