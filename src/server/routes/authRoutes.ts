import { Router } from "express";
import { registerUser, loginUser, checkAuth } from "../controllers/authController";
import { protect } from "../middleware/auth";


const router = Router();

router.get("/check", protect, checkAuth);

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
