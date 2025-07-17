const express = require('express');
const router = express.Router();

const createError = require('http-errors');

const {
    anyFieldIdValidator,
    anyEnumValidateor, } = require('../utilities/validations');

const { Product } = require('../../db/database').models

const {
    authCheck,
    routeErrorsScript,
    validationErrorsOutputScript } = require('../utilities/generalUtilities');

const { validProductCategories } = require('../../variables/projectwideVariables')

router.get('/allProducts', authCheck, async (req, res, next) => {
    try {
        const products = await Product.findAll({});
        if (products.length < 1) {
            return next(createError(404, `No products found in DB`))
        }
        res.status(200).json(products)
    } catch (error) {
        const errMsg = 'Error while retreiving list of all products.';
        return next(routeErrorsScript(error, errMsg));
    }
});

router.get('/productCategory', authCheck,
    [
        anyEnumValidateor('category', validProductCategories)
    ],
    async (req, res, next) => {

        const { category } = req.query;

        validationErrorsOutputScript(req);

        try {
            const categoryProducts = await Product.findAll(
                {
                    where: {
                        category
                    }
                }
            )

            if (categoryProducts.length < 1) {
                return next(createError(404, `No products found within the category: ${category}`));
            }

            res.status(200).json(categoryProducts)
        } catch (error) {
            const errMsg = `Error while retreiving list of products under category: "${category}"`;
            return next(routeErrorsScript(error, errMsg));
        }
    }
);

router.get('/product/:productId',
    authCheck,
    [
        anyFieldIdValidator('productId')
    ],

    async (req, res, next) => {
        const { productId } = req.params;

        validationErrorsOutputScript(req);

        try {
            const product = await Product.findByPk(productId)
            if (!product) {
                return next(
                    createError(404, `No product with ID ${productId} found in the DB`)
                );
            }
            res.status(200).json(product)
        } catch (error) {
            const errMsg = `Error occured while retreiving the product ${productId} from DB at route "${req.path}"`
            return next(routeErrorsScript(error, errMsg));
        }
    }
);

module.exports = router;