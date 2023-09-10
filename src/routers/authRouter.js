const express = require('express');
const {
    processRegister,
    verifyUserAndActivateUser,
    userLogin,
    userLogout
} = require('../controllers/authController');
const upload = require('../middleware/fileUpload');
const { validateUserRegistration, userLoginValidator } = require('../validators/authValidation');
const { runValidation } = require('../validators/runValidation');
const { isLoggedOut, isLoggedIn } = require('../middleware/auth');
const authRouter = express.Router();


authRouter.post('/process-register',  upload.single("image"), isLoggedOut, validateUserRegistration, runValidation, processRegister);

authRouter.post('/verify-user', isLoggedOut, verifyUserAndActivateUser);

authRouter.post('/login', userLoginValidator, runValidation, isLoggedOut,  userLogin);


authRouter.post('/logout', isLoggedIn, userLogout);


module.exports = authRouter;