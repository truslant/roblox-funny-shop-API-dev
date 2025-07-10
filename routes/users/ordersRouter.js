const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');

const { sequelize } = require('../../db/database');

const { User, Product, Order } = require('../../db/database').models;

const { authCheck, retreiveUserCart, routeErrorsScript } = require('../utilities/utilities');

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
            logger.info(`There are no orders made yet at "${req.path}".`)
            res.status(204).json({ msg: 'There are no orders made yet.' });
            return;
        }
        res.status(200).json(orders);
    } catch (error) {
        const errMsg = 'Error fetching orders.';
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
});

router.post('/cartToOrder', authCheck, async (req, res, next) => {
    try {
        const { cart, user } = await retreiveUserCart(req);

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

        res.status(200).json(order);

    } catch (error) {
        const errMsg = 'Error during order creation.';
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }

});

router.delete('/cancel', authCheck, async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const delOrder = await Order.destroy({ where: { id: orderId } });

        if (!delOrder) {
            logger.info(`No order with # ${orderId} found in the system at "${req.path}"`);
            res.status(404).json({ msg: `No order with # ${orderId} found in the system` });
            return
        }
        logger.info(`Order # ${orderId} was deleted successfully by user ID ${req.user.id} at ${req.path}`)
        res.status(204).json({ msg: `Order # ${orderId} was deleted successfully` });
    } catch (error) {
        const errMsg = 'Error while deleting order.';
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
})

module.exports = router;