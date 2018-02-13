import express from "express";
const router = express.Router();

import { findUserByEmail, createUser } from "../mongoDB/query";

router.post("/auth/signup", (req, res, next) => {
    const { name, email, password, dob, phone } = req.body;
    createUser({
        name,
        email,
        password,
        dob,
        phone
    })
        .then(userRecord => {
            res.status(200).json({
                user: userRecord
            });
        })
        .catch(error => {
            next(error);
        });
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
