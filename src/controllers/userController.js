const User = require("../models/userModel");



/************************Get User By limit, page no, search value**********************************/

const getFilteredUsers = async(req, res) => {
    try {
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegex = new RegExp('.*' + search + '.*', 'i'); // regex pattern to match search parameters in the query string and it will be case insensitive

        const filter = {
            isAdmin: {$ne : true}, // filter not admin users only
            $or : [
                {name: {$regex: searchRegex}},
                {email: {$regex: searchRegex}},
                {phone: {$regex: searchRegex}}
            ]
        }

        const options = {password: 0}; // hide password from the filtered values

        const users = await User.find(filter, options).limit(limit).skip((page-1) * limit); // set limit to the page  and skip the previous page data

        const totalUsers = await User.find(filter).countDocuments(); // count total documents

        if(users.length){
            const updateUsers = {password, ...users};
            res.status(200).send({
                message: 'Success',
                users: updateUsers.users,
                pagination: {
                    totalPages: Math.ceil(totalUsers / limit),
                    currentPage: page,
                    previousPage: page -1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(totalUsers / limit) ? page + 1 : null
                }
            })
        } else {
            res.status(404).send({
                message: 'No users found'
            })
        }
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getFilteredUsers
}