const Job = require("../models/job");
exports.createJob = async (req, res) => {
    try {
        const { title, company, status, dateApplied, notes, jobLink } = req.body;
        const job = new Job({ title, company, status, dateApplied, notes, jobLink, createdBy: req.user.id });
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.id });
        res.json(jobs);
    } catch (err) {
        res.status(500).send(err);
    }
}


exports.getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const findJob = await Job.findOne({ _id: jobId, createdBy: req.user.id });
        if (!findJob) return res.status(404).json({ message: "Job not found" });
        res.json(findJob);
    } catch (err) {
        res.status(500).send(err);
    }
}


exports.updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const updateJob = await Job.findOneAndUpdate({ _id: jobId, createdBy: req.user.id }, req.body, { new: true });
        if (!updateJob) return res.status(404).json({ message: "Job not found" });
        res.json(updateJob);
    } catch (err) {
        res.status(500).send(err);
    }
}


exports.deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const deleteJob = await Job.findOneAndDelete({ _id: jobId, createdBy: req.user.id });
        if (!deleteJob) return res.status(404).json({ message: "Job not found or unauthorized" });
        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
}