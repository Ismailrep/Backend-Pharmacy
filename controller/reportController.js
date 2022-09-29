import { Op, col, fn, literal } from "sequelize";
import Category from "../models/CategoryModel.js";
import InvoiceDetail from "../models/InvoiceDetailModel.js";
import InvoiceHeader from "../models/InvoiceHeaderModel.js";
import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

export const getRevenue = async (req, res) => {
  try {
    const { week, lastWeek, thisMonth, lastMonth } = req.body;

    const itemSold = await InvoiceDetail.findAll({
      attributes: ["product_id", [fn("sum", col("qty")), "sold"]],
      group: ["product_id"],
    });

    const [total] = await InvoiceHeader.findAll({
      attributes: [[fn("sum", col("grand_total")), "total_revenue"]],
    });

    const [thisMonthRev] = await InvoiceHeader.findAll({
      attributes: [[fn("sum", col("grand_total")), "this_month_revenue"]],
      where: { createdAt: { [Op.between]: [thisMonth, new Date().getTime()] } },
    });

    const [lastMonthRev] = await InvoiceHeader.findAll({
      attributes: [[fn("sum", col("grand_total")), "last_month_revenue"]],
      where: { createdAt: { [Op.between]: [lastMonth[0], lastMonth[1]] } },
    });

    const [thisWeek] = await InvoiceHeader.findAll({
      attributes: [[fn("sum", col("grand_total")), "this_week_revenue"]],
      where: { createdAt: { [Op.between]: [week, new Date().getTime()] } },
    });

    const [lastWeekRev] = await InvoiceHeader.findAll({
      attributes: [[fn("sum", col("grand_total")), "last_week_revenue"]],
      where: { createdAt: { [Op.between]: [lastWeek[0], lastWeek[1]] } },
    });

    res.status(200).send({
      itemSold,
      total: +total.dataValues.total_revenue,
      thisMonth: +thisMonthRev.dataValues.this_month_revenue,
      lastMonth: +lastMonthRev.dataValues.last_month_revenue,
      thisWeek: +thisWeek.dataValues.this_week_revenue,
      lastWeek: +lastWeekRev.dataValues.last_week_revenue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getRecentOrder = async (req, res) => {
  try {
    const result = await InvoiceHeader.findAll({
      include: [{ model: Users, attributes: ["first_name", "last_name"] }],
      order: [["createdAt", "desc"]],
      limit: 5,
    });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const result = await InvoiceDetail.findAll({
      include: [{ model: Products }],
      attributes: [
        "id",
        "product_id",
        [fn("sum", col("qty")), "count"],
        [literal("sum(qty) * invoice_details.price"), "total_price"],
      ],
      group: ["product_id"],
      order: [[fn("sum", col("qty")), "desc"]],
      limit: 5,
    });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getStoreStatistic = async (req, res) => {
  try {
    const orders = await InvoiceHeader.findAndCountAll();
    const customers = await Users.findAndCountAll();
    const products = await Products.findAndCountAll();
    const categories = await Category.findAndCountAll();
    res.status(200).send({
      orders: orders.count,
      customers: customers.count,
      products: products.count,
      categories: categories.count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
