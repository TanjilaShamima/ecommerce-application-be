const {validationResult} = require('express-validator');
const { errorResponseController } = require('../controllers/responseController');

const runValidation = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponseController(res, {
                statusCode: 422,
                message: errors.array()[0].msg
            })
            // console.log(errors)
        }
        next();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    runValidation
}