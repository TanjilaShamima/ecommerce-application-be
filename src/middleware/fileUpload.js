const multer = require('multer');
const path = require('path');
const {
    fileUploadPath
} = require('../secret');
const { errorResponseController } = require('../controllers/responseController');

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 1024 * 1024 * 2
const VALID_IMAGE_EXTENSIONS = process.env.VALID_IMAGE_EXTENSIONS || ['jpg', 'jpeg', 'png']

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, fileUploadPath);
    },
    filename: function (req, file, cb) {
        console.log('file', file)
        const extension = path.extname(file.originalname);
        console.log('extension',extension)
        const uniqueSuffix = Date.now() + '-' +file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file?.originalname);
    if(!VALID_IMAGE_EXTENSIONS.includes(extension.substring(1))){
        return errorResponseController( req, {
            statusCode: 400,
            message: 'Invalid image extension'
        })
    }
    cb(null, true);
}

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE},
    fileFilter
});

module.exports = upload