import express from "express";
import { addAddress, getAddress } from "../controller/addressController.js";

const routers = express.Router();

routers.post("/add-address", addAddress);
routers.get("/get-address/:id", getAddress);

export default routers;
