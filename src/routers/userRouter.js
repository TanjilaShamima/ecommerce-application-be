const express = require('express');
const {getFilteredUsers} = require('../controllers/userController');
const userRouter = express.Router();

/*
    - Get User By limit, page no, search value
    - filter by search params, page no and limit per page
    - return result message and the list of users found
*/
userRouter.get('/', getFilteredUsers);

module.exports = userRouter;