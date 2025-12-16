// app.js

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session")
// Import module db (chứa hàm connect)
const db = require('./models/db') 

// Import các Controller bạn đã tạo
const { IndexController, UserController } = require('./controllers')

// Xóa dòng này vì chúng ta không còn sử dụng các biến môi trường Docker/Local nữa:
// const { constant } = require('./lib') 

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ***************************************************************
// THIẾT LẬP KẾT NỐI MONGODB ATLAS
// Chắc chắn rằng chuỗi này đã được thay bằng THÔNG TIN XÁC THỰC của bạn,
// bao gồm tên database (assignmentdb) và mật khẩu đã URL-encoded!
const ATLAS_URI = 'mongodb+srv://appUser:Abc%4012399@cluster0.k6xlpwe.mongodb.net/assignmentdb?retryWrites=true&w=majority&appName=Cluster0'

// THÊM LỆNH GỌI HÀM KẾT NỐI (Đây là dòng còn thiếu gây ra lỗi timeout)
db.connect(ATLAS_URI);
// ***************************************************************

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || '12345?a',
    name: "app",
    resave: true,
    saveUninitialized: true
    // cookie: { maxAge: 6000 } /* 6000 ms? 6 seconds -> wut? :S */
  })
);

// Khai báo các Routes
// Route /users sẽ được xử lý bởi UserController (chứa route /users/register)
app.use('/', IndexController);
app.use('/users', UserController);

const logout = function(req, res, next) {
  // debug("logout()"); // Dùng debug library, nếu không dùng thì có thể xóa
  req.session.loggedIn = false;
  res.redirect("/")
}

app.get("/logout", logout, (req, res) => {
  res.render('login')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use('/error', function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;