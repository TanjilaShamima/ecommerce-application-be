const { body } = require("express-validator");
const { errorResponseController } = require("../controllers/responseController");

// registration validations
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 31 })
    .withMessage("name should be between 3 and 31 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("name should be 8 characters or more")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-@$!%*?&])[A-Za-z\d-@$!%*?&]{8,}$/)
    .withMessage("Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"),

  body("address").trim().notEmpty().withMessage("Address is required"),

  body("phone").trim().notEmpty().withMessage("Phone is required"),
  // body("image").optional().isString().withMessage("Image must be string"),
  body("image")
  .custom((value, {req}) => {
    if(!req.file || !req.file.buffer){
        throw new Error('User image is required');
    }
    return true;
  })
  .withMessage("User image is required")

]

// login validations

module.exports = {
  validateUserRegistration,
};
