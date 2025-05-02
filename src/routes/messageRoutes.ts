import express from "express";
import {
  saveMessage,
  getMessage,
  deleteMessage,
  editMessage,
} from "../controllers/messageContoller";

const router = express.Router();

router.post("/getMessage", getMessage);
router.post("/createMessage", saveMessage);
router.post("/deleteMessage", deleteMessage);
router.post("/editMessage", editMessage);

export default router;
