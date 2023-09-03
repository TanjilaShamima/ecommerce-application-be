const {
    default: mongoose
} = require("mongoose");
const User = require("../models/userModel");

const findItemByID = async (id, option = {}) => {
    try {
        const item = await User.findById(id, option);

        if (!item) {
            return errorResponseController(res, {
                statusCode: 404,
                message: 'No item found'
            })
        } else {
            return item;
        }
    } catch (error) {
        if (error instanceof mongoose.Error) {
            return errorResponseController(res, {
                statusCode: 400,
                message: 'Invalid item ID',
            })
        } else {
            return errorResponseController(res, {
                statusCode: error.statusCode,
                message: error.message,
            })
        }
    }
}

module.exports = {
    findItemByID
}