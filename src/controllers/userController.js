const mongoose = require("mongoose");
const User = require("../models/userModel");
const {
    successResponseController,
    errorResponseController
} = require("./responseController");
const { findItemByID } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
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

        const userImagePath = user?.image;
        
        await deleteImage(userImagePath);

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

const updateUserById = () => {

}

module.exports = {
    getFilteredUsers,
    getUserByID,
    deleteUserById,
    updateUserById
}