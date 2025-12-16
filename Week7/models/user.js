// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Username phải là email, duy nhất (unique), và bắt buộc (required)
  username: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  // Mật khẩu đã được mã hóa (hashed)
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;