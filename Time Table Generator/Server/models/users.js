const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  
    trim: true        
  },
  Num: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  role: { 
    type: String, 
    default: 'teacher' }
});

module.exports = mongoose.model('User', userSchema);