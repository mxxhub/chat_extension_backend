import express from "express";
import {
  addUser,
  deleteUser,
  getChannelsByUserId,
  getOnlineUsers,
  updateUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/addUser", addUser);
router.post("/online", getOnlineUsers);
router.post("/updateUser", updateUser);
router.post("/getChannelsByUser", getChannelsByUserId);
router.post("/deleteUser", deleteUser);

export default router;
