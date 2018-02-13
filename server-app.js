import express from "express";
import path from "path";
import morganLog from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import api from "./routes/api";

dotenv.config();
const app = express();
app.set("PORT", process.env.PORT);

app.use(morganLog("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
    res.status(err.status || 500).json({ message: err.message, error: err });
});

app.listen(app.get("PORT"), () => {
    console.log("Express server is up on port " + app.get("PORT"));
});
