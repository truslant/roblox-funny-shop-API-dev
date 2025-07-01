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

const User = getUserModel(sequelize, Sequelize);
const Cart = getCartModel(sequelize, Sequelize);

const models = { User, Cart }

const associations = {
    User: {
        hasOne: 'Cart',
        options: { onDelete: 'CASCADE' }
    },
    Cart: {
        belongsTo: 'User',
        options: { onDelete: 'CASCADE', foreignKey: 'userid' }
    }
}

Object.keys(models).forEach(sourceModelName => {

    if (associations[sourceModelName]) {

        const targetModelName = associations[sourceModelName].hasOne
            ||
            associations[sourceModelName].hasMany
            ||
            associations[sourceModelName].belongsTo
            ||
            associations[sourceModelName].belongsToMany

        const sourceModel = models[sourceModelName];
        const targetModel = models[targetModelName];

        if (associations[sourceModelName].hasOne) {
            sourceModel.hasOne(
                targetModel,
                associations[sourceModelName].options
            );
        }
        if (associations[sourceModelName].hasMany) {
            sourceModel.hasMany(
                targetModel,
                associations[sourceModelName].options
            );
        }
        if (associations[sourceModelName].belongsTo) {
            sourceModel.belongsTo(
                targetModel,
                associations[sourceModelName].options
            )
        }
        if (associations[sourceModelName].belongsToMany) {
            sourceModel.belongsToMany(
                targetModel,
                associations[sourceModelName].options
            )
        }
    }
});

module.exports = { sequelize, models }
