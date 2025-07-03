const getOrdersProducts = (sequelize, { DataTypes }) => {
    const OrdersProducts = sequelize.define('OrdersProducts',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            orderid: {
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
                    min: 1,
                }
            },
        },
        {
            tableName: 'orders_products',
            timestamps: false,
        }
    )
    return OrdersProducts;
}

module.exports = getOrdersProducts;