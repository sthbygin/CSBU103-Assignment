// models/db.js
const mongoose = require('mongoose');
const debug = require('debug')('myapp:db'); 

// Hàm này sẽ được gọi từ app.js để bắt đầu kết nối
const connect = (url) => {
    mongoose.connect(url)
    .then(() => debug('MongoDB connection successful.'))
    .catch(err => {
        // Lỗi này xảy ra do sai chuỗi kết nối hoặc lỗi Network Access (Timeout 10s)
        debug('MongoDB connection error (Check ATLAS_URI and Network Access!):', err); 
    });
}

// Export hàm connect để app.js có thể sử dụng
module.exports = { connect };