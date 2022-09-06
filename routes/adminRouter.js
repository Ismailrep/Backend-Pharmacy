import express from "express";
import { login, keepLogin } from "../controller/adminController.js";
const routers = express.Router();

routers.post("/login", login);
routers.post("/keepLogin", keepLogin);

export default routers;
