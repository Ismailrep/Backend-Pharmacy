import { uploader } from "../helper/uploader.js";
import Category from "../models/CategoryModel.js";
import Products from "../models/ProductModel.js";

export const addProduct = async (req, res) => {
  try {
    let path = "/products";
    const upload = uploader(path, "Product").fields([{ name: "file" }]);

    upload(req, res, async () => {
      const {
        category_id,
        name,
        price,
        description,
        total_stock,
        unit,
        unit_per_bottle,
      } = req.body;
      const stock_bottle = Math.floor(total_stock / unit_per_bottle);
      await Products.create({
        category_id,
        name,
        image: req.files.file[0].filename,
        price,
        description,
        total_stock,
        unit,
        unit_per_bottle,
        stock_bottle,
      });
      res.status(200).send("added");
    });
  } catch (error) {
    console.log(error);
    res.status(200).send(error);
  }
};

export const addCategory = async (req, res) => {
  try {
    await Category.create({ category: req.body.addCategory });
    res.status(200).send("category added");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getCategories = async (req, res) => {
  try {
    const result = await Category.findAll({ attributes: ["id", "category"] });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
