const express = require('express')
const router = express.Router()
const Discover = require('../db/model/discoverModel')
const User = require('../db/model/userModel')
const Comment = require('../db/model/commentModel')

router.post('/add', (req, res) => {
    let {
        userID,
        content,
        imgList
    } = req.body
    Discover.insertMany({
        userID,
            content,
            imgList
        })
        .then((data) => {
            res.send({
                code: 2000,
                msg: '添加成功'
            })
        })
        .catch((err) => {
            res.send(err)
            res.send({
                code: 3001,
                msg: '添加失败'
            })
        })
})


router.post('/getDiscoverByPage', (req, res) => {
    let page = req.body.page || 1 //设置默认值
    let pageSize = req.body.pageSize || 10

    let count = 0


    Discover.find()
        .then((list) => {
            count = list.length //总条数
            //         return Discover.find().populate('comment').limit(Number(pageSize)).skip(Number((page-1)*pageSize))
            return Discover.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "userID",
                    as: "userInfo"
                }
            }, {
                $lookup: {
                    from: "comments",
                    localField: "comment",
                    foreignField: "_id",
                    as: "comment"
                }
            }]).limit(Number(pageSize)).skip(Number((page - 1) * pageSize)).sort({createTime:-1})
        })
        .then((data) => {
            let allpage = Math.ceil(count / pageSize)
            res.send({
                code: 2000,
                msg: '查询成功',
                list: data,
                count: count,
                allpage: allpage
            })
        })
        .catch((err) => {
            res.send(err)
            res.send({
                code: 3001,
                msg: '查询失败'
            })
        })
})


router.post('/getDiscoverBykw', (req, res) => {
    let {
        kw
    } = req.body
    let reg = new RegExp(kw) //创建一个正则表达式，匹配关键字
    Discover.find({
            content: {
                $regex: reg
            }
        }) //名字
        .then((data) => {
            res.send({
                code: 2000,
                msg: '查询成功',
                list: data
            })
        })
        .catch((err) => {
            res.send({
                code: 3001,
                msg: '查询失败',
                err: err
            })
        })
})

//点赞
router.post('/like', (req, res) => {
    Discover.findOne({
        _id: req.body._id
    }).exec(function (err, doc1) {
        if (err) {
            res.status(500).send('Serve error!');
            return;
        }
        User.findOne({
            userID: req.body.userID
        }).exec(function (err, doc2) {
            if (err) {
                res.status(500).send('Serve error!');
                return;
            }
            //doc2._id 用户ID doc1._id 当前文章的id
            let like = [];
            like = doc1.like;
            let bool = like.find(function (item) {
                return item.toString() === doc2._id.toString();
            })
            if (bool) {
                res.status(200).send({
                    message: '用户以点赞过！',
                    length: like.length
                });
                return;
            } else {
                like.push(doc2._id);
            }
            Discover.updateOne({
                _id: req.body._id
            }, {
                like: like,
                $inc: {
                    "likeNum": 1
                }
            }).exec(function () {
                console.log('成功!');
                res.status(200).send({
                    message: '点赞成功！',
                    length: like.length
                });
            })
        })
    })
})

router.post('/del', (req, res) => {
    let {_id} = req.body
    //单个删除 ，多个删除（{_id:{[]}}）
    Discover.remove({_id})  
   .then((data)=>{
       res.send({code: 2000, msg:'删除成功'})
   })
   .catch((err)=>{
    res.send({code: 3001, msg:'删除失败',err})
   })
})

module.exports = router