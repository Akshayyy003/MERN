const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subName: {
    type: String,
    required: true,
    maxlength: 50
  },
  subCode: {
    type: String,
    required: true,
    unique: true,  
  },
  branch: {
    type: String,
    required : true,
  },
  semester: {
    type: Number,
    required: true,
  },
  lec: {
    type: Number,
    required: true,
  },
  lab: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Subject', subjectSchema);