import Address from "../models/AddressModel";
import Users from "../models/UserModel";
import Cart from "../models/CartModel";
import Products from "../models/ProductModel";
import InvoiceDetail from "../models/InvoiceDetailModel";
import InvoiceHeader from "../models/InvoiceHeaderModel";
import { Op } from "sequelize";

const addInvoiceDetail = async (req, res) => {
  const { invoice_id, product_id, price, qty } = req.body;

  try {
    await InvoiceDetail.create({});
  } catch (error) {}
};
