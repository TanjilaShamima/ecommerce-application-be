const {
    sendWithNodemailer
} = require("../helper/email");
const {
    createJsonWebToken
} = require("../helper/jsonWebToken");
const User = require("../models/userModel");
const {
    jwtActivationKey,
    clientUrl
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
            <p>Please click here to this<a href="${clientUrl}/api/auth/activate/${token}" target="_blank"> link </a> to verify the email.</p>
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

module.exports = {
    processRegister,
    verifyUserAndActivateUser
}