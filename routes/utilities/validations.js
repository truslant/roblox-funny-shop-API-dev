const { body, param } = require('express-validator');
const { validProductCategories } = require('../../variables/projectwideVariables')
const { validCategoriesToString } = require('../utilities/generalUtilities');

const bodyOrderIdValidator = () =>
    body('orderId')
        .notEmpty().withMessage('Order ID cannot be empty')
        .isInt({ min: 1 }).withMessage('Order ID must be a number (min:1)')

const bodyProductIdValidator = () =>
    body('productId')
        .notEmpty().withMessage('Product ID cannot be empty')
        .isInt({ min: 1 }).withMessage('Product ID must be a number (min:1)')

const paramOrderIdValidator = () =>
    param('orderId')
        .notEmpty().withMessage('Order ID cannot be empty')
        .isInt({ min: 1 }).withMessage('Order ID must be a number (min:1)')

const bodyProductNameValidateor = () =>
    body('name')
        .notEmpty().withMessage('Name field cannot be empty')

const bodyProductDescriptionValidateor = () =>
    body('description')
        .notEmpty().withMessage('Description cannot be empty')

const bodyProductPriceValidateor = () =>
    body('price')
        .notEmpty().withMessage('Price cannot be empty')
        .isNumeric().withMessage('Price must be a number')

const bodyProductCategoryValidateor = () =>
    body('category')
        .notEmpty().withMessage('Category cannot be empty')
        .isIn(validProductCategories).withMessage(value => `Category "${value}" is not valid, please choose from: ${validCategoriesToString(validProductCategories)}`)

module.exports = {
    bodyOrderIdValidator,
    bodyProductIdValidator,
    paramOrderIdValidator,
    bodyProductNameValidateor,
    bodyProductDescriptionValidateor,
    bodyProductPriceValidateor,
    bodyProductCategoryValidateor,
}