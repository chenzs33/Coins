const mongoose = require('mongoose');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var userSchema = new Schema({
    phone: { type: Number },
    mail: { type: String },
    address: { type: String },
    userID: { type: String },
    userInfo: { type: Object },
    username: { type: String },
    password: { type: String },
    avatarUrl: { type: String },
    coins: { type: Number, default: 0 }
});
// 将 scheme 对象转化为数据模型
var User = mongoose.model('user', userSchema);  //该数据对象和集合相关联

module.exports = User