import sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = sequelize;

const Category = db.define("categories", {
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Category;
