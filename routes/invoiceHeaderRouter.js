import express from "express";
import {
  getInvoiceById,
  getInvoiceHeaders,
} from "../controller/invoiceHeaderController.js";

const routers = express.Router();

routers.get("/getInvoiceById/:id", getInvoiceById);
routers.post("/getInvoiceHeaders", getInvoiceHeaders);

export default routers;
