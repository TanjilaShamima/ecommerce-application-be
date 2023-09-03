const errorResponseController  = (res, {statusCode = 500, message = "Internal server error"}) => {
    return res.status(statusCode).json({
        success: false,
        message: message
    })
}

const successResponseController = (res, {statusCode = 200, message = "Success", payload={}}) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        payload: payload
    })
}

module.exports = {
    errorResponseController,
    successResponseController
}
