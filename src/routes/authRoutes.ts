import express from "express";
import {
  addUser,
  getOnlineUsers,
  updateUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/addUser", addUser);
router.post("/online", getOnlineUsers);
router.post("/updateUser", updateUser);

export default router;
