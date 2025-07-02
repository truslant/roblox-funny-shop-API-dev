const getCartModel = (sequelize, { DataTypes }) => {
    const Cart = sequelize.define('cart',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
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
