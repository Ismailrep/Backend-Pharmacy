import express from "express";
import {
  addCategory,
  addProduct,
  getCategories,
} from "../controller/productsController.js";

const routers = express.Router();

routers.get("/getCategories", getCategories);
routers.post("/addProduct", addProduct);
routers.post("/addCategory", addCategory);

export default routers;
