import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./../mongoDB/models/user";
import { createUser } from "./../mongoDB/query";

passport.serializeUser(function(user, done) {
    // console.log("in serialize");
    // console.log(user);

    done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
    // console.log("in DEserialize");
    // console.log(userId);

    User.findById(userId)
        .then(user => {
            done(null, user);
        })
        .catch(error => {
            done(error);
        });
});

const LocalSignUpStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    (req, email, password, done) => {
        const { name, dob, phone } = req.body;
        // console.log("req.body :");
        // console.log(req.body);
        // console.log(req.user);

        createUser({
            name,
            email,
            password,
            dob,
            phone
        })
            .then(userRecord => {
                // console.log("userRecord :");
                // console.log(userRecord);

                done(null, userRecord);
            })
            .catch(error => {
                done(error);
            });
    }
);

passport.use("local.signup", LocalSignUpStrategy);
