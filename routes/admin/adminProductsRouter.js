const express = require('express');
const router = express.Router();
const createError = require('http-errors')

const { Product } = require('../../db/database').models;

const { isAdmin,
    modelInstanceExistanceCheck, } = require('../utilities/modelUtilities');


const { validProductCategories } = require('../../variables/projectwideVariables')

const {
    routeErrorsScript,
    validationErrorsOutputScript,
    updateOutputObjectGen } = require('../utilities/generalUtilities');

const {
    bodyProductPriceValidateor,
    anyFieldIdValidator,
    bodyAnyNameValidator,
    anyEnumValidateor,
} = require('../utilities/validations')


router.post('/addProduct', isAdmin,
    [
        bodyAnyNameValidator('name'),
        bodyAnyNameValidator('description'),
        bodyProductPriceValidateor(),
        anyEnumValidateor('category', validProductCategories),
    ],
    async (req, res, next) => {
        try {

            const { name, description, price, category } = req.body;

            validationErrorsOutputScript(req)

            const inputObject = { name, description, price, category }


            const newProduct = await Product.create(inputObject);
            res.status(201).json(newProduct)
        } catch (error) {
            const errMsg = 'Error occured while adding a new product to DB.';
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.delete('/removeProduct', isAdmin,
    [
        anyFieldIdValidator('productId')
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
        anyFieldIdValidator('productId'),
        bodyAnyNameValidator('name').optional({ values: 'falsy' }),
        bodyAnyNameValidator('description').optional({ values: 'falsy' }),
        bodyProductPriceValidateor()
            .optional({ values: 'null' }),
        anyEnumValidateor('category', validProductCategories).optional({ values: 'falsy' }),
    ],

    async (req, res, next) => {

        const { productId, name, description, price, category } = req.body;
        validationErrorsOutputScript(req);

        try {

            const product = await modelInstanceExistanceCheck(productId, Product);

            const inputObject = { name, description, price, category };

            const outputObject = updateOutputObjectGen(inputObject)

            await product.update(outputObject);

            res.redirect(`/products/product/${productId}`)
        } catch (error) {
            const errMsg = 'Error occurred while updating the product.'
            return next(routeErrorsScript(error, errMsg));
        }
    });

module.exports = router;