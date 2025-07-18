const { body, check } = require('express-validator');
const { validCategoriesToString } = require('../utilities/generalUtilities');

const bodyProductPriceValidateor = () =>
    body('price')
        .notEmpty().withMessage('Price cannot be empty')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => value >= 0).withMessage('Negative price indicated. Minimal price is 0')

const anyFieldIdValidator = (fieldId) =>
    check(fieldId)
        .notEmpty().withMessage(`${fieldId} cannot be empty`)
        .isInt({ min: 1 }).withMessage(`${fieldId} must be a number (min:1)`)

const bodyAnyNameValidator = (anyNameField) =>
    body(anyNameField)
        .notEmpty().withMessage(`${anyNameField} cannot be empty`)

const anyPasswordValidator = (fieldName) =>
    check(fieldName)
        .notEmpty().withMessage(`${fieldName} cannot be empty`)
        .isStrongPassword().withMessage(`Weak ${fieldName}, please consider at least 8 charachters, at least 1 lower case and one uppercase letters, at least one number and at least 1 special character.`)

const bodyUserPasswordCheckValidator = () =>
    body('passwordCheck')
        .notEmpty().withMessage(`Confirm Password cannot be empty`)
        .custom((password, { req }) => password === req.body.password).withMessage('Password & Confirm password do not match')

const bodyUserEmailValidator = () =>
    body('email')
        .notEmpty().withMessage(`Email cannot be empty`)
        .trim().normalizeEmail()
        .isEmail().withMessage(`Email must be an valid email address`)

const anyEnumValidateor = (fieldName, enumArray) =>
    check(fieldName)
        .notEmpty().withMessage(`${fieldName} cannot be empty`)
        .isIn(enumArray).withMessage(value => `${fieldName} "${value}" is not valid, please choose from: ${validCategoriesToString(enumArray)}`)

module.exports = {
    bodyProductPriceValidateor,
    anyFieldIdValidator,
    bodyUserPasswordCheckValidator,
    bodyUserEmailValidator,
    bodyAnyNameValidator,
    anyEnumValidateor,
    anyPasswordValidator,
}