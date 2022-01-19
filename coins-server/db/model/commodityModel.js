const mongoose = require('mongoose');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var commoditySchema = new Schema({
    title: { type: String, required: true },
    imgUrl: { type: String, required: true },
    condition: { type: Number, required: true },
    num: { type: Number, required: true }
});
// 将 scheme 对象转化为数据模型
var Commodity = mongoose.model('commodity', commoditySchema);  //该数据对象和集合相关联

module.exports = Commodity