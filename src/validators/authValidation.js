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
    .withMessage("Password should be 8 characters or more")
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

const userLoginValidator = [
  body('email')
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
    .withMessage("Password should be 8 characters or more")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-@$!%*?&])[A-Za-z\d-@$!%*?&]{8,}$/)
    .withMessage("Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"),
]


const passwordChangeValidator = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is required")
    .isLength({ min: 8 })
    .withMessage("Old Password should be 8 characters or more"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 8 })
    .withMessage("New password should be 8 characters or more")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-@$!%*?&])[A-Za-z\d-@$!%*?&]{8,}$/)
    .withMessage("Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"),
  body('confirmPassword').custom((value, {req}) => {
    if(value !== req.body.newPassword) {
      console.log('Passwords do not match')
    }
    return true
  })
]

const forgetPasswordValidators = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
]

const resetPasswordValidators = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage("Token is missing or invalid"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 8 })
    .withMessage("New password should be 8 characters or more")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-@$!%*?&])[A-Za-z\d-@$!%*?&]{8,}$/)
    .withMessage("Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"),
  body('confirmPassword').custom((value, {req}) => {
    if(value !== req.body.newPassword) {
      console.log('Confirm password and new password must be same');
    }
    return true
  })
]

module.exports = {
  validateUserRegistration,
  userLoginValidator,
  passwordChangeValidator,
  forgetPasswordValidators,
  resetPasswordValidators
};
