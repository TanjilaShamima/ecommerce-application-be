const express = require('express');
const {getFilteredUsers} = require('../controllers/userController');
const userRouter = express.Router();


userRouter.get('/', getFilteredUsers);

module.exports = userRouter;