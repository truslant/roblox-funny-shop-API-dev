const express = require('express');
const router = express.Router();

const userRouter = require('./users/usersRouter');
const cartRouter = require('./users/cartRouter');
const ordersRouter = require('./users/ordersRouter');
const adminProductsRouter = require('./admin/adminProductsRouter')

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
router.use('/admin', adminProductsRouter);

router.use(
    (err, req, res, next) => {

        logger.error(err.message, err.stack);

        res.status(err.status).json({
            msg: err.message || 'Internal server error'
        })

    }
)

module.exports = router;