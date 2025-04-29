import express from "express";
import {
  saveMessage,
  getMessage,
  deleteMessage,
} from "../controllers/messageContoller";

const router = express.Router();

router.post("/getMessage", getMessage);
router.post("/createMessage", saveMessage);
router.post("/deleteMessage", deleteMessage);

export default router;
