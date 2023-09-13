const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Lists = sequelize.define("Lists", {
        listname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    });


    Lists.associate = (models) => {
        Lists.hasMany(models.Tasks, {
            onDelete: "cascade",
        });
    };
    return Lists;
}