const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    userName: {type: String, required: true, trim: true, unique: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true, minlength: 8},
    confirmPassword: {type: String, required: true, minlength: 8},
    profilePicture: {type: String, default: ""},
    phoneNumber: {type: String},
    dateOfBirth: {type: Date},
    country: {type: String},
    gender: {type: String, enum: ["Male", "Female", "Others"]}
});

module.exports = mongoose.model("User", userSchema);