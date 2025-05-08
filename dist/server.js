"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const db_1 = require("./config/db");
const http_1 = __importDefault(require("http"));
// import fs from "fs";
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./socket"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4000;
// const options = {
//   key: fs.readFileSync("/etc/letsencrypt/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/cert.pem"),
// };
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true,
}));
app.use(express_1.default.json());
app.use("/", index_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        // credentials: true,
    },
});
(0, socket_1.default)(io);
(0, db_1.connectDataBase)()
    .then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((err) => {
    console.log("Failed to connnect database: ", err);
    process.exit(1);
});
