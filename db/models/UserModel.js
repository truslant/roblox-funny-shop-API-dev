const getUserModel = (sequelize, { DataTypes }) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastname: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true,
            }
        }
    },
        {
            tableName: 'users',
            timestamps: false
        }
    )
    return User;
}

module.exports = getUserModel;