const mongoose = require("mongoose");
const { errorResponseController } = require("../controllers/responseController");

const findItemByID = async (Model, id, option = {}) => {
    try {
        const item = await Model?.findById(id, option);

        if (item) {
            return item;

        } else {
            return errorResponseController(res, {
                statusCode: 404,
                message: `No ${Model.modelName} found`
            })
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