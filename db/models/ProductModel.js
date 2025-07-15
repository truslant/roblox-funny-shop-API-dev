const { validProductCategories } = require('../../variables/projectwideVariables')

const getProductModel = (sequelize, { DataTypes }) => {
    const Product = sequelize.define('Product',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            category: {
                type: DataTypes.TEXT,
                allowNull: false,
                default: 'general',
                validate: {
                    notEmpty: true,
                    isIn: [validProductCategories]
                }
            }
        },
        {
            tableName: 'products',
            timestamps: false
        }
    );
    return Product;
}

module.exports = getProductModel;