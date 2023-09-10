const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt  = require('jsonwebtoken');
const {
    successResponseController,
    errorResponseController
} = require("./responseController");
const { findItemByID } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { jwtResetPasswordKey, clientUrl } = require("../secret");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const fs = require('fs').promises;


/*
    - Get User By limit, page no, search value
    - filter by search params, page no and limit per page
    - return result message and the list of users found
*/

const getFilteredUsers = async (req, res) => {
    try {
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegex = new RegExp('.*' + search + '.*', 'i'); // regex pattern to match search parameters in the query string and it will be case insensitive

        const filter = {
            isAdmin: {
                $ne: true
            }, // filter not admin users only
            $or: [{
                    name: {
                        $regex: searchRegex
                    }
                },
                {
                    email: {
                        $regex: searchRegex
                    }
                },
                {
                    phone: {
                        $regex: searchRegex
                    }
                }
            ]
        }

        const options = {
            password: 0
        }; // hide password from the filtered values

        const users = await User.find(filter, options).limit(limit).skip((page - 1) * limit); // set limit to the page  and skip the previous page data

        const totalUsers = await User.find(filter).countDocuments(); // count total documents

        if (users.length) {
            return successResponseController(res, {
                statusCode: 200,
                message: 'User were returned successfully',
                payload: {
                    users: users,
                    pagination: {
                        totalPages: Math.ceil(totalUsers / limit),
                        currentPage: page,
                        previousPage: page - 1 > 0 ? page - 1 : null,
                        nextPage: page + 1 <= Math.ceil(totalUsers / limit) ? page + 1 : null
                    }
                }
            })
        } else {
            return errorResponseController(res, {
                statusCode: 404,
                message: 'No users found'
            })
        }

    } catch (error) {
        console.error(error)
        return errorResponseController(res, {
            statusCode: error.statusCode,
            message: error.message,
        })
    }
}

/*
    - Get User By ID
    - return result message and the user found
*/

const getUserByID = async (req, res) => {
    try {

        const id = req.params.id;
        const option = {
            password: 0
        };
        const user = await findItemByID(User, id, option);

        return successResponseController(res, {
            statusCode: 200,
            message: 'User were returned successfully',
            payload: {
                user: user,
            }
        })
       

    } catch (error) {
        if (error instanceof mongoose.Error) {
            return errorResponseController(res, {
                statusCode: 400,
                message: 'Invalid user ID',
            })
        } else {
            return errorResponseController(res, {
                statusCode: error.statusCode,
                message: error.message,
            })
        }

    }
}


/*
    - Delete User By ID
    - return result message and the user found
*/
const deleteUserById = async (req, res) => {
    try {

        const id = req.params.id;
        const user = await findItemByID(User, id);

        // const userImagePath = user?.image;
        
        // await deleteImage(userImagePath);

        await User.findByIdAndDelete({_id: id, isAdmin: false});

        return successResponseController(res, {
            statusCode: 200,
            message: 'User was deleted successfully',
        })
       

    } catch (error) {
        if (error instanceof mongoose.Error) {
            return errorResponseController(res, {
                statusCode: 400,
                message: 'Invalid user ID',
            })
        } else {
            return errorResponseController(res, {
                statusCode: error.statusCode,
                message: error.message,
            })
        }

    }
}

