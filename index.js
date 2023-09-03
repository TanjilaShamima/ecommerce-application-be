const express = require('express');
const { serverPort } = require('./src/secret');
const connectDatabase = require('./src/config/db');
const userRouter = require('./src/routers/userRouter');
const seedRouter = require('./src/routers/seedRouters');
const authRouter = require('./src/routers/authRouter');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/user', userRouter);
app.use('/api/seed', seedRouter);
app.use('/api/auth', authRouter);

app.listen(serverPort, async() => {
    console.log('listening on port', serverPort);
    await connectDatabase();
})

module.exports = app
