import express from "express";
import { login } from "../controller/adminController.js";
import {
  getUser,
  createUser,
  verifyUser,
  resetPassUser,
  sendResetPassLink,
  deactUser,
  activateUser,
  loginUser,
  keepLoginUser,
  logoutUser,
} from "../controller/Users.js";
// import { AuthToken } from "../helper/authToken.js";

const router = express.Router();

router.get("/users", getUser);
router.post("/users/login", loginUser);
router.get("/users/keep-login", keepLoginUser);
router.delete("users/logout", logoutUser);
router.post("/users/register", createUser);
router.patch("/users/verified/:id", verifyUser);
router.post("/users/reset-mail-sent", sendResetPassLink);
router.patch("/users/reset-password/:id", resetPassUser);
router.patch("/admin/user-deactivate/:id", deactUser);
router.patch("/admin/user-activate/:id", activateUser);

export default router;
