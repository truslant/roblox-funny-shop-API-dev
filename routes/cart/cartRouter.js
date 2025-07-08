const express = require('express');
const router = express.Router();
const { User, Product, CartsProducts } = require('../../db/database').models

const authCheck = (req, res, next) => {
    if (!req.isAuthenticated()) res.redirect('/login');
    next();
}

const productExistanceCheck = async (Product, productId) => {
    const product = await Product.findByPk(productId);
    if (!product) res.send(`No matching product in DB for this product ID: ${productId}`);
    return product;
}

const retreiveUserCart = async (req, Product) => {
    const user = await User.findByPk(req.user.id);

    const cart = await user.getCart({
        include: [
            {
                model: Product,
                through: {
                    attributes: [
                        'qty'
                    ]
                }
            }
        ]
    });

    if (!cart) await user.createCart();

    return { user, cart }
}

router.get('/', authCheck, async (req, res, next) => {
    try {
        const { cart } = await retreiveUserCart(req, Product);
        res.json(cart);
    } catch (error) {
        next(error)
    }
});

router.post('/addProduct', authCheck, async (req, res, next) => {

    const { productId } = req.body;

    try {

        const product = await productExistanceCheck(Product, productId);

        const { cart } = await retreiveUserCart(req, Product);

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

        const { cart } = await retreiveUserCart(req, Product);

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

        const { cart } = await retreiveUserCart(req, Product);

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



// console.log('User methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(user)));