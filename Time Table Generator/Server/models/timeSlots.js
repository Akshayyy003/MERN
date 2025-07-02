const mongoose = require('mongoose');

const TSSchema = new mongoose.Schema({
  slotlen: {
    type: Number,
    required: true
  },
  breakLen: {
    type: Number,
    required: true
  },
  slotsBeforeBreak: {
    type: Number,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  branch:{
    type: String,
    required : true,
    unique : true
  }
});

module.exports = mongoose.model('TS', TSSchema);