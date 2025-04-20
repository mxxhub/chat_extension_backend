import { Router } from "express";
const router: Router = Router();
import { addUser } from "../controllers/addUser";

router.post("/addNewUser", addUser);

router.get("/test", (req, res) => {
  res.send("Hello, world!");
});

export default router;
