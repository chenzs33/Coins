const express = require('express')
const router = express.Router()
const Admin = require('../db/model/adminModel')
const JWT = require('../utils/jwt')

router.post('/addAdmin', (req, res) => {
    let { username, password} = req.body
    if (!username || !password ) {
        return res.send({ code: 1001, msg: '参数错误' })
    }
    else if (username && password) {
        Admin.find({ username })
            .then((data) => {
                console.log(data)
                if (data.length === 0) {
                    return Admin.insertMany({ username: username, password: password })
                } else {
                    res.send({ code: 2001, msg: '用户名已存在' })
                }
            })
            .then(() => {
                res.send({ code: 2000, msg: '操作成功' })
            })
            .catch((err) => {
                res.send({ code: 3001, msg: err })
            })
    } else {
        return res.send({ code: 1001, msg: '参数错误' })
    }
})

router.post('/logOut',(req,res)=>{
    // req.session.destroy();
    res.send({ code: 2000, msg: '退出成功' })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body
    if (!username || !password) {
        return res.send({ code: 1001, msg: '参数错误' })
    }
    Admin.find({ username: username, password: password })
        .then((data) => {
            if (data.length > 0) {
                //jwt
                let token = JWT.creatToken({login:true,name:username})
                
                res.send({ code: 2000, msg: '登录成功', token:token })
            } else {
                res.send({ code: 2002, msg: '用户名或密码不正确' })
            }
        })
        .catch((err) => {
            return res.send({ code: 3001, msg: err })
        })

})

router.post('/updateAdmin', (req, res) => {

    let {_id,password} = req.body
   Admin.updateOne({_id},{password})
   .then((data)=>{
       res.send({code:2000,msg:'修改成功'})
   })
   .catch((err)=>{
    res.send({code:3001,msg:'修改失败',err})
   })
})

router.post('/getAdminByPage', (req, res) => {
    let page = req.body.page || 1   //设置默认值
    let pageSize = req.body.pageSize || 10

    let count = 0

    Admin.find()
    .then((list)=>{
        count=list.length //总条数
        return Admin.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
    })
   .then((data)=>{
       let allpage = Math.ceil(count/pageSize)
        res.send({code:2000,msg:'查询成功',info:{list:data},count:count,allpage:allpage})
    })
    .catch((err)=>{
        res.send(err)
        res.send({code:3001,msg:'查询失败'})
    })
})

router.post('/deleteAdmin', (req, res) => {
    let {_id} = req.body
    //单个删除 ，多个删除（{_id:{[]}}）
   Admin.remove({_id})  
   .then((data)=>{
       res.send({code:2000,msg:'删除成功'})
   })
   .catch((err)=>{
    res.send({code:3001,msg:'删除失败',err})
   })
})

router.post('/getAdminBykw', (req, res) => {
    let {kw} = req.body
    let reg = new RegExp(kw)    //创建一个正则表达式，匹配关键字
   Admin.find({username:{$regex:reg}})   //名字
   .then((data)=>{
       res.send({code:2000,msg:'查询成功',list:data})
   })
   .catch((err)=>{
    res.send({code:3001,msg:'查询失败',err:err})
   })
})

module.exports = router