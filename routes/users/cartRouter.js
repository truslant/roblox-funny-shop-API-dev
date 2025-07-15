const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');
const createError = require('http-errors');

const { Product, CartsProducts } = require('../../db/database').models

const { body } = require('express-validator')

const {
    authCheck,
    routeErrorsScript,
    validationErrorsOutputScript } = require('../utilities/generalUtilities')

const {
    retreiveUserCart,
    productExistanceCheck,
    incrementOrAddProduct,
    reduceOrRemoveProduct } = require('../utilities/modelUtilities')

router.get('/', authCheck, async (req, res, next) => {
    try {
        const { cart } = await retreiveUserCart(req);
        res.status(200).json(cart);
    } catch (error) {
        const errMsg = 'Error occured while retreving cart data.'
        return next(routeErrorsScript(error, errMsg));
    }
});

router.post('/addProduct', authCheck,
    [
        body('productId')
            .notEmpty().withMessage('Product ID cannot be empty')
            .isInt({ min: 1 }).withMessage('Product ID must be a number (min:1)')
    ],
    async (req, res, next) => {

        const { productId } = req.body;

        validationErrorsOutputScript(req);

        try {
            const product = await productExistanceCheck(productId);
            const { cart } = await retreiveUserCart(req);

            incrementOrAddProduct(product, cart, productId, CartsProducts.name);

            res.redirect('/cart')
        } catch (error) {
            const errMsg = `Error occured while adding/increasing qty of the product ID ${productId} to/in the Cart.`
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.delete('/removeProduct', authCheck,
    [
        body('productId')
            .notEmpty().withMessage('Product ID cannot be empty')
            .isInt({ min: 1 }).withMessage('Product ID must be a number (min:1)')
    ],
    async (req, res, next) => {

        const { productId } = req.body;

        validationErrorsOutputScript(req);

        try {
            await productExistanceCheck(productId);

            const { cart } = await retreiveUserCart(req);

            const targetProduct = cart.Products.find(product => product.id === productId)

            if (!targetProduct) {
                return next(createError(404, `No product with ID ${productId} found in the Cart.`))
            }
            await cart.removeProduct(targetProduct);

            res.redirect('/cart')
        } catch (error) {
            const errMsg = `Error occured while deleting product with ID ${productId} from the cart.`
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.delete('/reduceProduct', authCheck,
    [
        body('productId')
            .notEmpty().withMessage('Product ID cannot be empty')
            .isInt({ min: 1 }).withMessage('Product ID must be a number (min:1)')
    ],
    async (req, res, next) => {

        const { productId } = req.body;

        try {
            const product = await productExistanceCheck(productId);

            const { cart } = await retreiveUserCart(req);

            await reduceOrRemoveProduct(product, cart, productId, CartsProducts, 'cartid');

            res.redirect('/cart')
        } catch (error) {
            const errMsg = 'Error occured while reducing the qty of the product in the cart.'
            return next(routeErrorsScript(error, errMsg));
        }
    });

module.exports = router;



