const mongoose = require('mongoose');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    userID: { type: String },
    username: { type: String },
    feedbackText: { type: String}
});
// 将 scheme 对象转化为数据模型
var Feedback = mongoose.model('feedback', feedbackSchema);  //该数据对象和集合相关联

module.exports = Feedback