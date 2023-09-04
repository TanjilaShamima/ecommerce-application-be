const express = require('express');
const {
    processRegister,
    verifyUserAndActivateUser
} = require('../controllers/authController');
const upload = require('../middleware/fileUpload');
const { validateUserRegistration } = require('../validators/authValidation');
const { runValidation } = require('../validators/runValidation');
const authRouter = express.Router();


authRouter.post('/process-register',  upload.single("image"), validateUserRegistration, runValidation, processRegister);

authRouter.post('/verify-user', verifyUserAndActivateUser);


module.exports = authRouter;