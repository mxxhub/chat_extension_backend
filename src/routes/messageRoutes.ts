import express from "express";
import {
  saveMessage,
  getMessage,
  getOnlineUsers,
} from "../controllers/messageContoller";

const router = express.Router();

router.post("/getMessage", getMessage);
router.post("/createMessage", saveMessage);
router.post("/getOnline", getOnlineUsers);

export default router;
