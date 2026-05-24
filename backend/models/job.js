const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Applied", "Interview", "Offer", "Rejected"], default: "Applied" },
    dateApplied: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
    jobLink: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);