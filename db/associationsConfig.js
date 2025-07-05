const associationsConfig = [
    {
        sourceModelName: 'User',
        targetModelName: 'Cart',
        association: 'hasOne',
        options: {
            foreignKey: 'userid',
            onDelete: 'CASCADE',
        }
    },
    {
        sourceModelName: 'Cart',
        targetModelName: 'User',
        association: 'belongsTo',
        options: {
            foreignKey: 'userid',
            onDelete: 'CASCADE',
        }
    },
    {
        sourceModelName: 'User',
        targetModelName: 'Order',
        association: 'hasMany',
        options: {
            foreignKey: 'userid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'Order',
        targetModelName: 'User',
        association: 'belongsTo',
        options: {
            foreignKey: 'userid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'Product',
        targetModelName: 'Cart',
        association: 'belongsToMany',
        options: {
            through: 'CartsProducts',
            foreignKey: 'productid',
            otherKey: 'cartid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'Order',
        targetModelName: 'Product',
        association: 'belongsToMany',
        options: {
            through: 'OrdersProducts',
            foreignKey: 'orderid',
            otherKey: 'productid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'Product',
        targetModelName: 'Order',
        association: 'belongsToMany',
        options: {
            through: 'OrdersProducts',
            foreignKey: 'productid',
            otherKey: 'orderid',
            onDelete: 'CASCADE'
        }
    },
    {
        sourceModelName: 'Cart',
        targetModelName: 'Product',
        association: 'belongsToMany',
        options: {
            through: 'CartsProducts',
            foreignKey: 'cartid',
            otherKey: 'productid',
            onDelete: 'CASCADE'
        }
    },
]

module.exports = associationsConfig;