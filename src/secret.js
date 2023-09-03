const dotenv = require('dotenv');
dotenv.config();

const serverPort = process.env.PORT || 1000
const mongoDBUrl = process.env.MONGO_URL
const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || 'public/images/users/default.png'

module.exports = {
    serverPort: serverPort,
    mongoDBUrl: mongoDBUrl,
    defaultImagePath: defaultImagePath
}