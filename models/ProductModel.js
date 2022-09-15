import sequelize from "sequelize";
import db from "../config/Database.js";
import Category from "./CategoryModel.js";

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
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Products.hasOne(Category, { foreignKey: "category_id", sourceKey: "id" });
Products.belongsTo(Category, { foreignKey: "category_id", targetKey: "id" });

export default Products;
