const express = require('express')
const router = express.Router()
const Todo = require('../db/model/TodoModel')
const User = require('../db/model/userModel')

router.post('/add', (req, res) => {
    let {userID,name,completed} = req.body
    //判断参数是否正确
    Todo.insertMany({userID,name,completed})
   .then((data)=>{
       res.send({code: 2000, msg:'添加成功'})
   })
   .catch((err)=>{
       res.send({code: 3001,msg:'添加失败',err})
   })
})

// router.post('/getInfoByPage', (req, res) => {
//     let page = req.body.page || 1   //设置默认值
//     let pageSize = req.body.pageSize || 8

//     let count = 0

//     Todo.find()
//     .then((list)=>{
//         count=list.length //总条数
//         return Todo.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
//     })
//    .then((data)=>{
//        let allpage = Math.ceil(count/pageSize)
//         res.send({code: 2000, msg:'查询成功',list:data,count:count,allpage:allpage})
//     })
//     .catch((err)=>{
//         res.send({code: 3001, msg:'查询失败',err})
//     })
// })

router.post('/getInfo', (req, res) => {
    // let {kw} = req.body
    // let reg = new RegExp(kw)    //创建一个正则表达式，匹配关键字
    // Todo.find({userID:{$regex:reg}})   //名字
    let {userID,date} = req.body
    Todo.find({$and:[{userID:userID},{date:date}]}) 
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
    Todo.remove({_id})  
   .then((data)=>{
       res.send({code: 2000, msg:'删除成功'})
   })
   .catch((err)=>{
    res.send({code: 3001, msg:'删除失败',err})
   })
})


router.post('/update', (req, res) => {

    let {completed,_id,userID} = req.body
    Todo.updateOne({_id},{completed})
    .then(()=>{
        if(completed){
            return User.update({"userID":userID},{$inc:{"coins":1}})
        }else{
            return User.update({"userID":userID},{$inc:{"coins":-1}})
        }
    })
   .then((data)=>{
       res.send({code: 2000, msg:'修改成功'})
   })
   .catch((err)=>{
     res.send({code: 3001, msg:'修改失败',err})
   })
})

module.exports = router