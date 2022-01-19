const mongoose = require('mongoose');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var exchangeSchema = new Schema({
    userID: { type: String },
    title: { type: String },
    username: {type: String },
    phone:{ type: String },
    address: { type: String },
    status: { type: Number, default:0 }    //0为待兑换，1为已兑换
});
// 将 scheme 对象转化为数据模型
var Exchange = mongoose.model('exchange', exchangeSchema);  //该数据对象和集合相关联

module.exports = Exchange