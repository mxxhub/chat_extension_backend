"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/addUser", authController_1.addUser);
router.post("/online", authController_1.getOnlineUsers);
router.post("/updateUser", authController_1.updateUser);
router.post("/getChannelsByUser", authController_1.getChannelsByUserId);
router.post("/deleteUser", authController_1.deleteUser);
exports.default = router;
