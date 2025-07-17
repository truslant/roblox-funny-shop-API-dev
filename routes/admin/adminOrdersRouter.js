const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');
const createError = require('http-errors')

const { Order, Product, OrdersProducts } = require('../../db/database').models;

const { routeErrorsScript,
    validationErrorsOutputScript } = require('../utilities/generalUtilities');

const {
    isAdmin,
    retreiveOrderWithProductsById,
    incrementOrAddProduct,
    reduceOrRemoveProduct,
    modelInstanceExistanceCheck } = require('../utilities/modelUtilities');

const { anyFieldIdValidator } = require('../utilities/validations');



router.get('/allOrders', isAdmin,
    async (req, res, next) => {
        try {
            const orders = await Order.findAll({
                include: {
                    model: Product,
                    through: {
                        attributes: ['qty']
                    }
                }
            })

            if (!orders) {
                return next(
                    createError(404, 'No orders found in the system.')
                )
            }

            res.status(200).json(orders)

        } catch (error) {
            const errMsg = `Error occured while retreiving orders from DB`;
            return next(
                routeErrorsScript(error, errMsg)
            );
        }
    })

router.get('/order/:orderId', isAdmin,
    [
        anyFieldIdValidator('orderId'),
    ],

    async (req, res, next) => {

        const { orderId } = req.params;

        validationErrorsOutputScript(req);

        try {
            const order = await retreiveOrderWithProductsById(orderId)

            res.status(200).json(order)

        } catch (error) {
            const errMsg = `Error occured while retreiving order from DB`;
            return next(
                routeErrorsScript(error, errMsg)
            );
        }
    })

router.delete('/cancel', isAdmin,
    [
        anyFieldIdValidator('orderId'),
    ],

    async (req, res, next) => {

        const { orderId } = req.body;

        validationErrorsOutputScript(req);

        try {

            const delOrder = await Order.destroy({ where: { id: orderId } });

            if (!delOrder) {
                return next(createError(404, `No order with # ${orderId} found in the system`));
            }

            logger.info(`Order # ${orderId} was deleted successfully by user ID ${req.user.id} at ${req.path}`)

            res.status(200).json({ message: `Order # ${orderId} was deleted successfully` });
        } catch (error) {
            const errMsg = 'Error while deleting order.';
            next(routeErrorsScript(error, errMsg));
        }
    })

router.post('/addProduct', isAdmin,
    [
        anyFieldIdValidator('orderId'),
        anyFieldIdValidator('productId'),
    ],
    async (req, res, next) => {

        const { productId, orderId } = req.body;

        validationErrorsOutputScript(req);

        try {

            const product = await modelInstanceExistanceCheck(productId, Product);

            const order = await retreiveOrderWithProductsById(orderId);

            await incrementOrAddProduct(product, order, productId, OrdersProducts.name);

            res.redirect(`/orders/order/${orderId}`);

        } catch (error) {
            const errMsg = `Error occured while adding/increasing qty of the product to/in the Order ID ${orderId}`
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.delete('/removeProduct', isAdmin,
    [
        anyFieldIdValidator('orderId'),
        anyFieldIdValidator('productId'),
    ],

    async (req, res, next) => {

        const { productId, orderId } = req.body;

        validationErrorsOutputScript(req);

        try {
            await modelInstanceExistanceCheck(productId, Product);

            const order = await retreiveOrderWithProductsById(orderId);

            const targetProduct = order.Products.find(product => product.id == productId);

            if (!targetProduct) {
                return next(createError(404, `No product with # ${productId} found in the Order ID ${orderId}`));
            }

            await order.removeProduct(targetProduct);

            res.redirect(`/orders/order/${orderId}`);
        } catch (error) {
            const errMsg = 'Error occured while deleting product from the order.'
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.delete('/reduceProduct', isAdmin,
    [
        anyFieldIdValidator('orderId'),
        anyFieldIdValidator('productId'),
    ],

    async (req, res, next) => {

        const { productId, orderId } = req.body;

        validationErrorsOutputScript(req);

        try {
            const product = await modelInstanceExistanceCheck(productId, Product);

            const order = await retreiveOrderWithProductsById(orderId);

            await reduceOrRemoveProduct(product, order, productId, OrdersProducts, 'orderid');

            res.redirect(`/admin/orders/order/${orderId}`)
        } catch (error) {
            const errMsg = 'Error occured while reducing the qty of the product in the cart.'
            return next(
                routeErrorsScript(error, errMsg)
            )
        }
    });

module.exports = router;