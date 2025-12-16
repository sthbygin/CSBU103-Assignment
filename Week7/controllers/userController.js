// controllers/UserController.js
const express = require('express');
const router = express.Router();
// Import User model bạn vừa tạo
const User = require('../models/user'); 
// Import thư viện mã hóa
const bcrypt = require('bcrypt'); 

// GET /users/register -> Hiển thị form đăng ký
router.get('/register', (req, res) => {
  // Đảm bảo bạn có file views/register.ejs
  res.render('register', { error: null }); 
});

// POST /users/register -> Xử lý đăng ký
router.post('/register', async (req, res) => {
  const { username, password, repassword } = req.body;

  // --- Backend Validation ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Regex: Tối thiểu 6 ký tự, có 1 số, 1 ký tự đặc biệt
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

  if (!emailRegex.test(username)) {
    return res.render('register', { error: 'Invalid email format' });
  }
  if (!passwordRegex.test(password)) {
    return res.render('register', { error: 'Password must be >= 6 chars, contain 1 number and 1 special char.' });
  }
  if (password !== repassword) {
    return res.render('register', { error: 'Passwords do not match.' });
  }

  try {
    // 1. Kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.render('register', { error: 'Email already registered.' });
    }

    // 2. Mã hóa mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Tạo user mới và lưu vào DB
    const newUser = new User({
      username: username,
      password: hashedPassword
    });

    await newUser.save();

    // Đăng ký thành công -> Chuyển hướng (ví dụ: về trang đăng nhập)
    res.redirect('/login'); 

  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Database error occurred during registration.' });
  }
});

module.exports = router;