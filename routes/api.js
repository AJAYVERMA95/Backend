import express from "express";
import passport from "passport";
const router = express.Router();

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

router.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
        scope: ["public_profile", "email"]
    })
);

router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/api/auth/failure",
        failureFlash: true
    }),
    (req, res, next) => {
        res
            .status(200)
            .json({ message: "successfully signed up by FACEBOOK." });
    }
);

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/api/auth/failure",
        failureFlash: true
    }),
    (req, res, next) => {
        res.status(200).json({ message: "successfully signed up by GOOGLE." });
    }
);

router.get("/auth/failure", (req, res, next) => {
    const validationErrors = req.flash("error");
    // console.log(req.session);

    // console.log(validationErrors);

    res.status(400).json({ message: validationErrors });
});

export default router;
