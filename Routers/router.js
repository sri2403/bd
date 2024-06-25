import  express  from "express";
import { forgotPassword,  loginUser, registerUser, urlShort } from "../Controllers/controller.js";
import authMiddleware from "../Middleware/middleware.js";

const router=express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/forgot-password",forgotPassword)
router.post("/shortUrls",authMiddleware,urlShort)

export default router;