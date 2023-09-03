const express = require('express');
const { processRegister } = require('../controllers/authController');
const authRouter = express.Router();


authRouter.post('/process-register', processRegister);


module.exports = authRouter;