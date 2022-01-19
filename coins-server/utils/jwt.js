const jwt = require('jsonwebtoken')
const secret = 'qwertyuiopasdfghjklzxcvbnm'

function creatToken(payload){
    payload.ctime=Date.now() //创建时间
    // playload.exp = 1000*60*24*7
    return jwt.sign(payload,secret)
}

function checkToken(token){
    return new Promise((resovle,reject)=>{
        jwt.verify(token,secret,(err,data)=>{
            if(err){
                reject('token验证失败')
            }
            resovle(data)
        })
    })
}

module.exports={
    creatToken,checkToken
}