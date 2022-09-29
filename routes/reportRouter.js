import express from "express";
import {
  getRecentOrder,
  getRevenue,
  getStoreStatistic,
  getTopProducts,
} from "../controller/reportController.js";

const routers = express.Router();

routers.post("/getRevenue", getRevenue);
routers.get("/getRecentOrder", getRecentOrder);
routers.get("/getTopProducts", getTopProducts);
routers.get("/getStatistic", getStoreStatistic);

export default routers;
