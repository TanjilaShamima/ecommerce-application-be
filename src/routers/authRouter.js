const express = require('express');
const {
    processRegister,
    verifyUserAndActivateUser
} = require('../controllers/authController');
const authRouter = express.Router();


authRouter.post('/process-register', processRegister);

authRouter.post('/verify-user', verifyUserAndActivateUser);


module.exports = authRouter;