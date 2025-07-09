const express = require('express');
const router = express.Router();
const { sequelize } = require('../../db/database');

const { User, Product, Order } = require('../../db/database').models;

const { modelMethodsDisplay, authCheck, retreiveUserCart } = require('../utilities/utilities');

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
            res.send('There are no orders made yet...');
            return;
        }
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders: ', error);
        next(error);
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
        console.log('Through Data:', throughData);
        console.log('Cart items:', cartItems)

        await order.addProducts(cartItems, {
            through: throughData,
            transaction
        })

        await transaction.commit();

        res.json(order);

    } catch (error) {
        console.error('Error during order creation...')
        next(error)
    }

});

router.delete('/cancel', authCheck, async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const delOrder = await Order.destroy({ where: { id: orderId } });

        if (delOrder === 0) {
            res.render(`No order with # ${orderId} found in the system`);
            return
        }
        res.status(200).json({ msg: `Order # ${orderId} was deleted successfully` });
    } catch (error) {
        console.error(`Error while deleting order...`);
        next(error)
    }
})

module.exports = router;