const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Tasks = sequelize.define("Tasks", {
        taskname: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        taskcomplete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        tasknote: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        taskduration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
      
    });


    return Tasks;
}