const { body, param, check } = require('express-validator');
const { validProductCategories } = require('../../variables/projectwideVariables')
const { validCategoriesToString } = require('../utilities/generalUtilities');

//to be replaced by anyFieldIdValidator
// const bodyOrderIdValidator = () =>
//     body('orderId')
//         .notEmpty().withMessage('Order ID cannot be empty')
//         .isInt({ min: 1 }).withMessage('Order ID must be a number (min:1)')

//to be replaced by anyFieldIdValidator
// const bodyProductIdValidator = () =>
//     body('productId')
//         .notEmpty().withMessage('Product ID cannot be empty')
//         .isInt({ min: 1 }).withMessage('Product ID must be a number (min:1)')

//to be replaced by anyFieldIdValidator
// const paramOrderIdValidator = () =>
//     param('orderId')
//         .notEmpty().withMessage('Order ID cannot be empty')
//         .isInt({ min: 1 }).withMessage('Order ID must be a number (min:1)')

// to be replaced by bodyAnyNameValidator
// const bodyProductNameValidateor = () =>
//     body('name')
//         .notEmpty().withMessage('Name field cannot be empty')

// to be replaced by bodyAnyNameValidator
// const bodyProductDescriptionValidateor = () =>
//     body('description')
//         .notEmpty().withMessage('Description cannot be empty')

//to be replaced by bodyAnyEnumValidateor
// const bodyProductCategoryValidateor = () =>
//     body('category')
//         .notEmpty().withMessage('Category cannot be empty')
//         .isIn(validProductCategories).withMessage(value => `Category "${value}" is not valid, please choose from: ${validCategoriesToString(validProductCategories)}`)

//to be replaced by anyFieldIdValidator
// const bodyFieldIdValidator = (fieldId) =>
//     body(fieldId)
//         .notEmpty().withMessage(`${fieldId} cannot be empty`)
//         .isInt({ min: 1 }).withMessage(`${fieldId} must be a number (min:1)`)

//needed
const bodyProductPriceValidateor = () =>
    body('price')
        .notEmpty().withMessage('Price cannot be empty')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => value >= 0).withMessage('Negative price indicated. Minimal price is 0')


//==============================================================================



//needed
const anyFieldIdValidator = (fieldId) =>
    check(fieldId)
        .notEmpty().withMessage(`${fieldId} cannot be empty`)
        .isInt({ min: 1 }).withMessage(`${fieldId} must be a number (min:1)`)
//needed
const bodyAnyNameValidator = (anyNameField) =>
    body(anyNameField)
        .notEmpty().withMessage(`${anyNameField} cannot be empty`)

//replace with anyPasswordValidator
// const bodyUserPasswordValidator = () =>
//     body('password')
//         .notEmpty().withMessage(`Password cannot be empty`)
//         .isStrongPassword().withMessage('Weak password, please consider at least 8 charachters, at least 1 lower case and one uppercase letters, at least one number and at least 1 special character.')

const anyPasswordValidator = (fieldName) =>
    check(fieldName)
        .notEmpty().withMessage(`${fieldName} cannot be empty`)
        .isStrongPassword().withMessage(`Weak ${fieldName}, please consider at least 8 charachters, at least 1 lower case and one uppercase letters, at least one number and at least 1 special character.`)

const bodyUserPasswordCheckValidator = () =>
    body('passwordCheck')
        .notEmpty().withMessage(`Confirm Password cannot be empty`)
        .custom((password, { req }) => password === req.body.password).withMessage('Password & Confirm password do not match')
//needed
const bodyUserEmailValidator = () =>
    body('email')
        .notEmpty().withMessage(`Email cannot be empty`)
        .trim().normalizeEmail()
        .isEmail().withMessage(`Email must be an valid email address`)
//needed
const anyEnumValidateor = (fieldName, enumArray) =>
    check(fieldName)
        .notEmpty().withMessage(`${fieldName} cannot be empty`)
        .isIn(enumArray).withMessage(value => `${fieldName} "${value}" is not valid, please choose from: ${validCategoriesToString(enumArray)}`)

module.exports = {
    // bodyOrderIdValidator,
    // paramOrderIdValidator,
    // bodyProductIdValidator,
    // bodyProductNameValidateor,
    // bodyProductDescriptionValidateor,
    bodyProductPriceValidateor,
    // bodyProductCategoryValidateor,
    // bodyFieldIdValidator,
    anyFieldIdValidator,
    // bodyUserPasswordValidator,
    bodyUserPasswordCheckValidator,
    bodyUserEmailValidator,
    bodyAnyNameValidator,
    anyEnumValidateor,
    anyPasswordValidator,
}