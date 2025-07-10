const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');

const { Product } = require('../../db/database').models

const { isAdmin } = require('../utilities/utilities')

router.get('/allProducts', isAdmin, async (req, res, next) => {
    try {
        const products = await Product.findAll({});
        res.status(200).json(products)
    } catch (error) {
        const errMsg = 'Error while retreiving list of all products.';
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
});

router.post('/addProduct', isAdmin, async (req, res, next) => {
    try {
        const { name, description, price } = req.body;
        const newProduct = await Product.create({
            name, description, price
        })
        res.status(201).json(newProduct)
    } catch (error) {
        const errMsg = 'Error occured while adding a new product to DB.';
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }

});

router.delete('/removeProduct', isAdmin, async (req, res, next) => {
    try {
        const { productId } = req.body;
        const deletedProduct = Product.destroy({ where: { id: productId } });
        if (!deletedProduct) {
            logger.info(`No product with ID ${productId} found in the DB at "${req.path}"`)
            res.status(404).json({ msg: `No product with ID ${productId} found in the DB` });
            return;
        }
        res.status(200).json({ msg: `Product with ID # ${productId} deleted successfully!` })
    } catch (error) {
        const errMsg = 'Error occured while deleting the product from DB'
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
});

router.put('/editProduct', isAdmin, async (req, res, next) => {

    try {
        const { productId, name, description, price } = req.body;
        const curProduct = await Product.update(
            { name, description, price },
            { where: { id: productId } }
        );
        if (!curProduct) {
            logger.info(`No product with ID ${id} found in the DB at ${req.path} by user id ${req.user.id}`)
            res.status(404).json({ msg: `No product with ID ${id} found in the DB` })
            return
        }
        const editedProduct = await Product.findByPk(productId);
        res.status(200).json(editedProduct)
    } catch (error) {
        const errMsg = 'Error occured while updating the product.'
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
});

module.exports = router;