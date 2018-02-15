import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema({
    Local: {
        Name: String,
        Email: {
            type: String,
            lowercase: true
        },
        PasswordHash: String,
        Phone: String,
        DOB: String
    },
    Facebook: {
        Id: String,
        Token: String,
        Name: String,
        Email: String
    },
    Google: {
        Id: String,
        Email: String,
        Name: String,
        Token: String
    }
});

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.Local.PasswordHash);
};

UserSchema.methods.setPassword = function(password) {
    this.Local.PasswordHash = bcrypt.hashSync(password, 10);
};

// UserSchema.plugin(uniqueValidator);
export default mongoose.model("User", UserSchema);
