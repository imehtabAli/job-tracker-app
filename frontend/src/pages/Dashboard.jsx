import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const JOBS_PER_PAGE = 6;

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout, setUser, user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [editJobId, setEditJobId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        status: "Applied",
        dateApplied: "",
        notes: "",
        jobLink: "",
    });

    useEffect(() => {
        fetchUser();
        fetchJobs();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get("/user/me");
            setUser(response.data);
        } catch (err) {
            toast.error("Failed to fetch jobs");
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await api.get("/jobs");
            setJobs(response.data);
        } catch (err) {
            setError("Failed to fetch jobs");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/jobs", formData);
            setJobs([...jobs, response.data]);
            setFormData({ title: "", company: "", status: "Applied", dateApplied: "", notes: "", jobLink: "" });
            toast.success("Job added successfully!");
        } catch (err) {
            toast.error("Failed to add job");
        }
    };

    const handleDelete = async (jobId) => {
        try {
            await api.delete(`/jobs/${jobId}`);
            setJobs(jobs.filter((job) => job._id !== jobId));
            toast.success("Job deleted!");
        } catch (err) {
            toast.error("Failed to delete job");
        }
    };

    const handleStatusUpdate = async (jobId, newStatus) => {
        try {
            const response = await api.put(`/jobs/${jobId}`, { status: newStatus });
            setJobs(jobs.map((job) => job._id === jobId ? response.data : job));
            toast.success("Status updated!");
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleEditClick = (job) => {
        setEditJobId(job._id);
        setEditFormData({
            title: job.title,
            company: job.company,
            status: job.status,
            dateApplied: job.dateApplied?.slice(0, 10),
            notes: job.notes,
            jobLink: job.jobLink,
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSave = async (jobId) => {
        try {
            const response = await api.put(`/jobs/${jobId}`, editFormData);
            setJobs(jobs.map((job) => job._id === jobId ? response.data : job));
            setEditJobId(null);
            toast.success("Job updated!");
        } catch (err) {
            toast.error("Failed to update job");
        }
    };

    const handleEditCancel = () => {
        setEditJobId(null);
        setEditFormData({});
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.company.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "All" || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * JOBS_PER_PAGE,
        currentPage * JOBS_PER_PAGE
    );

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const stats = {
        total: jobs.length,
        applied: jobs.filter(j => j.status === "Applied").length,
        interview: jobs.filter(j => j.status === "Interview").length,
        offer: jobs.filter(j => j.status === "Offer").length,
        rejected: jobs.filter(j => j.status === "Rejected").length,
    };

    return (
        <div className="dashboard-container">
            {error && <p className="error-msg">{error}</p>}

            <div className="stats-bar">
                <div className="stat-card stat-total">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-card stat-applied">
                    <span className="stat-label">Applied</span>
                    <span className="stat-value">{stats.applied}</span>
                </div>
                <div className="stat-card stat-interview">
                    <span className="stat-label">Interview</span>
                    <span className="stat-value">{stats.interview}</span>
                </div>
                <div className="stat-card stat-offer">
                    <span className="stat-label">Offered</span>
                    <span className="stat-value">{stats.offer}</span>
                </div>
                <div className="stat-card stat-rejected">
                    <span className="stat-label">Rejected</span>
                    <span className="stat-value">{stats.rejected}</span>
                </div>
            </div>

            <div className="add-job-section">
                <h3>Add New Job</h3>
                <form className="job-form" onSubmit={handleAddJob}>
                    <input className="job-input" name="title" value={formData.title} placeholder="Job Title" onChange={handleChange} />
                    <input className="job-input" name="company" value={formData.company} placeholder="Company" onChange={handleChange} />
                    <select className="job-input" name="status" value={formData.status} onChange={handleChange}>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <input className="job-input" name="dateApplied" type="date" value={formData.dateApplied} onChange={handleChange} />
                    <input className="job-input" name="notes" value={formData.notes} placeholder="Notes" onChange={handleChange} />
                    <input className="job-input" name="jobLink" value={formData.jobLink} placeholder="Job Link" onChange={handleChange} />
                    <button className="auth-btn" type="submit">Add Job</button>
                </form>
            </div>



            <div className="search-filter-bar">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search by title or company..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <div className="filter-buttons">
                    {["All", "Applied", "Interview", "Offer", "Rejected"].map((status) => (
                        <button
                            key={status}
                            className={`filter-btn ${filterStatus === status ? "active-" + status.toLowerCase() : ""}`}
                            onClick={() => handleFilterChange(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="jobs-section">
                <h3>Your Jobs ({filteredJobs.length})</h3>
                {paginatedJobs.length === 0 ? (
                    <p className="no-jobs">No jobs found.</p>
                ) : (
                    <div className="jobs-grid">
                        {paginatedJobs.map((job) => (
                            <div key={job._id} className={`job-card status-${job.status.toLowerCase()}`}>
                                {editJobId === job._id ? (
                                    <div className="edit-form">
                                        <input className="job-input" name="title" value={editFormData.title} onChange={handleEditChange} placeholder="Job Title" />
                                        <input className="job-input" name="company" value={editFormData.company} onChange={handleEditChange} placeholder="Company" />
                                        <select className="job-input" name="status" value={editFormData.status} onChange={handleEditChange}>
                                            <option value="Applied">Applied</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Offer">Offer</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        <input className="job-input" name="dateApplied" type="date" value={editFormData.dateApplied} onChange={handleEditChange} />
                                        <input className="job-input" name="notes" value={editFormData.notes} onChange={handleEditChange} placeholder="Notes" />
                                        <input className="job-input" name="jobLink" value={editFormData.jobLink} onChange={handleEditChange} placeholder="Job Link" />
                                        <div className="edit-actions">
                                            <button className="btn-save" onClick={() => handleEditSave(job._id)}>Save</button>
                                            <button className="btn-cancel" onClick={handleEditCancel}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="job-card-header">
                                            <h4>{job.title}</h4>
                                            <span className="job-company">{job.company}</span>
                                        </div>
                                        <div className="job-card-body">
                                            <p><strong>Status:</strong> <span className="job-status">{job.status}</span></p>
                                            <p><strong>Date Applied:</strong> {job.dateApplied?.slice(0, 10)}</p>
                                            {job.notes && <p><strong>Notes:</strong> {job.notes}</p>}
                                            {job.jobLink && <a className="job-link" href={job.jobLink} target="_blank">View Job →</a>}
                                        </div>
                                        <div className="job-card-footer">
                                            <select className="status-select" value={job.status} onChange={(e) => handleStatusUpdate(job._id, e.target.value)}>
                                                <option value="Applied">Applied</option>
                                                <option value="Interview">Interview</option>
                                                <option value="Offer">Offer</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            <button className="btn-edit" onClick={() => handleEditClick(job)}>Edit</button>
                                            <button className="btn-delete" onClick={() => handleDelete(job._id)}>Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage((p) => p - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Prev
                        </button>
                        <div className="page-numbers">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`page-num ${currentPage === page ? "page-active" : ""}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 