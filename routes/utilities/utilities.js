const createError = require('http-errors')
const { User, Product } = require('../../db/database').models
const logger = require('../utilities/logger');

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

const routeErrorsScript = (next, error, statusCode, errMsg = 'Error occured') => {
    if (error.name === 'SequelizeValidationError') {
        logger.error(`Sequelize validation error: ${errMsg}`, { error })
        res.status(400).json({ msg: 'Validation error' });
        return;
    }

    next(createError(statusCode, errMsg));
}

const retreiveAllProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll({});
        res.status(200).json(products)
    } catch (error) {
        const errMsg = 'Error while retreiving list of all products.';
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
}

const validCategory = ['general', 'outerwear', 'pants', 'skirts', 'headwear', 'accessories', 'shoes']

const validCategoryString = (validCategoryArray) => (
    validCategoryArray.reduce((accum, curvalue, index) => {
        if (index < validCategoryArray.length - 1) {
            return `'${accum}', '${curvalue}', `
        } else {
            return `'${accum}', '${curvalue}'`
        }
    })
)

module.exports = { authCheck, isAdmin, modelMethodsDisplay, retreiveUserCart, routeErrorsScript, retreiveAllProducts, validCategory, validCategoryString };