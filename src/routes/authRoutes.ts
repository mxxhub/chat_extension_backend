import express from "express";
import { addUser, getOnlineUsers } from "../controllers/authController";

const router = express.Router();

router.post("/addUser", addUser);
router.post("/online", getOnlineUsers);

export default router;
