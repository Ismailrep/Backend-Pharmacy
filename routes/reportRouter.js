import express from "express";
import {
  getRecentOrder,
  getRevenue,
  getStoreStatistic,
  getTopProducts,
} from "../controller/reportController.js";

const routers = express.Router();

routers.post("/getRevenue", getRevenue);
routers.post("/getRecentOrder", getRecentOrder);
routers.post("/getTopProducts", getTopProducts);
routers.post("/getStatistic", getStoreStatistic);

export default routers;
