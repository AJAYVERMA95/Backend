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
        "Local.Name": name,
        "Local.Email": email,
        "Local.Phone": phone,
        "Local.DOB": dob
    });
    newUser.setPassword(password);
    return newUser.save();
};

export const findUserByEmail = Email => {
    return User.findOne({
        "Local.Email": Email
    });
};

export const findUserByFacebookId = Id => {
    return User.findOne({
        "Facebook.Id": Id
    });
};

export const findUserByGoogleId = Id => {
    return User.findOne({
        "Google.Id": Id
    });
};

export const createUserByFB = (profile, Token) => {
    const Name = profile.name.givenName + " " + profile.name.familyName;
    const Email = profile.emails[0].value;
    const Id = profile.id;
    const newUser = new User({
        Facebook: {
            Id,
            Name,
            Email,
            Token
        }
    });
    return newUser.save();
};

export const createUserByGoogle = (profile, Token) => {
    const Name = profile.displayName;
    const Email = profile.emails[0].value;
    const Id = profile.id;
    const newUser = new User({
        Google: {
            Id,
            Name,
            Email,
            Token
        }
    });
    return newUser.save();
};
