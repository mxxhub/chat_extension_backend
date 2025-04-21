import express from "express";
import { saveMessage, getMessage } from "../controllers/messageContoller";

const router = express.Router();

router.post("/getMessage", getMessage);
router.post("/createMessage", saveMessage);

export default router;
