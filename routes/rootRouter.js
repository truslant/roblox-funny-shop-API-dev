const express = require('express');
const router = express.Router();

const userRouter = require('./users/usersRouter');

router.get('/', (req, res, next) => {
    res.json(req.session)
});

router.use('/users', userRouter);

module.exports = router;