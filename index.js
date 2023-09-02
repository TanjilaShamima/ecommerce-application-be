const express = require('express');
const { serverPort } = require('./src/secret');
const connectDatabase = require('./src/config/db');
const userRouter = require('./src/routers/userRouter');
const seedRouter = require('./src/routers/seedRouters');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/user', userRouter);
app.use('/api/seed', seedRouter);

app.listen(serverPort, async() => {
    console.log('listening on port', serverPort);
    await connectDatabase();
})

module.exports = app
