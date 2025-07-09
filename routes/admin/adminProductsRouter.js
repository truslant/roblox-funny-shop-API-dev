const express = require('express');
const router = express.Router();

const { Product } = require('../../db/database').models

const { isAdmin } = require('../utilities/utilities')

router.get('/allProducts', isAdmin, async (req, res, next) => {
    try {
        const products = await Product.findAll({});
        res.status(200).json(products)
    } catch (error) {
        console.error('Error while retreiving products...')
        next(error)
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
        console.error('Error occured while adding a new product');
        next(error)
    }

});

router.delete('/removeProduct', isAdmin, async (req, res, next) => {
    try {
        const { productId } = req.body;
        const deletedProduct = Product.destroy({ where: { id: productId } });
        if (!deletedProduct) {
            res.status(404).json({ msg: `No product with ID ${productId} found in the DB` });
            return;
        }
        res.status(200).json({ msg: `Product with ID # ${productId} deleted successfully!` })
    } catch (error) {
        console.error('Error occured while deleting the product from DB')
        next(error);
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
            res.status(404).json({ msg: `No product with ID ${id} found in the DB` })
            return
        }
        const editedProduct = await Product.findByPk(productId);
        res.status(200).json(editedProduct)
    } catch (error) {
        console.error('Error occured while updating the product');
        next(error)
    }
});

module.exports = router;