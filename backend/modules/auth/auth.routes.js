import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "./auth.controller.js";

const router = Router();

/* =========================
   AUTH ROUTES
========================= */

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;