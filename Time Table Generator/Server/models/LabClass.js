const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
    maxlength: 50
  },
  numberOfLabs: {
    type: String,
    required: true,
  },
  numberOfClasses: {
    type: String,
    required: true,
  },
  prefix:{
    type: String , 
    required : true,
    unique : true,
  }
});

module.exports = mongoose.model('Location', LocationSchema);