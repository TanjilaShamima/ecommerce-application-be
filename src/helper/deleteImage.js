const fs = require('fs').promises;

const deleteImage = async (userImagePath) => {
    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        console.log('User image was deleted successfully');

    } catch (error) {
        console.error('Image is not exist.', err);
    }
}

// fs.access(userImagePath, (err) => {
//     if(err){
//         console.error(err);
//     } else {
//         fs.unlink(userImagePath, (err) => {
//             if(err){
//                 throw err;
//             }
//             console.log('User image was deleted successfully');
//         });
//     }
// })

// fs.access(userImagePath)
//     .then(() => {
//         fs.unlink(userImagePath);
//     })
//     .then(() => {
//         console.log('User image was deleted successfully');
//     })
//     .catch(err => {
//         console.error('Image is not exist.', err);
//     })

module.exports = {
    deleteImage
}