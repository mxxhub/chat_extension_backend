import express, { Application } from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import { connectDataBase } from "./config/db";
import http from "http";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 4000;

app.use(express.json());

app.use("/", routes);

const server = http.createServer(app);

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
