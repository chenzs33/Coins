const mongoose = require('mongoose');
const moment = require('moment');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    userID: { type: String, required: true },
    content: { type: String, required: true },
    createTime: { type: String, default: moment(new Date()).format('YYYY-MM-DD') },
    discoverID: { type: String, required: true }
});
// 将 scheme 对象转化为数据模型
var Comment = mongoose.model('comment', commentSchema);  //该数据对象和集合相关联

module.exports = Comment