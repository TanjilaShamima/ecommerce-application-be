const { data } = require("../../utils/seedData");
const User = require("../models/userModel");

const seedUsers = async(req, res, next) => {
    try {
        // insert seed users
        console.log('usersData',data);
        const users = await User.insertMany(data.users);

        res.status(201).json(users); 
        
    } catch (error) {
       res.status(400).send({message: ` ${error.message}`}); 
    }
}

module.exports = {
    seedUsers: seedUsers
}