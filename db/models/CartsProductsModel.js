const getCartsProducts = (sequelize, { DataTypes }) => {
    const CartsProducts = sequelize.define('carts_products',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            cartid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
            productid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
            qty: {
                type: DataTypes.INTEGER,
                
                defaultValue: 1,
                validate: {
                    notEmpty: true,
                    min: 1
                }
            },
        },
        {
            tableName: 'carts_products',
            timestamps: false,
            uniqueKeys: {
                uniqueProductCart: {
                    fields: ['cartid', 'productid']
                }
            },
        }
    )
    return CartsProducts;
}

module.exports = getCartsProducts;