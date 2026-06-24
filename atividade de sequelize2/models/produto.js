const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Produto = sequelize.define(
    "Produto",
    {
        nome: {
            type: DataTypes.STRING
        },

        preco: {
            type: DataTypes.FLOAT
        }
    }
);

module.exports = Produto;