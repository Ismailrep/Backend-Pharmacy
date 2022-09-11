import express from "express";
import {
  getUser,
  // getUserById,
  createUser,
  verifyUser,
  resetPassUser,
  sendResetPassLink,
  deactUser,
  activateUser,
  // updateUser,
  // deleteUser,
} from "../controller/Users.js";
// import { AuthToken } from "../helper/authToken.js";

const router = express.Router();

router.get("/users", getUser);
// router.get("/users/:id", getUserById);
router.post("/users/register", createUser);
router.patch("/users/verified/:id", verifyUser);
router.post("/users/reset-mail-sent", sendResetPassLink);
router.patch("/users/reset-password/:id", resetPassUser);
router.patch("/admin/user-deactivate/:id", deactUser);
router.patch("/admin/user-activate/:id", activateUser);
// router.patch("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
