import { Router } from "express";
import passport from "../config/passport.js";
import {
  login,
  oauthSuccess,
  register,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  oauthSuccess
);

// GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  oauthSuccess
);

// Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  oauthSuccess
);

router.get("/failure", (_req, res) =>
  res.status(400).json({ message: "OAuth failed" })
);

export default router;
