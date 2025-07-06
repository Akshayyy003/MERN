const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const subjectRoutes = require("./routes/subjectRoutes")
const teacherRoutes = require("./routes/teacherRoutes")
const locRoutes = require("./routes/locRoutes")
const Ts = require("./routes/tsRoutes")
const PrintSub = require("./routes/PrintSubRoutes")
const deleteSub = require("./routes/deleteSubRoutes")
const deleteTeacher = require("./routes/teacherDeleteRoutes")
const deleteLoc = require("./routes/DeleteLoc")
const fetchTS = require("./routes/TTBuilder")
const timetableRoutes = require('./routes/timetable');
const changePass = require('./routes/ChangePass');
const forgotPass = require("./routes/ForgotPass")
const subjectRequirementsRoute = require('./routes/subjectRequirements');
// const generate = require("./routes/autoGenerateLive")

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/TTG")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Use routes

app.use('/api/subject-requirements', subjectRequirementsRoute);

app.use("/api", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/locations", locRoutes);
app.use("/api/timeslots", Ts);
app.use("/api/delete", PrintSub);
app.use("/home", deleteSub);
app.use("/api/teachers", deleteTeacher);
app.use("/api/labs-classes", deleteLoc);
app.use('/api/timetable', timetableRoutes);
app.use('/api/cp', changePass);
app.use('/api/forgot', forgotPass);
app.use('/api/forgot', forgotPass);
// app.use('/api/generate', generate);

app.use('/api', fetchTS);

// Start server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
