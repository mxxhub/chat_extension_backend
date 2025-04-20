import express, { Application } from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import { connectDataBase } from "./config/db";

dotenv.config();

const app: Application = express();
const port: string = process.env.PORT || "3000";

// Middleware
app.use(express.json());

// Register Routes
app.use("/api", routes);

connectDataBase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connnect database: ", err);
    process.exit(1);
  });
