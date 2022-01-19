'use strict';
const nodemailer = require('nodemailer');

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: '33712112@qq.com', // generated ethereal user
            pass: 'fnqoeubgdhebbhfc' // generated ethereal password
        }
    });

    function send(mail,code){
        let mailObj = {
            from: '"zesenchen" <33712112@qq.com>', // sender address
            to: mail, // list of receivers
            subject: '时间感知验证码', // Subject line
            text: `Hello world! 验证码为：${code}`, // plain text body
            // html: '<b>Hello world?</b>' // html body
        }

        return new Promise((resolve, reject)=>{
            transporter.sendMail(mailObj,(err,data)=>{
                if(err){
                    reject()
                }else{
                    resolve()
                }
            });
        
        })
    }

    module.exports = {send}
