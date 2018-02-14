import express from "express";
import passport from "passport";
const router = express.Router();

import { findUserByEmail } from "../mongoDB/query";
require("./../config/passport");

router.post(
    "/auth/signup",
    passport.authenticate("local-signup", {
        failureRedirect: "/api/auth/failure",
        failureFlash: true
    }),
    (req, res, next) => {
        res.status(200).json({ message: "successfully signed up." });
    }
);

router.get("/auth/failure", (req, res, next) => {
    const validationErrors = req.flash("error");
    // console.log(req.session);

    // console.log(validationErrors);

    res.status(400).json({ message: validationErrors });
});

router.post(
    "/auth/login",
    passport.authenticate("local-login", {
        failureRedirect: "/api/auth/failure",
        failureFlash: true
    }),
    (req, res, next) => {
        res.status(200).json({ message: "successfully logged In.." });
    }
);

export default router;
