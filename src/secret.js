const dotenv = require('dotenv');
dotenv.config();

const serverPort = process.env.PORT || 1000
const mongoDBUrl = process.env.MONGO_URL

module.exports = {
    serverPort: serverPort,
    mongoDBUrl: mongoDBUrl
}