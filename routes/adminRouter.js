import express from "express";
import {
  login,
  keepLogin,
  addAdmin,
  verification,
  sendResetLink,
  authResetToken,
  resetPassword,
} from "../controller/adminController.js";
import { AuthToken } from "../helper/authToken.js";

const routers = express.Router();

routers.post("/login", login);
routers.post("/keepLogin", keepLogin);
routers.post("/add-admin", addAdmin);
routers.post("/forgot-password", sendResetLink);
routers.post("/auth-reset-token", AuthToken, authResetToken);
routers.patch("/verification", AuthToken, verification);
routers.patch("/reset-password", resetPassword);

export default routers;
