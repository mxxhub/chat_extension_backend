import express, { Application } from "express";
import authRoutes from "./authRoutes";
import messageRoutes from "./messageRoutes";

const app: Application = express();

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

export default app;