const updateUserById = async(req, res) => {
    try {
        const userId = req.params.id;
        const updateOptions = { new: true, runValidators: true, Context: 'query' };
        let updates = {};

        // if(req.body.name){
        //     updates.name = req.body.name;
        // }
        // if(req.body.password){
        //     updates.password = req.body.password;
        // }
        // if(req.body.phone){
        //     updates.phone = req.body.phone;
        // }

        // if(req.body.address){
        //     updates.address = req.body.address;
        // }

        for(let key in req.body){
            if(['name', 'password', 'phone', 'address'].includes(key)){
                updates[key] = req.body[key];
            }
        }

        const image = req.file;

        if(image){
           if(image.size > 1024 * 1024 * 2){
            return errorResponseController(res, {
                statusCode: 400,
                message: 'Image size is too large',
            })
           }
           updates.image = image.buffer.toString('base64');
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select('-password');
        if(!updatedUser) {
            return errorResponseController(res, {
                statusCode: 400,
                message: 'User does not exist with this ID.',
            })
        }


        return successResponseController(res, {
            statusCode: 200,
            message: 'User updated successfully',
            payload: {
                updatedUser
            }
        })

        
    } catch (error) {
        if (error instanceof mongoose.Error) {
            return errorResponseController(res, {
                statusCode: 400,
                message: 'Invalid item ID',
            })
        } else {
            console.log('here is a valid item ID')
            return errorResponseController(res, {
                statusCode: error.statusCode,
                message: error.message,
            })
        }
    }
}

const baneUserById = async (req, res, next) => {
    try {
        // const userId = req.params.id;
        // const {email, oldPassword, newPassword, confirmPassword} = req.body;
        // const user = await findItemByID(User, userId);
        // if(!user){
        //     errorResponseController(res, {
        //         statusCode: 404,
        //         message: 'User not found'
        //     })
        // }

        // const passMatched = await bcrypt.compare(oldPassword, user.password)

        // if(!passMatched){
        //     return errorResponseController(res, {
        //         statusCode: 401,
        //         message: 'Password does not match. Please',
        //     })
        // }

        // const updates = {$set : {password: newPassword}};

        // const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select('-password');
        // if(!updatedUser) {
        //     return errorResponseController(res, {
        //         statusCode: 400,
        //         message: 'User does not exist with this ID.',
        //     })
        // }


        // return successResponseController(res, {
        //     statusCode: 200,
        //     message: 'User updated successfully',
        //     payload: {
        //         updatedUser
        //     }
        // })
        
    } catch (error) {
        
    }
}

const updatePasswordById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const {email, oldPassword, newPassword, confirmPassword} = req.body;
        const user = await findItemByID(User, userId);
        if(!user){
            errorResponseController(res, {
                statusCode: 404,
                message: 'User not found'
            })
        }

        const passMatched = await bcrypt.compare(oldPassword, user.password)

        if(!passMatched){
            return errorResponseController(res, {
                statusCode: 401,
                message: 'Password does not match. Please',
            })
        }

        if(newPassword !== confirmPassword){
            return errorResponseController(res, {
                statusCode: 401,
                message: 'New password and confirm password do not match. Please try again',
            })
        }

        // const updates = {$set : {password: newPassword}};

        const updateOptions = { new: true };

        const updatedUser = await User.findByIdAndUpdate(userId, {password: newPassword}, updateOptions).select('-password');
        if(!updatedUser) {
            return errorResponseController(res, {
                statusCode: 400,
                message: 'User does not exist with this ID.',
            })
        }


        return successResponseController(res, {
            statusCode: 200,
            message: 'User updated successfully',
            payload: {
                updatedUser
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const handleForgetPassword = async(req, res) => {
    try {
        const {email} = req.body;
        const userData = await User.findOne({ email: email});

        if(!userData){
            return errorResponseController(res, {
                statusCode: 404,
                message: 'User does not exist with this email.',
            })
        }

        // create jwt token
        const token = createJsonWebToken({email}, jwtResetPasswordKey, "3d");

        // prepare email
        const emailData = {
            email: email,
            subject: 'Reset password Email',
            body: `
            <h2>Hello ${userData.name}</h2>
            <p>Please click here to this<a href="${clientUrl}/api/user/reset-password/${token}" target="_blank"> link </a> to verify the email.</p>
            `
        }

        try {
            await sendWithNodemailer(emailData);
        } catch (error) {
            console.error(error);
        }
        return successResponseController(res, {
            statusCode: 200,
            message: 'Please go to your email address for reset yor password',
            payload: {
                token
            }
        })


    } catch (error) {
        console.log(error)
    }
}

const handleResetPassword = async(req, res) => {
    try {

        const {token, newPassword, confirmPassword} = req.body;

        const decode = jwt.verify(token, jwtResetPasswordKey);

        if(!decode){
            return errorResponseController(res, {
                statusCode: 400,
                message: 'Invalid or expired Token.',
            })
        }

        if(newPassword !== confirmPassword){
            return errorResponseController(res, {
                statusCode: 401,
                message: 'New password and confirm password do not match. Please try again',
            })
        }

        // const updates = {$set : {password: newPassword}};

        const updateOptions = { new: true };

        const updatedUser = await User.findByIdAndUpdate(decode._id, {password: newPassword}, updateOptions).select('-password');
        if(!updatedUser) {
            return errorResponseController(res, {
                statusCode: 400,
                message: 'User does not exist with this ID.',
            })
        }


        return successResponseController(res, {
            statusCode: 200,
            message: 'User updated successfully',
            payload: {
                updatedUser
            }
        })

        console.log("here");
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getFilteredUsers,
    getUserByID,
    deleteUserById,
    updateUserById,
    baneUserById,
    updatePasswordById,
    handleForgetPassword,
    handleResetPassword
}