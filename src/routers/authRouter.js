const express = require('express');
const {
    processRegister,
    verifyUserAndActivateUser
} = require('../controllers/authController');
const upload = require('../middleware/fileUpload');
const authRouter = express.Router();


authRouter.post('/process-register', upload.single("image"), processRegister);

authRouter.post('/verify-user', verifyUserAndActivateUser);


module.exports = authRouter;