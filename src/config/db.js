const mongoose  = require('mongoose');
const { mongoDBUrl } = require('../secret');

const connectDatabase = async() => {
    try {
        await mongoose.connect(mongoDBUrl);
        console.log('DB connected successfully');

        mongoose.connection.on('error', (err)=> {
            console.log.error('DB error', err);
        })
    } catch(err){
        console.error(err);
    }
}

module.exports = connectDatabase