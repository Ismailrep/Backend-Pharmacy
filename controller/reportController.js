import { Op, col, fn, literal, where } from "sequelize";
import Category from "../models/CategoryModel.js";
import InvoiceDetail from "../models/InvoiceDetailModel.js";
import InvoiceHeader from "../models/InvoiceHeaderModel.js";
import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

export const getRevenue = async (req, res) => {
  try {
    const { week, lastWeek, thisMonth, lastMonth, last30d } = req.body;

    const lastMonthSold = await InvoiceDetail.findAll({
      attributes: ["product_id", [fn("sum", col("qty")), "sold"]],
      where: { createdAt: { [Op.between]: [lastMonth[0], lastMonth[1]] } },
      group: ["product_id"],
    });

    const thisMonthSold = await InvoiceDetail.findAll({
      attributes: ["product_id", [fn("sum", col("qty")), "sold"]],
      where: { createdAt: { [Op.between]: [thisMonth[0], thisMonth[1]] } },
      group: ["product_id"],
    });

    const totalItemSold = await InvoiceDetail.findAll({
      attributes: ["product_id", [fn("sum", col("qty")), "sold"]],
      group: ["product_id"],
    });

    const itemSoldPerDay = await InvoiceDetail.findAll({
      attributes: [
        ["createdAt", "date"],
        [fn("sum", col("qty")), "sold"],
      ],
      where: { createdAt: { [Op.between]: [last30d, new Date().getTime()] } },
      group: [fn("day", col("createdAt"))],
      order: [["createdAt"]],
    });

    const revenuePerDay = await InvoiceHeader.findAll({
      attributes: [
        ["createdAt", "date"],
        [fn("sum", col("grand_total")), "revenue"],
      ],
      where: { createdAt: { [Op.between]: [last30d, new Date().getTime()] } },
      group: [fn("day", col("createdAt"))],
      order: [["createdAt"]],
    });

    const [total] = await InvoiceHeader.findAll({
      attributes: [[fn("sum", col("grand_total")), "total_revenue"]],
    });

    const [thisMonthRev] = await InvoiceHeader.findAll({
      attributes: [[fn("sum", col("grand_total")), "this_month_revenue"]],
      where: { createdAt: { [Op.between]: [thisMonth[0], thisMonth[1]] } },
    });

    const [lastMonthRev] = await InvoiceHeader.findAll({
      raw: true,
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

    const totalInvoice = await InvoiceHeader.findAndCountAll();

    const lastMonthInvoice = await InvoiceHeader.findAndCountAll({
      where: { createdAt: { [Op.between]: [lastMonth[0], lastMonth[1]] } },
    });

    const thisMonthInvoice = await InvoiceHeader.findAndCountAll({
      where: { createdAt: { [Op.between]: [thisMonth[0], thisMonth[1]] } },
    });

    res.status(200).send({
      totalItemSold,
      lastMonthSold,
      thisMonthSold,
      itemSoldPerDay,
      revenuePerDay,
      total: +total.dataValues.total_revenue,
      thisMonth: +thisMonthRev.dataValues.this_month_revenue,
      lastMonth: +lastMonthRev.last_month_revenue,
      thisWeek: +thisWeek.dataValues.this_week_revenue,
      lastWeek: +lastWeekRev.dataValues.last_week_revenue,
      invoice: {
        total: totalInvoice.count,
        lastMonth: lastMonthInvoice.count,
        thisMonth: thisMonthInvoice.count,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getRecentOrder = async (req, res) => {
  try {
    const { thisMonth } = req.body;
    const result = await InvoiceHeader.findAll({
      include: [{ model: Users, attributes: ["first_name", "last_name"] }],
      where: { createdAt: { [Op.between]: [thisMonth[0], thisMonth[1]] } },
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
    const { date } = req.body;
    const result = await InvoiceDetail.findAll({
      include: [{ model: Products }],
      attributes: [
        "id",
        "product_id",
        [fn("sum", col("qty")), "count"],
        [literal("sum(qty) * invoice_details.price"), "total_price"],
      ],
      where: { createdAt: { [Op.between]: [date[0], date[1]] } },
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
    let where = {};
    if (req.body[0]) {
      if (req.body[1]) {
        where = {
          where: { createdAt: { [Op.lte]: req.body[1] } },
        };
      } else {
        where = {
          where: { createdAt: { [Op.lte]: req.body[0] } },
        };
      }
    }
    const orders = await InvoiceHeader.findAndCountAll(where);
    const customers = await Users.findAndCountAll(where);
    const products = await Products.findAndCountAll(where);
    const categories = await Category.findAndCountAll(where);
    console.log("het", req.body);
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
