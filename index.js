const express = require('express');
const path = require('path');
const { serverPort } = require('./src/secret');
const  cookieParser  = require('cookie-parser');
const connectDatabase = require('./src/config/db');
const userRouter = require('./src/routers/userRouter');
const seedRouter = require('./src/routers/seedRouters');
const authRouter = require('./src/routers/authRouter');
const app = express();
// console.log("aaa", path.join(__dirname, 'public'));

// const rateLimit = rateLimit({
//     windowMs: 60 * 1000,
//     max: 5,
//     message: 'Too many requests from this IP. Please try again later.',
// })

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/user', userRouter);
app.use('/api/seed', seedRouter);
app.use('/api/auth', authRouter);

app.listen(serverPort, async() => {
    console.log('listening on port', serverPort);
    await connectDatabase();
})

module.exports = app
