import express from "express";
import {
  addCategory,
  addProduct,
  deleteProduct,
  getCategories,
  getProducts,
  setActive,
  updateProduct,
} from "../controller/productsController.js";

const routers = express.Router();

routers.get("/getCategories", getCategories);
routers.post("/getProducts", getProducts);
routers.post("/addProduct", addProduct);
routers.post("/addCategory", addCategory);
routers.patch("/updateProduct", updateProduct);
routers.patch("/delete/:id", deleteProduct);
routers.patch("/setActive/:id", setActive);

export default routers;
