import express from "express";
import {
  login,
  keepLogin,
  addAdmin,
  verification,
} from "../controller/adminController.js";
import { AuthToken } from "../helper/authToken.js";
const routers = express.Router();

routers.post("/login", login);
routers.post("/keepLogin", keepLogin);
routers.post("/add-admin", addAdmin);
routers.patch("/verification", AuthToken, verification);

export default routers;
