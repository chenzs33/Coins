const express = require('express')
const router = express.Router()
const Exchange = require('../db/model/exchangeModel')
const User = require('../db/model/userModel')

//提交兑换状态
router.post('/willExchange', (req, res) => {
    let {title,userID,condition} = req.body
    
    User.findOneAndUpdate({userID},{$inc:{"coins":Number(-condition)}})
    .then((data)=>{
        console.log('data=>',data);
        return  Exchange.insertMany({title,phone:data.phone,address:data.address,username:data.username})
    })
    .then(()=>{
        res.send({code: 2000, msg:'兑换成功'})
    })
    .catch((err)=>{
        res.send({code: 3001,msg:'兑换失败',err:err})
    })
})

//已兑换发货，更新状态为1
router.post('/exchanged', (req, res) => {
    let {_id} = req.body
    
    Exchange.update({_id},{status:1})
    .then(()=>{
        res.send({code: 2000, msg:'已兑换'})
    })
    .catch((err)=>{
        res.send({code: 3001,msg:'操作失败',err:err})
    })
})

router.post('/getInfoByPage', (req, res) => {
    let page = req.body.page || 1   //设置默认值
    let pageSize = req.body.pageSize || 20

    let count = 0

    let status = req.body.status

    Exchange.find({status})
    .then((list)=>{
        count=list.length //总条数
        return Exchange.find({status}).limit(Number(pageSize)).skip(Number((page-1)*pageSize))
    })
   .then((data)=>{
       let allpage = Math.ceil(count/pageSize)
        res.send({code: 2000, msg:'查询成功',list:data,count:count,allpage:allpage})
    })
    .catch((err)=>{
        res.send({code: 3001, msg:'查询失败',err})
    })
})

router.post('/getExchangeBykw', (req, res) => {
    let {kw} = req.body
    let reg = new RegExp(kw)    //创建一个正则表达式，匹配关键字
    Exchange.find({phone:{$regex:reg}})   //电话
   .then((data)=>{
       res.send({code: 2000,msg:'查询成功',list:data})
   })
   .catch((err)=>{
    res.send({code: 3001,msg:'查询失败',err})
   })
})

module.exports = router