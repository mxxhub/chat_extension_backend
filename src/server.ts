import express, { Application } from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import { connectDataBase } from "./config/db";
import http from "http";
import { Server } from "socket.io";
import setupSocketIO from "./socket";
import cors from "cors";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 4000;

app.use(
  cors({
    // origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/", routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    // credentials: true,
  },
});

setupSocketIO(io);

connectDataBase()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connnect database: ", err);
    process.exit(1);
  });
