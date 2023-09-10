const express = require('express');
const {getFilteredUsers, getUserByID, deleteUserById, updateUserById, baneUserById, updatePasswordById, handleForgetPassword, handleResetPassword} = require('../controllers/userController');
const upload = require('../middleware/fileUpload');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { passwordChangeValidator, forgetPasswordValidators, resetPasswordValidators } = require('../validators/authValidation');
const { runValidation } = require('../validators/runValidation');
const userRouter = express.Router();

/*
    - Get User By limit, page no, search value
    - filter by search params, page no and limit per page
    - return result message and the list of users found
*/
userRouter.get('/', isLoggedIn, isAdmin, getFilteredUsers);

/*
    - Get User By ID
    - return result message and the user found
*/
userRouter.get('/:id', isLoggedIn, getUserByID);

/*
    - Delete User By ID
    - return result message and the user found
*/
userRouter.delete('/:id', deleteUserById);

/*
    - update User By ID
    - return result message and the user found
*/
userRouter.put('/update/:id', upload.single("image"), updateUserById);


userRouter.put('/ban-user/:id', isLoggedIn, isAdmin, baneUserById);

userRouter.put('/update-password/:id', passwordChangeValidator, runValidation, isLoggedIn, updatePasswordById);


userRouter.post('/forget-password', forgetPasswordValidators, runValidation, handleForgetPassword);


userRouter.put('/reset-password', resetPasswordValidators, runValidation, handleResetPassword);

module.exports = userRouter;