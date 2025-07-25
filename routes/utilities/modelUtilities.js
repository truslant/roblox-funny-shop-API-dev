const { Product, User, Order } = require('../../db/database').models
const createError = require('http-errors')

const isAdmin = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        next(createError(401, 'You must be authenticated to access this page'))
    }
    if (req.user.status !== 'admin') {
        next(createError(403, 'This page requires Admin access level'))
    }
    next()
}

const retreiveUserCart = async (req) => {

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

const retreiveOrderWithProductsById = async (orderId) => {

    const order = await Order.findOne(
        {
            where: { id: orderId },
            include: [
                {
                    model: Product,
                    through: {
                        attributes: ['qty']
                    }
                }
            ]
        }
    );

    if (!order) {
        throw createError(404, `No order found with the ID ${orderId}`);
    }
    return order
}

const incrementOrAddProduct = async (product, container, productId, JointTableModelName) => {

    let curQty = 0;

    const targetProduct = container.Products.find(curProduct => curProduct.id == productId)

    curQty = targetProduct ? targetProduct[JointTableModelName].qty + 1 : 1

    console.log("curQty:", curQty)

    await container.addProduct(product,
        {
            through: {
                qty: curQty
            }
        }
    )
}

const reduceOrRemoveProduct = async (
    product, container,
    productId,
    JointTableModel,
    targetIdColumnName
) => {

    console.log('ReduceRemoveProduct function triggered');

    const targetProduct = container.Products.find(product => productId == product.id)

    if (!targetProduct) {
        throw createError(404, `No product with ID ${productId} found in the ${container.constructor.name} ID ${container.id}`)
    }

    let curQty = targetProduct[JointTableModel.name].qty || 0;

    if (!curQty) {
        throw createError(404, `No product with product ID# ${productId} found in the ${JointTableModel.name}`);
    }

    curQty--;

    console.log('curQty:', curQty);
    if (curQty < 1) {
        await container.removeProduct(product)
    } else {
        await JointTableModel.update(
            {
                qty: curQty
            },
            {
                where:
                {
                    [targetIdColumnName]: container.id,
                    productid: productId
                }
            }
        )
    }
};


const modelInstanceExistanceCheck = async (instaceId, Model) => {

    const instance = await Model.findByPk(instaceId);
    if (!instance) {
        throw createError(404, `No matching ${Model.name} found in DB for ID: ${instaceId}`);
    }
    return instance;
}

module.exports = {
    isAdmin,
    retreiveUserCart,
    retreiveOrderWithProductsById,
    incrementOrAddProduct,
    reduceOrRemoveProduct,
    modelInstanceExistanceCheck
};
