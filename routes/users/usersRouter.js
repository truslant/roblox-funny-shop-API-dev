const express = require('express');
const router = express.Router();

const { models, sequelize } = require('../../db/database');


router.get('/', async (req, res, next) => {
    const user = await models.User.findOne({
        where: {
            userid: 1
        }
    });

    console.log('User.findAll output: ', user);

    const orders = user.getOrders();

    console.log('user.getOrders: ', orders);

    const fullOrders = user.getOrders({ include: ['products'] });

    console.log(`user.getOrders({ include: ['products'] }): `, fullOrders);

    res.json(user[0]);
})

module.exports = router;