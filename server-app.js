import express from "express";
import path from "path";
import morganLog from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import validator from "express-validator";

import api from "./routes/api";

dotenv.config();
const app = express();
app.set("PORT", process.env.PORT);

app.use(morganLog("dev"));
app.use(
    session({
        name: process.env.COOKIE_NAME,
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 5000
        }
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    if (req.app.get("env") === "development") res.locals.error = err;
    else {
        err.message = "NOT FOUND...!!";
        err.status = 404;
        res.locals.error = err;
    }
    // send error json
    res.status(500).json({ message: err.message, error: err });
});

app.listen(app.get("PORT"), () => {
    console.log("Express server is up on port " + app.get("PORT"));
});
