import express from "express";
const router = express.Router();

import {
    searchMovie,
    findUserByEmail,
    createUser,
    findReviewByMovie,
    findShowByMovie,
    getSeatDoc,
    decreaseSeatCount,
    updateUserBookings
} from "../mongoDB/query";

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

export default router;
