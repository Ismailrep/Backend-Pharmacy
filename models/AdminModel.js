import sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = sequelize;

const Admins = db.define("admins", {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Admin",
  },
});

export default Admins;
