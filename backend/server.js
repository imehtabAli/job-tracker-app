require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const {connectDB} = require("./config/db")
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
app.use(express.json());
app.use(cors({origin: "https://job-tracker-app-virid.vercel.app/login"}));
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
    res.send("Server is live.");
})

app.listen(process.env.PORT, ()=> {
    console.log(`This app is listening to port ${process.env.PORT}`);
})