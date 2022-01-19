const mongoose = require('mongoose');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});
// 将 scheme 对象转化为数据模型
var Admin = mongoose.model('admin', adminSchema);  //该数据对象和集合相关联

module.exports = Admin