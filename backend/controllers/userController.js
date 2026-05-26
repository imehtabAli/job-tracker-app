const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -confirmPassword");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, userName, phoneNumber, dateOfBirth, country, gender, profilePicture } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, userName, phoneNumber, dateOfBirth, country, gender, profilePicture },
            { new: true }
        ).select("-password -confirmPassword");
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

exports.changePassword = async (req, res) => {
    try {
        console.log("change password hit");
        console.log("body:", req.body);
        console.log("user:", req.user);
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await User.findById(req.user.id);
        console.log("user found:", user ? "yes" : "no");
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        console.log("isMatch:", isMatch);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save({ validateBeforeSave: false });

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.log("ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
}