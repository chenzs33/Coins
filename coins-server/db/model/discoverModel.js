const mongoose = require('mongoose');
const comment = require('./commentModel');
const moment = require('moment');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var discoverSchema = new Schema({
    userID: { type: String, required: true },
    createTime: { type: String, default: moment(new Date()).format('YYYY-MM-DD') },
    // avatarUrl: { type: String },
    // nickName: { type: String },
    content: { type: String },
    likeNum: { type: Number, default:0 },
    commentNum: { type: Number, default:0 },
    imgList: { type: Array },
    //保存用户文章评论的id
    comment: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
    //保存的用户id
    like: [Schema.Types.ObjectId],
});
// 将 scheme 对象转化为数据模型
var Discover = mongoose.model('discover', discoverSchema);  //该数据对象和集合相关联

module.exports = Discover