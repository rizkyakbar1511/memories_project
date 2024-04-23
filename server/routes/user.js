import express from "express";
import { signin, signup, getUser } from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/info", auth, getUser);

export default router;
