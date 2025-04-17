import express, { Application } from "express";
import dotenv from "dotenv";
import routes from "./routes/index"; // Import routes

dotenv.config(); // Load environment variables

const app: Application = express();
const port: string = process.env.PORT || "3000";

// Middleware (e.g., to parse JSON)
app.use(express.json());

// Register Routes
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
