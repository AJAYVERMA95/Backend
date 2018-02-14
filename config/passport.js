import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./../mongoDB/models/user";
import { createUser, findUserByEmail } from "./../mongoDB/query";

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

passport.use("local-signup", LocalSignUpStrategy);
passport.use("local-login", LocalLoginStrategy);
