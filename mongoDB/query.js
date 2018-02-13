import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/user";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
    user: process.env.MONGODB_USER_NAME,
    pass: process.env.MONGODB_USER_PWD,
    autoReconnect: true
});

export const createUser = ({ name, email, password, dob, phone }) => {
    const newUser = new User({
        Name: name,
        Email: email,
        Phone: phone,
        DOB: dob
    });
    newUser.setPassword(password);
    return newUser.save();
};
