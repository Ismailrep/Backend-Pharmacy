import sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = sequelize;

const Products = db.define("products", {
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  total_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit_per_bottle: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stock_bottle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Products;
