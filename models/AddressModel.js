import sequelize from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = sequelize;

const Address = db.define("addresses", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Address.belongsTo(Users, {
  foreignKey: "user_id",
  targetKey: "id",
});

export default Address;
