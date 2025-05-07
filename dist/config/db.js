"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDataBase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDataBase = async () => {
    const mongoUrl = process.env.DATABASE ||
        "mongodb+srv://dignitymine:fE4hjllQGJX5tHQ1@cluster0.i2mqk8z.mongodb.net/chatExtension";
    if (mongoose_1.default.connection.readyState === 1) {
        console.log("Already connected to MongoDB!");
        return;
    }
    try {
        const options = {
            autoCreate: true,
            retryReads: true,
        };
        mongoose_1.default.set("strictQuery", true);
        const result = await mongoose_1.default.connect(mongoUrl, options);
        if (result) {
            console.log("MongoDB connected successfully!");
        }
    }
    catch (err) {
        console.error(`MongoDB connect failed: ${err}`);
    }
};
exports.connectDataBase = connectDataBase;
