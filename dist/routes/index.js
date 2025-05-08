"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const messageRoutes_1 = __importDefault(require("./messageRoutes"));
const app = (0, express_1.default)();
app.use("/auth", authRoutes_1.default);
app.use("/messages", messageRoutes_1.default);
exports.default = app;
