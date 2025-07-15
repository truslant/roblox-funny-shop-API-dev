const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');
const createError = require('http-errors');
const { param, body } = require('express-validator')

const { sequelize } = require('../../db/database');

const { User, Product, Order } = require('../../db/database').models;

const {
    authCheck,
    routeErrorsScript,
    validationErrorsOutputScript } = require('../utilities/generalUtilities');

const { retreiveUserCart } = require('../utilities/modelUtilities');

router.get('/', authCheck, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        const orders = await user.getOrders({
            include: [{
                model: Product,
                through: {
                    attributes: ['qty']
                }
            }]
        });

        if (!orders) {
            return next(createError(204, `There are no orders made yet for user with ID ${req.user.id}`));
        }

        res.status(200).json(orders);

    } catch (error) {
        const errMsg = 'Error fetching orders.';
        return next(routeErrorsScript(error, errMsg));
    }
});

router.get('/order/:orderId', authCheck,
    [
        param('orderId')
            .notEmpty().withMessage('Order ID cannot be empty')
            .isInt({ min: 1 }).withMessage('Order ID must be a number (min:1)')
    ],
    async (req, res, next) => {

        const { orderId } = req.params;

        validationErrorsOutputScript(req)

        try {
            const order = await Order.findOne({
                where: {
                    userid: req.user.id,
                    id: orderId
                },
                include: {
                    model: Product,
                    through: {
                        attributes: ['qty']
                    }
                }
            });
            if (!order) {
                return next(createError(404, `There are no orders made with ID ${orderId}.`));
            }
            res.status(200).json(order)

        } catch (error) {
            const errMsg = `Error fetching order with ID ${orderId}`;
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.post('/cartToOrder', authCheck, async (req, res, next) => {
    try {
        const { cart, user } = await retreiveUserCart(req);

        if (cart.Products.length < 1) {
            return next(createError(400, `No products found in the Cart ID ${cart.id}`));
        }

        const transaction = await sequelize.transaction();

        const order = await user.createOrder({ transaction });

        const cartItems = cart.Products;
        const throughData = cart.Products.map(product => {
            return {
                qty: product.CartsProducts.qty
            }
        })

        await order.addProducts(cartItems, {
            through: throughData,
            transaction
        })

        await transaction.commit();

        res.redirect(`/orders/order/${order.id}`);
    } catch (error) {
        const errMsg = 'Error during order creation.';
        return next(routeErrorsScript(error, errMsg));
    }
});

module.exports = router;