import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true
    },
    PasswordHash: {
        type: String,
        required: true
    },
    Phone: String,
    DOB: String
});

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.PasswordHash);
};

UserSchema.methods.setPassword = function(password) {
    this.PasswordHash = bcrypt.hashSync(password, 10);
};

UserSchema.plugin(uniqueValidator);
export default mongoose.model("User", UserSchema);
