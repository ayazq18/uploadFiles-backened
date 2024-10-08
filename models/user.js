const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
      type: String,
      required: false
    },
    Name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: false
  },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;