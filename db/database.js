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

const models = {User, Cart}

const associations = {
    User:{
        hasOne: 'Cart',
        options: {onDelete:'CASCADE' }
    },
    Cart:{
        belongsTo: 'User',
        options: {onDelete: 'CASCADE', foreignKey: 'userid'}
    }
}

Object.keys(models).forEach(modelName=>{
    

    // associations[modelName]



});


