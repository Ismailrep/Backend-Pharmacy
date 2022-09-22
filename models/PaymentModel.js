import sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = sequelize;

const Payment = db.define("payment_confirmations", {
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bank: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Payment;
