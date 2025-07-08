const express = require('express');
const router = express.Router();

const userRouter = require('./users/usersRouter');
const cartRouter = require('./cart/cartRouter');

router.get('/', async (req, res, next) => {
    res.json({
        dir: 'User Root',
        session: req.session,
        user: req.user,
    })
});

router.use('/users', userRouter);
router.use('/cart', cartRouter);

router.use(
    (err, req, res, next) => {
        console.log('Error: ', err);
        res.json(err);
    }
)

module.exports = router;