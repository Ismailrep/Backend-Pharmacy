import express from "express";
import { login, keepLogin, addAdmin } from "../controller/adminController.js";
const routers = express.Router();

routers.post("/login", login);
routers.post("/keepLogin", keepLogin);
routers.post("/add-admin", addAdmin);

export default routers;
