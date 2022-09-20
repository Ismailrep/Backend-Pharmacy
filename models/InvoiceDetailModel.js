import sequelize from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";

const { DataTypes } = sequelize;

const InvoiceDetail = db.define("invoice_detail", {
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

InvoiceDetail.belongsTo(Products, {
  foreignKey: "product_id",
  targetKey: "id",
});

export default InvoiceDetail;
