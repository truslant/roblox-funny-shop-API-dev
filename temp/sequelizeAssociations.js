const Sequelize = require('sequelize').Sequelize;
const getUserModel = require('./models/UserModel');
const getCartModel = require('./models/CartModel');

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

const models = {
    User: getUserModel(sequelize, Sequelize),
    Cart: getCartModel(sequelize, Sequelize)
}

const associations = {
    User: {
        hasOne: 'Cart',
        options: { onDelete: 'CASCADE', foreignKey: 'userid' }
    },
    Cart: {
        belongsTo: 'User',
        options: { foreignKey: 'userid' }
    }
}

Object.keys(models).forEach(modelName => {

    const associationConfig = associations[modelName];

    if (associationConfig) {

        const targetModelName = associationConfig.hasOne || associationConfig.belongsTo || associationConfig.hasMany || associationConfig.belongsToMany

        if (associationConfig.hasOne) {
            models[modelName].hasOne(models[targetModelName], associationConfig.options)
        }

        if (associationConfig.hasMany) {
            models[modelName].hasMany(models[targetModelName], associationConfig.options)
        }
        if (associationConfig.belongsTo) {
            models[modelName].belongsTo(model[targetModelName], associationConfig.options)
        }
        if (associationConfig.belongsToMany) {
            models[modelName].belongsToMany(models[targetModelName], associationConfig.options)
        }
    }

});


module.exports = { sequelize, models };