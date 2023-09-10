const { errorResponseController } = require("../controllers/responseController");
const { jwtAccessKey } = require("../secret");
const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        console.log('token', token);

        const decode = jwt.verify(token, jwtAccessKey);
        console.log('decode', decode);
        if(!decode){
            return errorResponseController(res, {
                statusCode: 401,
                message: 'Invalid access token',
            })
        }
        req.user = decode.user;
        next();
    } catch (error) {
        console.log(error);
    }
}

const isLoggedOut = async(req, res, next) => {
    try {
        console.log('req.cookies', req.cookies);
        const accessToken = req.cookies.access_token;
        if(accessToken){
            errorResponseController(res, {
                statusCode: 400,
                message: 'User is already logged in'
            })
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

const isAdmin = async(req, res, next) => {
    try {

        console.log("user", req.user)
        if(!req.user.isAdmin){
            errorResponseController(res, {
                statusCode: 400,
                message: 'You have no access to this'
            })
        }
        next();
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    isAdmin
}