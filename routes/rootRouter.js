const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const userRouter = require('./users/usersRouter');

router.get('/', async (req, res, next) => {
    // const passArray = [
    //     '12345',
    //     '67890',
    //     '111213',
    //     '54321'
    // ]

    // passArray.forEach(async (pass) => {
    //     const hashedPass = await bcrypt.hash(pass, 12)
    //     console.log(`${pass}: `, hashedPass);
    // })

    res.json({
        dir: 'User Root',
        session: req.session,
        user: req.user,
    })
});

router.use('/users', userRouter);

router.use(
    (err, req, res, next) => {
        console.log('Error: ', err);
        res.json(err);
    }
)

module.exports = router;