const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');
const createError = require('http-errors')

const { Product } = require('../../db/database').models;

const { isAdmin,
    checkProductInputForValidity,
    productExistanceCheck } = require('../utilities/modelUtilities');


const {
    validProductCategories } = require('../../variables/projectwideVariables')

const {
    validCategoriesToString,
    routeErrorsScript,
    validationErrorsOutputScript } = require('../utilities/generalUtilities');

const {
    bodyOrderIdValidator,
    bodyProductIdValidator,
    paramOrderIdValidator,
    bodyProductNameValidateor,
    bodyProductDescriptionValidateor,
    bodyProductPriceValidateor,
    bodyProductCategoryValidateor, } = require('../utilities/validations')


router.post('/addProduct', isAdmin,
    [
        bodyProductNameValidateor(),
        bodyProductDescriptionValidateor(),
        bodyProductPriceValidateor(),
        bodyProductCategoryValidateor(),
    ],
    async (req, res, next) => {
        try {

            const { name, description, price, category } = req.body;

            validationErrorsOutputScript(req)

            const inputObject = { name, description, price, category }

            checkProductInputForValidity(inputObject);

            const newProduct = await Product.create(inputObject);
            res.status(201).json(newProduct)
        } catch (error) {
            const errMsg = 'Error occured while adding a new product to DB.';
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.delete('/removeProduct', isAdmin,
    [
        bodyProductIdValidator()
    ],
    async (req, res, next) => {

        const { productId } = req.body;
        validationErrorsOutputScript(req);

        try {

            const deletedProduct = await Product.destroy({ where: { id: productId } });

            if (!deletedProduct) {
                return next(createError(404, `No product with ID ${productId} found in the DB`));
            }

            res.status(200).json({ message: `Product with ID # ${productId} deleted successfully!` })

        } catch (error) {
            const errMsg = 'Error occured while deleting the product from DB';
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.put('/editProduct', isAdmin,
    [
        bodyProductIdValidator(),
        bodyProductNameValidateor().optional({ values: 'falsy' }),
        bodyProductDescriptionValidateor().optional({ values: 'falsy' }),
        bodyProductPriceValidateor()
            .custom(value => value >= 0).withMessage('Negative price indicated. Minimal price is 0')
            .optional({ values: 'null' }),
        bodyProductCategoryValidateor().optional({ values: 'falsy' }),
    ],

    async (req, res, next) => {

        const { productId, name, description, price, category } = req.body;
        validationErrorsOutputScript(req);

        try {

            const product = await productExistanceCheck(productId);

            const inputObject = { name, description, price, category };

            const outputObject = {}

            Object.keys(inputObject).forEach(key => {
                if (inputObject[key]) {
                    outputObject[key] = inputObject[key]
                }
            })

            if (Object.keys(outputObject).length < 1) {
                return next(
                    createError(400, 'No changes for the Product indicated in request')
                );
            }

            await product.update(outputObject);

            res.redirect(`/products/product/${productId}`)
        } catch (error) {
            const errMsg = 'Error occurred while updating the product.'
            return next(routeErrorsScript(error, errMsg));
        }
    });

module.exports = router;