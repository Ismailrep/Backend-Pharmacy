import sequelize from "sequelize";
import db from "../config/Database.js";
import Address from "./AddressModel.js";
import InvoiceDetail from "./InvoiceDetailModel.js";
import Users from "./UserModel.js";

const { DataTypes } = sequelize;

const InvoiceHeader = db.define("invoice_header", {
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  grand_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
  },
});

InvoiceHeader.hasMany(InvoiceDetail, {
  foreignKey: "invoice_id",
  sourceKey: "invoice_id",
});
InvoiceDetail.belongsTo(InvoiceHeader, {
  foreignKey: "invoice_id",
  targetKey: "invoice_id",
});

InvoiceHeader.belongsTo(Users, { foreignKey: "user_id", targetKey: "id" });
InvoiceHeader.belongsTo(Address, { foreignKey: "address_id", targetKey: "id" });

export default InvoiceHeader;
