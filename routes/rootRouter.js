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
        const status = err.status || 500;
        const stackLog = status >= 500 ? err.stack : "unnecessary"

        // if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        //     err.message = 'Invalid JSON input';
        //     err.status = 400;
        // }


        logger.error({
            status,
            message: err.message,
            details: err.details || "Not available",
            stack: stackLog || "Not available",
            path: req.path || "Not available",
            userId: req.user ? req.user.id : 'unauthenticated',
            method: req.method || "Not available",
            clientIp: req.ip || "Not available",
            userAgent: req.header['user-agent'] || "Not available",
            params: req.params || "Not available",
            query: req.query || "Not available"
        });

        res.status(err.status || 500).json({
            error: err.message || 'Internal server error',
            details: err.details || 'Not available'
        })

    }
)

module.exports = router;