import express from "express";
import passport from "passport";
const router = express.Router();

import { findUserByEmail, createUser } from "../mongoDB/query";
require("./../config/passport");

router.post(
    "/auth/signup",
    passport.authenticate("local.signup", {
        successRedirect: "/api/auth/sucess"
    })
);

router.get("/auth/sucess", (req, res, next) => {
    // console.log(req.user);

    res.status(200).json({ message: "sucess" });
});

router.post("/auth/login", (req, res, next) => {
    const { email, password } = req.body;
    findUserByEmail(email)
        .then(aUser => {
            if (aUser && aUser.isValidPassword(password))
                res.status(200).json({
                    user: aUser
                });
            else
                res.status(400).json({
                    message: "INVALID CREDENTIALS...!!"
                });
        })
        .catch(error => {
            next(error);
        });
});

export default router;
