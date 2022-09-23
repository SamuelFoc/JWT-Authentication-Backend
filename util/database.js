const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlite-db", "admin-samuel", "admin-root", {
  dialect: "sqlite",
  storage: "./DB/database.sqlite",
});

module.exports = sequelize;
