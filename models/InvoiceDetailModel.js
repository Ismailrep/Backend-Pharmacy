import sequelize from "sequelize";
import db from "../config/Database.js";
import Cart from "./CartModel.js";
import InvoiceHeader from "./InvoiceHeaderModel.js";
import Products from "./ProductModel.js";

const { DataTypes } = sequelize;

const InvoiceDetail = db.define("invoice_details", {
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

InvoiceDetail.belongsTo(InvoiceHeader, {
  foreignKey: "invoice_id",
  targetKey: "invoice_id",
});

InvoiceDetail.belongsTo(Products, {
  foreignKey: "product_id",
  targetKey: "id",
});

// InvoiceDetail.belongsTo(Cart, {
//   foreignKey: "",
// });

export default InvoiceDetail;
