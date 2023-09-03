const express = require('express');
const {getFilteredUsers, getUserByID, deleteUserById} = require('../controllers/userController');
const userRouter = express.Router();

/*
    - Get User By limit, page no, search value
    - filter by search params, page no and limit per page
    - return result message and the list of users found
*/
userRouter.get('/', getFilteredUsers);

/*
    - Get User By ID
    - return result message and the user found
*/
userRouter.get('/:id', getUserByID);

/*
    - Delete User By ID
    - return result message and the user found
*/
userRouter.delete('/:id', deleteUserById);

module.exports = userRouter;