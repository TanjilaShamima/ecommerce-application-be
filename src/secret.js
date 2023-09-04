const dotenv = require('dotenv');
dotenv.config();

const serverPort = process.env.PORT || 1000
const mongoDBUrl = process.env.MONGO_URL
const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || 'public/images/users/default.png'
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "Tanjila-829"
const smtpUsername = process.env.SMTP_USERNAME || ''
const smtpPassword = process.env.SMTP_PASSWORD || ''
const clientUrl = process.env.CLIENT_URL || ''
const fileUploadPath = process.env.FILE_UPLOAD_PATH || 'public/images/users'

module.exports = {
    serverPort: serverPort,
    mongoDBUrl: mongoDBUrl,
    defaultImagePath: defaultImagePath,
    jwtActivationKey: jwtActivationKey,
    smtpUsername,
    smtpPassword,
    clientUrl,
    fileUploadPath
}