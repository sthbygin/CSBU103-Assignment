var express = require('express');
var router = express.Router();
const User = require('../models/user'); // Import User model để tìm tài khoản
const bcrypt = require('bcrypt');       // Import bcrypt để so sánh mật khẩu

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

/* GET Login page. */
router.get('/login', function(req, res, next) {
   // Hiển thị form login
   res.render('login', { error: null });
});

/* POST Login handler - Xử lý đăng nhập thực tế */
router.post('/login', async function(req, res, next) {
    const { username, password } = req.body;

    try {
        // 1. Tìm user trong Database theo username (email)
        const user = await User.findOne({ username: username });

        // 2. Nếu không tìm thấy user
        if (!user) {
            return res.render('login', { error: 'Tài khoản không tồn tại!' });
        }

        // 3. So sánh mật khẩu nhập vào với mật khẩu mã hóa trong DB
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Đăng nhập thành công!
            // Lưu thông tin vào session (để server nhớ là đã login)
            req.session.loggedIn = true;
            req.session.user = user;


            res.send("<h1>Đăng nhập thành công! </h1><p>Xin chào " + user.username + "</p>");
        } else {
            // Sai mật khẩu
            return res.render('login', { error: 'Sai mật khẩu!' });
        }

    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Lỗi hệ thống khi đăng nhập.' });
    }
});

module.exports = router;