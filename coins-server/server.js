const express = require('express')
const path = require('path')
const db = require('./db/connect')
const cronJob = require("cron").CronJob;
const fs = require("fs");
const http = require("http");
const https = require("https");
const cors = require("cors");

const app = express()
app.use(cors()); 
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');//添加这句话就可以正常返回数据了
    next();
})

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//允许跨域
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });


//https
const httpsOption = {
    key : fs.readFileSync("./https/4800165_chenzesen.top.key"),
    cert: fs.readFileSync("./https/4800165_chenzesen.top.pem")
}

//jwt
const JWT = require('./utils/jwt')
//session相关
const cookieParser = require('cookie-parser')
const session = require('express-session')
app.use(session({
    secret:'abcdefg',    //为了安全性的考虑设置secret属性
    cookie: {maxAge: 60*1000*24*7},   //设置过期时间
    resave: true,
    saveUninitialized: false,
}))

app.use('/public',express.static(path.join(__dirname,'./static')))

//使用路由
let userRouter = require('./router/userRouter')
let summaryRouter = require('./router/summaryRouter')
let commodityRouter = require('./router/commodityRouter')
let adminRouter = require('./router/adminRouter')
let discoverRouter = require('./router/discoverRouter')
let commentRouter = require('./router/commentRouter')
let timeRouter = require('./router/timeRouter')
let todoRouter = require('./router/todoRouter')
let feedbackRouter = require('./router/feedbackRouter')
let exchangeRouter = require('./router/exchangeRouter')

app.use('/api/user',userRouter)
app.use('/api/summary',summaryRouter)
app.use('/api/commodity',commodityRouter)
app.use('/api/admin',adminRouter)
app.use('/api/discover',discoverRouter)
app.use('/api/comment',commentRouter)
app.use('/api/time',timeRouter)
app.use('/api/todo',todoRouter)
app.use('/api/feedback',feedbackRouter)
app.use('/api/exchange',exchangeRouter)
//session-cookie
// app.use('/food',(req,res,next)=>{
//     console.log(req.body)
//     console.log(req.session)
//     if(req.session.login){
//         next()
//     }else{
//         res.send({err:-999,msg:'请先登录'})
//     }
// },foodRouter)

//jwt
// app.use('/food',(req,res,next)=>{
//     console.log(req.body)
//     let {token} = req.body
//     JWT.checkToken(token)
//     .then((data)=>{
//         next()
//     })
//     .catch((err)=>{
//         res.send({err:-998,msg:'token非法'})
//     })
// },foodRouter)

// http.createServer(app).listen(80);
// https.createServer(httpsOption, app).listen(443);

app.listen(5000,()=>{
   console.log('server start')
})


//定时每天0:10每30秒执行一次
// new cronJob('*/30 10 0 * * *', function () { 
//     //需要定时执行的任务代码写在这里
//     console.log('croncron')
// }, null, true);