const express = require('express')
const router = express.Router()
const Summary = require('../db/model/summaryModel')

router.post('/add', (req, res) => {
    let { userID, target, book, movie, significant, goodSentence, stupid, point } = req.body
    //判断参数是否正确
    Summary.insertMany({ userID, target, book, movie, significant, goodSentence, stupid, point })
        .then((data) => {
            res.send({ code: 2000, msg: '添加成功', list: data })
        })
        .catch((err) => {
            res.send({ code: 4000, msg: '添加失败', err: err })
        })
})

// 获取近一周日期
// var currentFirstDate;
// var dateArray = [];

// var formatDate = function(date) {
// 	var year = date.getFullYear();
// 	var month = (date.getMonth() + 1);
// 	var day = date.getDate();
// 	var week = '(' + ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()] + ')';
// 	// return year + month + day + ' ' + week;
// 	return year + '.' + month + '.' + day
// };
// var addDate = function(date, n) {
// 	date.setDate(date.getDate() + n);
// 	return date;
// };

// var setDate = function(date) {
// 	var week = date.getDay() - 1;
// 	date = addDate(date, week * -1);
// 	currentFirstDate = new Date(date);
// 	for (let i = 0; i < 7; i++) {
// 		let text = formatDate(i == 0 ? date : addDate(date, 1));
// 		dateArray[i] = text
// 	}
// };
// setDate(new Date());
// console.log(dateArray[0]);


router.post('/getSUMInfo', (req, res) => {

    let { date, userID } = req.body

    Summary.findOne({ $and: [{ date }, { userID }] })
        .then((data) => {
            if (data == null) {
                Summary.insertMany({ date, userID })
            }
            return data;
        })
        .then((data) => {
            res.send({ code: 2000, msg: '查询成功', list: data })
        })
        .catch((err) => {
            res.send({ code: 4000, msg: '查询失败', err })
        })




})


router.post('/updateSUM', (req, res) => {

    let { target, book, movie, significant, goodSentence, stupid, point, _id } = req.body
    Summary.updateOne({ _id }, { target, book, movie, significant, goodSentence, stupid, point })
        .then((data) => {
            res.send({ code: 2000, msg: '修改成功', list: data })
        })
        .catch((err) => {
            res.send(err)
            res.send({ code: 4000, msg: '修改失败', err })
        })
})



module.exports = router