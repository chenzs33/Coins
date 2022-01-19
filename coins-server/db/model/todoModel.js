const mongoose = require('mongoose');
const moment = require('moment')
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var currentFirstDate;
	
var formatDate = function(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var day = date.getDate();
    return year + '-' + month + '-' + day
};
var addDate = function(date, n) {
    date.setDate(date.getDate() + n);
    return date;
};

var setDate = function(date) {
    var week = date.getDay() - 1;
    date = addDate(date, week * -1);
    currentFirstDate = new Date(date);
    let text = formatDate(date);
    return text;
};

var todoSchema = new Schema({
    // date: { type: String, default: moment(new Date()).format('YYYY-MM-DD')},
    date: { type: String, default: moment(new Date()).format('YYYY-MM-DD')},
    userID: { type: String, required: true },
    name: { type: String, required: true },
    completed: { type: Boolean, required: true }
});
// 将 scheme 对象转化为数据模型
var Todo = mongoose.model('todo', todoSchema);  //该数据对象和集合相关联

module.exports = Todo