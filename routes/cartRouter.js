import express from "express";
import {
  addToCart,
  checkOutCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../controller/cartController.js";

const routers = express.Router();

routers.post("/add-to-cart", addToCart);
routers.get("/cart-item/:id", getCart);
routers.patch("/update-cart-item", updateCartItem);
routers.delete("/delete-cart-item", deleteCartItem);
routers.post("/check-out-cart", checkOutCart);

export default routers;
