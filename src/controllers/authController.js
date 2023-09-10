const bcrypt = require('bcryptjs');
const {
    sendWithNodemailer
} = require("../helper/email");
const {
    createJsonWebToken
} = require("../helper/jsonWebToken");
const User = require("../models/userModel");
const {
    jwtActivationKey,
    clientUrl,
    jwtAccessKey
} = require("../secret");
const jwt = require('jsonwebtoken');
const {
    successResponseController,
    errorResponseController
} = require("./responseController");

const processRegister = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address
        } = req.body;

        console.log('req.body', req.file)
        if(!req.file){
            return errorResponseController(res, {
                statusCode: 404,
                message: 'Image is required'
            })
        }
        const imageBufferString = req.file.buffer.toString('base64');

        console.log('imageBufferString', imageBufferString)

        const newUser = {
            name,
            email,
            password,
            phone,
            address,
            // image: req.file.path,
            image: imageBufferString
        }

        const userExist = await User.exists({
            email: email
        });
        if (userExist) {
            errorResponseController(res, {
                statusCode: 409,
                message: 'User already exists',
            })
        }

        // create jwt token
        const token = createJsonWebToken(newUser, jwtActivationKey, "3d");

        // prepare email
        const emailData = {
            email: email,
            subject: 'Email verification email',
            body: `
            <h2>Hello ${name}</h2>
            <p>Please click here to this<a href="${clientUrl}/api/auth/verify-user/${token}" target="_blank"> link </a> to verify the email.</p>
            `
        }

        try {
            await sendWithNodemailer(emailData);
        } catch (error) {
            console.error(error);
        }

        return successResponseController(res, {
            statusCode: 200,
            message: `Please go to your ${email} for verifying email address.`,
            payload: {
                token,
                imageBufferString
            }
        })

    } catch (error) {

    }
}

const verifyUserAndActivateUser = async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return errorResponseController(res, {
                statusCode: 404,
                message: 'Token not found'
            })
        }

        try {
            const decoded = jwt.verify(token, jwtActivationKey);

            const userExist = await User.exists({
                email: decoded.email
            });

            if (userExist) {
                errorResponseController(res, {
                    statusCode: 409,
                    message: 'User already exist with this email address',
                })
            }

            const user = await User.create(decoded);
            return successResponseController(res, {
                statusCode: 201,
                message: 'User activated successfully',
                payload: {
                    user
                }
            })

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return errorResponseController(res, {
                    statusCode: 401,
                    message: 'Token has expired'
                })
            } else if (error.name === 'JsonWebTokenError') {
                return errorResponseController(res, {
                    statusCode: 401,
                    message: 'Invalid Token'
                })
            } else {
                console.error(error);
            }

        }

    } catch (error) {
        console.error(error);
    }
}

const userLogin = async(req, res) => {
    try {
        // email, password
        const {email, password} = req.body;
        //is Exist

        const user = await User.findOne({email});

        if(!user){
            return errorResponseController(res, {
                statusCode: 404,
                message: 'User is not exist. Please register first.',
            })
        }
        // compare the password

        const passMatched = await bcrypt.compare(password, user.password)

        if(!passMatched){
            return errorResponseController(res, {
                statusCode: 401,
                message: 'Password does not match. Please',
            })
        }
        //isBanned

        if(user.isBanned){
            return errorResponseController(res, {
                statusCode: 403,
                message: 'You are banned. Please try again',
            })
        }

        //access token, cookie

        const accessToken = createJsonWebToken({user}, jwtAccessKey, '15m');

        res.cookie('access_token', accessToken, {
            maxAge: 15*60*1000, //15min
            httpOnly: true,
            secure: true,
            sameSite: 'none',

        });

        // 

        return successResponseController(res, {
            statusCode: 200,
            message: `User login successful`,
            payload: {
                user
            }
        })
        
    } catch (error) {
        
    }
}

const userLogout = async(req, res) => {
    try {
        res.clearCookie('access_token');

        return successResponseController(res, {
            statusCode: 200,
            message: `User logout successful`,
            payload: {
                
            }
        })
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    processRegister,
    verifyUserAndActivateUser,
    userLogin,
    userLogout
}