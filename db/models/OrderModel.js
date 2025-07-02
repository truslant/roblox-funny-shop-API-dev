const getOrderModel = (sequelize, { DataTypes }) => {
    const Order = sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    },
        {
            tableName: 'orders',
            timestamps: false
        })
    return Order;
}
module.exports = getOrderModel;
