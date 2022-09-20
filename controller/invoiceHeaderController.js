import sequelize from "sequelize";
import Address from "../models/AddressModel.js";
import InvoiceDetail from "../models/InvoiceDetailModel.js";
import InvoiceHeader from "../models/InvoiceHeaderModel.js";
import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

const Op = sequelize.Op;

export const getInvoiceHeaders = async (req, res) => {
  try {
    const { page, perPage, invoice_id, asc } = req.body;
    const { count } = await InvoiceHeader.findAndCountAll({
      where: { invoice_id: { [Op.like]: `%${invoice_id}%` } },
    });
    const result = await InvoiceHeader.findAll({
      include: [
        {
          model: InvoiceDetail,
          include: [{ model: Products, attributes: ["name"] }],
        },
        { model: Users, attributes: ["first_name", "last_name"] },
      ],
      order: asc ? [["createdAt"]] : [["createdAt", "desc"]],
      limit: +perPage,
      offset: page * perPage - perPage,
      where: { invoice_id: { [Op.like]: `%${invoice_id}%` } },
    });

    res.status(200).send({ invoices: result, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const result = await InvoiceHeader.findOne({
      include: [
        {
          model: InvoiceDetail,
          include: [{ model: Products, attributes: ["name"] }],
        },
        { model: Users, attributes: ["first_name", "last_name", "phone"] },
        { model: Address, attributes: ["address"] },
      ],
      where: { invoice_id: req.params.id },
    });

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
