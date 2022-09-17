import fs from "fs";
import sequelize from "sequelize";
import { uploader } from "../helper/uploader.js";
import Category from "../models/CategoryModel.js";
import Products from "../models/ProductModel.js";

const Op = sequelize.Op;

export const getProducts = async (req, res) => {
  try {
    const { page, perPage, name, category_id, sortBy } = req.body;
    const { count } = await Products.findAndCountAll({
      where: category_id
        ? {
            name: {
              [Op.like]: `%${name}%`,
            },
            category_id,
          }
        : {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
    });
    const result = await Products.findAll({
      // attributes: ["id", "name", "price"],
      include: [
        {
          model: Category,
        },
      ],
      order: sortBy.name
        ? sortBy.asc
          ? [["name"]]
          : [["name", "desc"]]
        : sortBy.asc
        ? [["price"]]
        : [["price", "desc"]],
      limit: +perPage,
      offset: page * perPage - perPage,
      where: category_id
        ? {
            name: {
              [Op.like]: `%${name}%`,
            },
            category_id,
          }
        : {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
    });

    res.status(200).send({ products: result, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getProductsById = async (req, res) => {
  try {
    const response = await Products.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    let path = "/products";
    const upload = uploader(path, "Product").fields([{ name: "file" }]);

    upload(req, res, async () => {
      const { total_stock, unit_per_bottle } = req.body;
      const stock_bottle = Math.floor(total_stock / unit_per_bottle);
      await Products.create({
        category_id: req.body.category_id,
        name: req.body.name,
        image: req.files.file[0].filename,
        price: req.body.price,
        description: req.body.description,
        total_stock: req.body.total_stock,
        unit: req.body.unit,
        unit_per_bottle: req.body.unit_per_bottle,
        stock_bottle,
      });
      res.status(200).send("added");
    });
  } catch (error) {
    console.log(error);
    res.status(200).send(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    let dir_path = "/products";
    const upload = uploader(dir_path, "Product").fields([{ name: "file" }]);

    upload(req, res, async () => {
      const stock_bottle = Math.floor(
        req.body.total_stock / req.body.unit_per_bottle
      );
      if (req.files.file) {
        const oldImg = `../Backend-Pharmacy/public${dir_path}/${req.body.image}`;

        await Products.update(
          {
            category_id: req.body.category_id,
            name: req.body.name,
            image: req.files.file[0].filename,
            price: req.body.price,
            total_stock: req.body.total_stock,
            unit: req.body.unit,
            unit_per_bottle: req.body.unit_per_bottle,
            stock_bottle,
            description: req.body.description,
          },
          { where: { id: req.body.id } }
        );
        fs.unlinkSync(oldImg);
        return res.status(200).send("updated");
      }

      await Products.update(
        {
          category_id: req.body.category_id,
          name: req.body.name,
          price: req.body.price,
          total_stock: req.body.total_stock,
          unit: req.body.unit,
          unit_per_bottle: req.body.unit_per_bottle,
          stock_bottle,
          description: req.body.description,
        },
        { where: { id: req.body.id } }
      );
      return res.status(200).send("updated");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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

export const deleteProduct = async (req, res) => {
  try {
    await Products.update(
      { is_deleted: true },
      { where: { id: req.params.id } }
    );
    res.status(200).send("deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const setActive = async (req, res) => {
  try {
    await Products.update(
      { is_deleted: false },
      { where: { id: req.params.id } }
    );
    res.status(200).send("actived");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
