const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, confirmPassword, profilePicture, phoneNumber, dateOfBirth, country, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, userName, email, password: hashedPassword, confirmPassword, profilePicture, phoneNumber, dateOfBirth, country, gender });
        await user.save();
        res.send("User registerd Successfully");
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("No user found.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(404).send("Incorrect Password.");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    } catch (err) {
        res.status(500).send(err);
    }
}


exports.forgotPassword = async (req, res) => {
    try {
        console.log("forgot password hit");
        console.log("email received:", req.body.email);
        console.log("MAIL_USER:", process.env.MAIL_USER);
        console.log("MAIL_PASS:", process.env.MAIL_PASS ? "exists" : "missing");
        console.log("CLIENT_URL:", process.env.CLIENT_URL);

        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No user found with that email" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: "Password Reset Request — JobTracker",
            html: `
                <div style="font-family: Inter, sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 12px; border: 1px solid #eee;">
                    <h2 style="color: #1a1a2e;">Reset Your Password</h2>
                    <p style="color: #555;">You requested a password reset. Click the button below to reset it:</p>
                    <a href="${resetLink}" style="display: inline-block; margin: 24px 0; padding: 12px 24px; background: #e94560; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
                    <p style="color: #888; font-size: 13px;">This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
                </div>
            `,
        });

        res.json({ message: "Reset link sent to your email" });
    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) return res.status(400).json({ message: "New password cannot be same as old password" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.json({ message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
