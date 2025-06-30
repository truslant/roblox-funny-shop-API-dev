const getCartModel = (sequelize, { DataTypes }) => {
    const Cart = sequelize.define('cart',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            userid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            }
        },
        {
            tableName: 'carts',
            timestamps: false
        }
    );

    return Cart
}

module.exports = getCartModel;
