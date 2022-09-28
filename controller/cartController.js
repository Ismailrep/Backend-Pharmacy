import Cart from "../models/CartModel.js";
import Products from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import Users from "../models/UserModel.js";
import Address from "../models/AddressModel.js";

export const addToCart = async (req, res) => {
  const { product_id, user_id, qty } = req.body;
  try {
    const response = await Cart.findOne({
      where: {
        user_id,
        product_id,
      },
    });

    if (response) {
      await Cart.update(
        {
          qty: response.qty + qty,
        },
        {
          where: {
            product_id: response.product_id,
            user_id: response.user_id,
          },
        }
      );
    } else {
      await Cart.create({
        product_id,
        user_id,
        qty,
      });
    }

    res.status(200).json({ msg: "Product added to cart" });
  } catch (error) {
    res.status(500).json({
      msg: error.message.includes("users")
        ? "Please Log In First!"
        : error.message.includes("products")
        ? "Product does not exist!"
        : error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const response = await Cart.findAll({
      where: {
        user_id: req.params.id,
      },
      include: [{ model: Products, include: [{ model: Category }] }],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { product_id, user_id, qty } = req.body;
  try {
    const item = await Cart.findOne({
      where: {
        user_id,
        product_id,
      },
    });

    if (item) {
      await Cart.update(
        {
          qty,
        },
        {
          where: {
            product_id: item.product_id,
            user_id: item.user_id,
          },
        }
      );
      res.status(200).json({ msg: "Quantity updated" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  const { product_id, user_id } = req.body;
  try {
    const item = await Cart.findOne({
      where: {
        user_id,
        product_id,
      },
    });

    if (item) {
      await Cart.destroy({
        where: {
          product_id: item.product_id,
          user_id: item.user_id,
        },
      });
      res.status(200).json({ msg: "Item Deleted" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const checkOutCart = async (req, res) => {
  const { product_id, user_id } = req.body;

  try {
    const cartItem = await Cart.findAll({
      where: {
        user_id,
      },
    });

    const address = await Address.findAll({
      where: {
        user_id,
      },
    });

    const emptyAddress = address.length === 0;

    if (!emptyAddress) {
      const response = await Cart.destroy({
        where: {
          user_id,
        },
      });
    }

    res
      .status(200)
      .json(
        emptyAddress
          ? "Please fill out your address first!"
          : "Cart Checked Out!"
      );
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
