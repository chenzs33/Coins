const express = require('express')
const request = require('request')
const router = express.Router()
const User = require('../db/model/userModel')
const Mail = require('../utils/mail')
const JWT = require('../utils/jwt')

let codes = {}  //通过内存保存验证码

//开发者信息
const appid = 'wx4e03af15e71b5103';
const secret = 'be0538eeaf9d9e7eff13415cc4ac35a9';
const authorizationCode = 'authorization_code';
let sessionKey = null;
let openid = null;

router.get('/wxLogin', (req, res) => {
    // 获取到登录后的code
    const { code, userInfo } = req.query;
    // console.log('code/userInfo==>',code,userInfo)
    // 向微信服务器发送信息获取到 openid 和 session_key
    request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${authorizationCode}`, (err, response, body) => {
        if (err) console.log(err);
        const data = JSON.parse(body);
        /*
        签名校验以及数据加解密涉及用户的会话密钥session_key。 需要保存在服务器
        openid 判断是否是同一个用户
        session_key 判断用户是否失效
    
        data: {
          openid: '**********',
          session_key: '********'
        }
        */
        const userID = data.openid
        const userInfoJson = JSON.parse(userInfo)
        User.find({ userID })
            .then((data) => {
                if (data.length === 0) {
                    return User.insertMany({ userID:userID,userInfo, username:userInfoJson.nickName, avatarUrl:userInfoJson.avatarUrl })
                }
            })
            .then(() => {
                // const resData = Object.assign(data, userInfo)
                res.send({ code: 2000, loginData: data, userInfo: userInfoJson, msg: '登录成功' })
            })
            .catch((err) => {
                res.send({ code: 3001, msg: '登录失败', err })
            })
    })
})

//注册
/**
 * @api {post} /user/reg 用户注册
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} us 用户名.
 * @apiParam {Number} ps 密码.
 * @apiParam {Number} code 验证码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/reg', (req, res) => {
    let { username, password, verCode } = req.body
    if (!username || !password) {
        return res.send({ code: 1001, msg: '参数错误' })
    }
    else if (username && password) {
        if(codes[username]!=verCode){
            return res.send({ code: 3001, msg: '验证码错误' })
        }
        User.findOne({ username })
            .then((data) => {
                console.log("reg.find==>",data)
                if (data == null) {
                    return User.insertMany({ username: username, password: password, userID: username, mail:username, avatarUrl:"http://m.qpic.cn/psc?/V145I5S33qSIMa/6tCTPh7N*X6CBkvkDvKlZUxEtLwHUSBH.5HoTxyEbOvOV7SoUTm*Sli44AlLLsPBdARQn9jOB1oJVoElASLlOqAPigwblNv1Dp.ihallglQ!/b&bo=gAKAAgAAAAABByA!&rf=viewer_4"})
                } else {
                    res.send({ code: 2001, msg: '用户名已存在' })
                }
            })
            .then(() => {
                res.send({ code: 2000, msg: '注册成功' })
            })
            .catch((err) => {
                res.send({ code: 3002, msg: '注册失败', err:err })
            })
    } else {
        return res.send({ code: 1001, msg: '参数错误' })
    }
})

//退出
router.post('/logOut', (req, res) => {
    // req.session.destroy();
    res.send({ code: 2000, msg: '退出成功' })
})

//登录
router.post('/mailLogin', (req, res) => {
    let { mail, password } = req.body
    if (!mail || !password) {
        return res.send({ code: 1001, msg: '参数错误' })
    }
    User.find({ mail, password})
        .then((data) => {
            console.log('loginData=>',data)
            if (data.length > 0) {
                //登录成功后将用户的相关信息存到session中
                // req.session.login = true
                // req.session.name = us

                //jwt
                // let token = JWT.creatToken({login:true,name:us})

                res.send({ code: 2000, msg: '登录成功', loginData: data })
            } else {
                res.send({ code: 2001, msg: '用户名或密码不正确' })
            }
        })
        .catch((err) => {
            return res.send({ code: 3001, msg: '内部错误',err })
        })

})

//发送验证码
router.post('/getMailCode',(req,res)=>{
    let {mail} = req.body
    let verCode = parseInt(Math.random()*10000)

    codes[mail] = verCode  //将邮箱和邮箱匹配的验证码保存到缓存中
    console.log(codes)

    Mail.send(mail,verCode)
    .then(()=>{
        res.send({ code:2000, msg: '发送验证码成功' })
    })
    .catch((err)=>{
        console.log(err)
        res.send({ code:3001, msg: '发送验证码失败',err:err })
    })
})

//获取用户信息
router.post('/getUserInfo',(req,res)=>{
    let {userID} = req.body

    User.findOne({userID})
    .then((data)=>{
        res.send({ code:2000, msg: '请求成功',data: data })
    })
    .catch((err)=>{
        res.send({ code:3001, msg: '请求失败',err:err })
    })
})

//更新用户信息
router.post('/updateUserInfo',(req,res)=>{
    let {userID,phone,mail,username,address} = req.body

    User.update({userID},{phone,mail,username,address})
    .then((data)=>{
        res.send({ code:2000, msg: '更新成功',data: data })
    })
    .catch((err)=>{
        res.send({ code:3001, msg: '更新失败',err:err })
    })
})

router.post('/getUserList', (req, res) => {

    let page = req.body.page || 1   //设置默认值
    let pageSize = req.body.pageSize || 20

    let count = 0

    User.find()
    .then((list)=>{
        count=list.length //总条数
        return User.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
    })
   .then((data)=>{
       let allpage = Math.ceil(count/pageSize)
        res.send({code: 2000, msg:'查询成功',list:data,count:count,allpage:allpage})
    })
    .catch((err)=>{
        res.send({code: 3001, msg:'查询失败',err})
    })
})

router.post('/getUserByPhone', (req, res) => {
    let {phone} = req.body
    // let reg = new RegExp(phone)    //创建一个正则表达式，匹配关键字
    User.find({phone})   //手机
   .then((data)=>{
       res.send({code: 2000,msg:'查询成功',list:data})
   })
   .catch((err)=>{
    res.send({code: 3001,msg:'查询失败',err})
   })
})

module.exports = router