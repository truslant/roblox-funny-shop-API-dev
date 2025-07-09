const { User, Product } = require('../../db/database').models

const authCheck = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ msg: 'You must be authenticated to access this page' })
        return
    }
    next();
}

const isAdmin = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ msg: 'You must be authenticated to access this page' })
        return;
    }
    const user = await User.findByPk(req.user.id);
    if (user.status !== 'admin') {
        res.status(403).json({ msg: 'This page requires Admin access level' })
        return;
    }
    next()
}

const modelMethodsDisplay = (modelInstance) => {
    console.log(`${modelInstance.constructor.name} methods`, Object.getOwnPropertyNames(Object.getPrototypeOf(modelInstance)));
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

module.exports = { authCheck, isAdmin, modelMethodsDisplay, retreiveUserCart };