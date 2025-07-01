const express = require('express');
const router = express.Router();

const { models, sequelize } = require('../../db/database');


router.get('/', async (req, res, next) => {
    const user = await models.User.findAll({
        where: {
            id: 1
        }
    });
    res.json(user[0]);
})

module.exports = router;