const express = require('express');
const router = express.Router();
const { User, Product, CartsProducts } = require('../../db/database').models

const { authCheck, retreiveUserCart } = require('../utilities/utilities')

const productExistanceCheck = async (Product, productId) => {
    const product = await Product.findByPk(productId);
    if (!product) res.send(`No matching product in DB for this product ID: ${productId}`);
    return product;
}


router.get('/', authCheck, async (req, res, next) => {
    try {
        const { cart } = await retreiveUserCart(req);
        res.status(200).json(cart);
    } catch (error) {
        next(error)
    }
});

router.post('/addProduct', authCheck, async (req, res, next) => {

    const { productId } = req.body;

    try {

        const product = await productExistanceCheck(Product, productId);

        const { cart } = await retreiveUserCart(req);

        let curQty = 0;

        for (const curProduct of cart.Products) {
            if (curProduct.id === productId) {
                curQty = curProduct.CartsProducts.qty;
                break;
            }
        }

        curQty = (curQty || 0) + 1;

        await cart.addProduct(product,
            {
                through: {
                    qty: curQty
                }
            }
        )

        res.redirect('/cart')

    } catch (error) {
        next(error)
    }
});

router.delete('/removeProduct', authCheck, async (req, res, next) => {

    const { productId } = req.body;
    try {
        await productExistanceCheck(Product, productId);

        const { cart } = await retreiveUserCart(req);

        for (const product of cart.Products) {
            if (product.id == productId) {
                await cart.removeProduct(product);
                break;
            }
        }
        res.redirect('/cart')
    } catch (error) {
        next(error)
    }
});

router.delete('/reduceProduct', authCheck, async (req, res, next) => {

    const { productId } = req.body;

    try {
        const product = await productExistanceCheck(Product, productId);

        const { cart } = await retreiveUserCart(req);

        let curQty = 0;

        for (const product of cart.Products) {
            if (product.id === productId) {
                curQty = await product.CartsProducts.qty;
                break;
            }
        }

        if (curQty === 0) {
            res.send('No product in the cart with product ID: ', [productId]);
            return;
        }

        curQty--;

        if (curQty < 1) {
            await cart.removeProduct(product)
        } else {
            await CartsProducts.update({
                qty: curQty
            },
                {
                    where: {
                        cartid: cart.id,
                        productid: productId
                    }
                }
            )
        }
    } catch (error) {
        next(error)
    }

    res.redirect('/cart')

});

module.exports = router;



