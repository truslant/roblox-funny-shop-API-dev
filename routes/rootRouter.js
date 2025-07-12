const express = require('express');
const router = express.Router();
const logger = require('./utilities/logger');

const userRouter = require('./users/usersRouter');
const cartRouter = require('./users/cartRouter');
const ordersRouter = require('./users/ordersRouter');
const productsRouter = require('./users/productsRouter');
const adminProductsRouter = require('./admin/adminProductsRouter');
const adminOrdersRouter = require('./admin/adminOrdersRouter')


router.get('/', async (req, res, next) => {
    res.json({
        dir: 'User Root',
        session: req.session,
        user: req.user,
    })
});

router.use('/users', userRouter);
router.use('/cart', cartRouter);
router.use('/orders', ordersRouter);
router.use('/products', productsRouter);
router.use('/admin/products', adminProductsRouter);
router.use('/admin/orders', adminOrdersRouter)


router.use(
    (err, req, res, next) => {

        logger.error(err.message, err.stack);

        res.status(err.status).json({
            msg: err.message || 'Internal server error'
        })

    }
)

module.exports = router;