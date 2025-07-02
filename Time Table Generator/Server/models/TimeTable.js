const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  startTime: {
    type: String, // Format: "HH:MM"
    required: true,
  },
  endTime: {
    type: String, // Format: "HH:MM"
    required: true,
  },
  type: {
    type: String,
    enum: ["Lecture", "Lab", "Break"],
    required: true,
  },
  subject: {
    type: String,
    default: null,
  },
  teacher: {
    type: String,
    default: null,
  },
  room: {
    type: String,
    default: null,
  },
  group: {
    type: String,
    default: null, // For lab divisions like A1, A2, etc.
  },
});

const TimetableSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String, // e.g. admin email or user id
    default: null,
  },
  timetable: [SlotSchema],
});

module.exports = mongoose.model("Timetable", TimetableSchema);
