const mongoose = require('mongoose');
const moment = require('moment');
// const emptyData = require("../../static/emptyData.json")

// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var timeSchema = new Schema({
        index: { type: Number, min: 0, max: 47 }, //时间段
        tag: { type: Number, min: 0, max: 7 },  //颜色标签
        event: { type: String }, //发生事件,
        date: { type: String },
        userID: { type: String, required: true },
});
// 将 scheme 对象转化为数据模型
var Time = mongoose.model('time', timeSchema);  //该数据对象和集合相关联

module.exports = Time