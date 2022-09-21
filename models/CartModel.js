import sequelize from "sequelize";
import db from "../config/Database.js";
import InvoiceDetail from "./InvoiceDetailModel.js";
import Users from "./UserModel.js";
import Products from "./ProductModel.js";

const { DataTypes } = sequelize;

const Cart = db.define("cart", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Cart.belongsTo(Products, {
  foreignKey: "product_id",
  targetKey: "id",
});
Cart.belongsTo(Users, {
  foreignKey: "user_id",
  targetKey: "id",
});

export default Cart;
