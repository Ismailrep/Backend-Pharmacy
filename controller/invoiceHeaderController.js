import { Op } from "sequelize";
import Address from "../models/AddressModel.js";
import InvoiceDetail from "../models/InvoiceDetailModel.js";
import InvoiceHeader from "../models/InvoiceHeaderModel.js";
import Payment from "../models/PaymentModel.js";
import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

export const getInvoiceHeaders = async (req, res) => {
  try {
    const { page, perPage, invoice_id, asc, startDate, endDate } = req.body;
    const { count } = await InvoiceHeader.findAndCountAll({
      where: {
        invoice_id: { [Op.like]: `%${invoice_id}%` },
        createdAt: {
          [Op.between]: [
            startDate ? startDate : "",
            endDate ? endDate : new Date().getTime(),
          ],
        },
      },
    });
    const invoices = await InvoiceHeader.findAll({
      include: [
        {
          model: InvoiceDetail,
          include: [{ model: Products, attributes: ["name"] }],
        },
        { model: Users, attributes: ["first_name", "last_name"] },
        { model: Payment },
      ],
      order: asc ? [["createdAt"]] : [["createdAt", "desc"]],
      limit: +perPage,
      offset: page * perPage - perPage,
      where: {
        invoice_id: { [Op.like]: `%${invoice_id}%` },
        createdAt: {
          [Op.between]: [
            startDate ? startDate : "",
            endDate ? endDate : new Date().getTime(),
          ],
        },
      },
    });

    res.status(200).send({ invoices, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getInvoicesByUserId = async (req, res) => {
  try {
    const { page, perPage, invoice_id, user_id, asc, startDate, endDate } =
      req.body;
    const { count } = await InvoiceHeader.findAndCountAll({
      where: {
        invoice_id: { [Op.like]: `%${invoice_id}%` },
        user_id,
        createdAt: {
          [Op.between]: [
            startDate ? startDate : "",
            endDate ? endDate : new Date().getTime(),
          ],
        },
      },
    });
    const invoices = await InvoiceHeader.findAll({
      include: [
        {
          model: InvoiceDetail,
          include: [{ model: Products, attributes: ["name"] }],
        },
        { model: Users, attributes: ["first_name", "last_name"] },
        { model: Payment },
      ],
      order: asc ? [["createdAt"]] : [["createdAt", "desc"]],
      limit: +perPage,
      offset: page * perPage - perPage,
      where: {
        invoice_id: { [Op.like]: `%${invoice_id}%` },
        user_id,
        createdAt: {
          [Op.between]: [
            startDate ? startDate : "",
            endDate ? endDate : new Date().getTime(),
          ],
        },
      },
    });

    res.status(200).send({ invoices, count });
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
        { model: Payment },
      ],
      where: { invoice_id: req.params.id },
    });

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const setInvoiceStatus = async (req, res) => {
  try {
    await InvoiceHeader.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );
    res.status(200).send(true);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
