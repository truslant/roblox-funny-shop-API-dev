const express = require('express');
const router = express.Router();
const { Product } = require('../../db/database').models
const { authCheck, routeErrorsScript } = require('../utilities/utilities');
const logger = require('../utilities/logger')


router.get('/allProducts', authCheck, async (req, res, next) => {
    try {
        const products = await Product.findAll({});
        res.status(200).json(products)
    } catch (error) {
        const errMsg = 'Error while retreiving list of all products.';
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
});

router.get('/product', authCheck, async (req, res, next) => {
    const { productId } = req.body;

    try {
        const product = await Product.findByPk(productId)
        if (!product) {
            logger.info(`No product with ID ${productId} found in the DB at "${req.path}"`)
            res.status(404).json({ msg: `No product with ID ${productId} found in the DB` });
            return;
        }
        res.status(200).json(product)
    } catch (error) {
        const errMsg = `Error occured while retreiving the product ${productId} from DB at route "${req.path}"`
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
});

module.exports = router;