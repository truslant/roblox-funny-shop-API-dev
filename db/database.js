const Sequelize = require('sequelize').Sequelize;

const getUserModel = require('./models/UserModel');
const getCartModel = require('./models/CartModel');
const getOrderModel = require('./models/OrderModel');
const getProductModel = require('./models/ProductModel');
const getCartsProductsModel = require('./models/CartsProductsModel');
const getOrdersProductsModel = require('./models/OrdersProductsModel');
const associationsConfig = require('./associationsConfig');

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
models.Order = getOrderModel(sequelize, Sequelize);
models.Product = getProductModel(sequelize, Sequelize);
models.CartsProducts = getCartsProductsModel(sequelize, Sequelize);
models.OrdersProducts = getOrdersProductsModel(sequelize, Sequelize);

console.log(`Buidling associations...`);
associationsConfig.forEach(associationInstance => {
    const {
        sourceModelName,
        targetModelName,
        association,
        options } = associationInstance;

    const sourceModel = models[sourceModelName];

    const targetModel = models[targetModelName];
    // console.log('Source model: ', sourceModel);
    // console.log('Target model: ', targetModel);


    if (sourceModel) {
        switch (association) {
            case 'hasOne':
                // console.log(`${sourceModelName}.hasOne(${targetModelName}...) association initialization...`)
                sourceModel.hasOne(targetModel, options);
                // console.log('Successful!!!')
                break;
            case 'belongsTo':
                // console.log(`${sourceModelName}.belongsTo(${targetModelName}...) association initialization...`)
                sourceModel.belongsTo(targetModel, options);
                // console.log('Successful!!!');
                break;
            case 'hasMany':
                // console.log(`${sourceModelName}.hasMany(${targetModelName}...) association initialization...`);
                sourceModel.hasMany(targetModel, options);
                // console.log('Successful!!!');
                break;
            case 'belongsToMany':
                // console.log(`${sourceModelName}.belongsToMany(${targetModelName}...) association initialization...`);
                sourceModel.belongsToMany(targetModel, options);
                // console.log('Successful!!!');
                break;
        }
    }
});
console.log(`Associations built successfully`);

module.exports = { sequelize, models }

