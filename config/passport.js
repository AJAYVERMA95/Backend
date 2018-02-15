import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as FaceBookStrategy } from "passport-facebook";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";

import User from "./../mongoDB/models/user";
import {
    createUser,
    findUserByEmail,
    findUserByFacebookId,
    createUserByFB,
    findUserByGoogleId,
    createUserByGoogle
} from "./../mongoDB/query";

passport.serializeUser(function(user, done) {
    return done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
    User.findById(userId)
        .then(user => {
            return done(null, user);
        })
        .catch(error => {
            return done(error);
        });
});

const LocalSignUpStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    (req, email, password, done) => {
        req
            .checkBody("email", "Invalid Email...")
            .notEmpty()
            .isEmail();
        req.checkBody("password", "Empty Password...").notEmpty();
        req.checkBody("name", "Empty Name...").notEmpty();
        const validationErrors = req.validationErrors();

        if (validationErrors) {
            var validationErrorMssgs = [];
            validationErrors.forEach(e => {
                validationErrorMssgs.push(e.msg);
            });
            return done(null, false, req.flash("error", validationErrorMssgs));
        }

        const { name, dob, phone } = req.body;
        findUserByEmail(email)
            .then(userRecord => {
                if (userRecord)
                    return done(null, false, {
                        message: "Email already in use..."
                    });
                else
                    createUser({
                        name,
                        email,
                        password,
                        dob,
                        phone
                    })
                        .then(userRecord => {
                            return done(null, userRecord);
                        })
                        .catch(error => {
                            return done(error);
                        });
            })
            .catch(error => {
                return done(error);
            });
    }
);

const LocalLoginStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    (req, email, password, done) => {
        req
            .checkBody("email", "Invalid Email...")
            .notEmpty()
            .isEmail();
        req.checkBody("password", "Empty Password...").notEmpty();
        const validationErrors = req.validationErrors();
        if (validationErrors) {
            var validationErrorMssgs = [];
            validationErrors.forEach(e => {
                validationErrorMssgs.push(e.msg);
            });
            return done(null, false, req.flash("error", validationErrorMssgs));
        }

        findUserByEmail(email)
            .then(userRecord => {
                if (userRecord && userRecord.isValidPassword(password))
                    return done(null, userRecord);
                else
                    return done(null, false, {
                        message: "Invalid credentials.."
                    });
            })
            .catch(error => {
                return done(error);
            });
    }
);

const FBStrategy = new FaceBookStrategy(
    {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_KEY,
        callbackURL:
            process.env.REDIRECT_DOMAIN + "/api/auth/facebook/callback",
        profileFields: ["id", "email", "name"],
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
        findUserByFacebookId(profile.id)
            .then(userRecord => {
                if (userRecord) return done(null, userRecord);
                else {
                    createUserByFB(profile, accessToken)
                        .then(Record => {
                            return done(null, Record);
                        })
                        .catch(error => {
                            return done(error);
                        });
                }
            })
            .catch(error => {
                return done(error);
            });
    }
);

const GoogleAuthStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_KEY,
        callbackURL: process.env.REDIRECT_DOMAIN + "/api/auth/google/callback",
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
        findUserByGoogleId(profile.id)
            .then(userRecord => {
                if (userRecord) return done(null, userRecord);
                else {
                    createUserByGoogle(profile, accessToken)
                        .then(Record => {
                            return done(null, Record);
                        })
                        .catch(error => {
                            return done(error);
                        });
                }
            })
            .catch(error => {
                return done(error);
            });
    }
);

passport.use("local-signup", LocalSignUpStrategy);
passport.use("local-login", LocalLoginStrategy);
passport.use("facebook", FBStrategy);
passport.use("google", GoogleAuthStrategy);
