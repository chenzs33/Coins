const express = require('express')
const router = express.Router()
const Feedback = require('../db/model/feedbackModel')

router.post('/add', (req, res) => {
    let { userID,username,feedbackText } = req.body
    //判断参数是否正确
    Feedback.insertMany({ userID,username,feedbackText })
        .then((data) => {
            res.send({ code: 2000, msg: '添加成功'})
        })
        .catch((err) => {
            res.send({ code: 4000, msg: '添加失败', err: err })
        })
})

router.post('/getFeedbackList', (req, res) => {

    let page = req.body.page || 1   //设置默认值
    let pageSize = req.body.pageSize || 20

    let count = 0

    Feedback.find()
    .then((list)=>{
        count=list.length //总条数
        return Feedback.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
    })
   .then((data)=>{
       let allpage = Math.ceil(count/pageSize)
        res.send({code: 2000, msg:'查询成功',list:data,count:count,allpage:allpage})
    })
    .catch((err)=>{
        res.send({code: 3001, msg:'查询失败',err})
    })
})



module.exports = router