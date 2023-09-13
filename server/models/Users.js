const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userLog : {
            type: DataTypes.JSON,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        }

    });

    Users.associate = (models) => {
        Users.hasMany(models.Lists, {
            onDelete: "cascade",
        });
    };
    return Users;
}