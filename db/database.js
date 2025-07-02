const Sequelize = require('sequelize').Sequelize;

const getUserModel = require('./models/UserModel');
const getCartModel = require('./models/CartModel');
const getProductModel = require('./models/ProductModel');
const getCartsProductsModel = require('./models/CartsProductsModel');
const getOrdersProductsModel = require('./models/OrdersProductsModel');

const db = process.env.DB;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const dialect = process.env.DIALECT;

const sequelize = new Sequelize(
    db,
    username,
    password,
    {
        dialect: dialect
    }
);

const models = {}

models.User = getUserModel(sequelize, Sequelize);
models.Cart = getCartModel(sequelize, Sequelize);
models.Product = getProductModel(sequelize, Sequelize);
models.CartsProducts = getCartsProductsModel(sequelize, Sequelize);
models.OrdersProducts = getOrdersProductsModel(sequelize, Sequelize);


const associations = [
    {
        sourceModelName: 'User',
        targetModelName: 'Cart',
        association: 'hasOne',
        options: { onDelete: 'CASCADE' }
    },
    {
        sourceModelName: 'Cart',
        targetModelName: 'User',
        association: 'belongsTo',
        options: {
            foreignKey: 'userid',
            onDelete: 'CASCADE',
        }
    },
    {
        sourceModelName: 'Cart',
        targetModelName: 'Product',
        association: 'belongsToMany',
        options: {
            through: 'CartsProducts',
            foreignKey: 'cartid',
            otherKey: 'productid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'Product',
        targetModelName: 'Cart',
        association: 'belongsToMany',
        options: {
            through: 'CartsProducts',
            foreignKey: 'productid',
            otherKey: 'cartid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'User',
        targetModelName: 'Order',
        association: 'hasMany',
        options: { onDelete: 'CASCADE' }
    },
    {
        sourceModelName: 'Order',
        targetModelName: 'User',
        association: 'belongsTo',
        options: {
            foreignKey: 'userid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'Order',
        targetModelName: 'Product',
        association: 'belongsToMany',
        options: {
            through: 'OrdersProducts',
            foreignKey: 'orderid',
            otherKey: 'productid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'Product',
        targetModelName: 'Order',
        association: 'belongsToMany',
        options: {
            through: 'OrdersProducts',
            foreignKey: 'productid',
            otherKey: 'orderid',
            onDelete: 'CASCADE'
        }
    },
]

associations.forEach(associationInstance => {
    const {
        sourceModelName,
        targetModelName,
        association,
        options } = associationInstance;

    const sourceModel = models[sourceModelName];
    const targetModel = models[targetModelName];

    if (sourceModel) {
        switch (association) {
            case 'hasOne':
                sourceModel.hasOne(targetModel, options);
                break;
            case 'belongsTo':
                sourceModel.belongsTo(targetModel, options);
                break;
            case 'hasMany':
                sourceModel.hasMany(targetModel, options);
                break;
            case 'belongsToMany':
                sourceModel.belongsToMany(targetModel, options);
                break;
        }
    }
});

module.exports = { sequelize, models }

