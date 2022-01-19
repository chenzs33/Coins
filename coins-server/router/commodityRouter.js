const express = require('express')
const router = express.Router()
const Commodity = require('../db/model/commodityModel')

router.post('/add', (req, res) => {
    let {title,imgUrl,condition,num} = req.body
    //判断参数是否正确
    Commodity.insertMany({title,imgUrl,condition,num})
   .then((data)=>{
       res.send({code: 2000, msg:'添加成功'})
   })
   .catch((err)=>{
       res.send(err)
    res.send({code: 3001,msg:'添加失败'})
   })
})

router.post('/getInfoByPage', (req, res) => {
    let page = req.body.page || 1   //设置默认值
    let pageSize = req.body.pageSize || 8

    let count = 0

    Commodity.find()
    .then((list)=>{
        count=list.length //总条数
        return Commodity.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
    })
   .then((data)=>{
       let allpage = Math.ceil(count/pageSize)
        res.send({code: 2000, msg:'查询成功',list:data,count:count,allpage:allpage})
    })
    .catch((err)=>{
        res.send({code: 3001, msg:'查询失败',err})
    })
})

router.post('/getGoodBykw', (req, res) => {
    let {kw} = req.body
    let reg = new RegExp(kw)    //创建一个正则表达式，匹配关键字
    Commodity.find({title:{$regex:reg}})   //名字
   .then((data)=>{
       res.send({code: 2000,msg:'查询成功',list:data})
   })
   .catch((err)=>{
    res.send({code: 3001,msg:'查询失败',err})
   })
})


router.post('/del', (req, res) => {
    let {_id} = req.body
    //单个删除 ，多个删除（{_id:{[]}}）
    Commodity.remove({_id})  
   .then((data)=>{
       res.send({code: 2000, msg:'删除成功'})
   })
   .catch((err)=>{
    res.send({code: 3001, msg:'删除失败',err})
   })
})


router.post('/update', (req, res) => {

    let {title,imgUrl,condition,num,_id} = req.body
    Commodity.updateOne({_id},{title,imgUrl,condition,num})
   .then((data)=>{
       res.send({code: 2000, msg:'修改成功'})
   })
   .catch((err)=>{
     res.send({code: 3001, msg:'修改失败',err})
   })
})


// router.post('/exchange', (req, res) => {

//     let {userID,title,condition} = req.body

//     Commodity.updateOne({_id},{title,imgUrl,condition,num})
//    .then((data)=>{
//        res.send({code: 2000, msg:'修改成功'})
//    })
//    .catch((err)=>{
//      res.send({code: 3001, msg:'修改失败',err})
//    })
// })


module.exports = router