"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageContoller_1 = require("../controllers/messageContoller");
const router = express_1.default.Router();
router.post("/getMessage", messageContoller_1.getMessage);
router.post("/createMessage", messageContoller_1.saveMessage);
router.post("/deleteMessage", messageContoller_1.deleteMessage);
router.post("/editMessage", messageContoller_1.editMessage);
exports.default = router;
